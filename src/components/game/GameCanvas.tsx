import { useRef, useEffect, useCallback } from "react";
import { GameState } from "./FlappyBird";

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

interface GameCanvasProps {
  gameState: GameState;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

export const GameCanvas = ({ gameState, onGameOver, onScoreUpdate }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const gameDataRef = useRef({
    bird: { x: 120, y: 200, velocity: 0, rotation: 0 } as Bird,
    pipes: [] as Pipe[],
    score: 0,
    frameCount: 0,
    isGameRunning: false,
  });

  // Game constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const BIRD_SIZE = 30;
  const PIPE_WIDTH = 80;
  const PIPE_GAP = 180;
  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const PIPE_SPEED = 3;

  const resetGame = useCallback(() => {
    gameDataRef.current = {
      bird: { x: 120, y: 200, velocity: 0, rotation: 0 },
      pipes: [],
      score: 0,
      frameCount: 0,
      isGameRunning: false,
    };
  }, []);

  const createPipe = useCallback((x: number): Pipe => {
    const minTopHeight = 50;
    const maxTopHeight = CANVAS_HEIGHT - PIPE_GAP - 100;
    const topHeight = Math.random() * (maxTopHeight - minTopHeight) + minTopHeight;
    
    return {
      x,
      topHeight,
      bottomY: topHeight + PIPE_GAP,
      passed: false,
    };
  }, []);

  const checkCollision = useCallback((bird: Bird, pipes: Pipe[]): boolean => {
    // Ground collision
    if (bird.y + BIRD_SIZE >= CANVAS_HEIGHT - 50 || bird.y <= 0) {
      return true;
    }

    // Pipe collision
    for (const pipe of pipes) {
      if (
        bird.x + BIRD_SIZE > pipe.x &&
        bird.x < pipe.x + PIPE_WIDTH &&
        (bird.y < pipe.topHeight || bird.y + BIRD_SIZE > pipe.bottomY)
      ) {
        return true;
      }
    }

    return false;
  }, []);

  const jump = useCallback(() => {
    if (gameState === "playing" && gameDataRef.current.isGameRunning) {
      gameDataRef.current.bird.velocity = JUMP_FORCE;
      gameDataRef.current.bird.rotation = -20;
    }
  }, [gameState]);

  const gameLoop = useCallback(() => {
    if (!canvasRef.current || gameState !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameData = gameDataRef.current;
    
    // Update bird physics
    gameData.bird.velocity += GRAVITY;
    gameData.bird.y += gameData.bird.velocity;
    gameData.bird.rotation = Math.min(gameData.bird.rotation + 3, 45);

    // Update pipes
    gameData.frameCount++;
    if (gameData.frameCount % 120 === 0) {
      gameData.pipes.push(createPipe(CANVAS_WIDTH));
    }

    gameData.pipes.forEach(pipe => {
      pipe.x -= PIPE_SPEED;
      
      // Check if bird passed pipe
      if (!pipe.passed && pipe.x + PIPE_WIDTH < gameData.bird.x) {
        pipe.passed = true;
        gameData.score++;
        onScoreUpdate(gameData.score);
      }
    });

    // Remove off-screen pipes
    gameData.pipes = gameData.pipes.filter(pipe => pipe.x > -PIPE_WIDTH);

    // Check collision
    if (checkCollision(gameData.bird, gameData.pipes)) {
      gameData.isGameRunning = false;
      onGameOver(gameData.score);
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "hsl(200, 100%, 85%)");
    gradient.addColorStop(1, "hsl(220, 100%, 70%)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    for (let i = 0; i < 3; i++) {
      const cloudX = (gameData.frameCount * -0.5 + i * 300) % (CANVAS_WIDTH + 100);
      const cloudY = 50 + i * 30;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 25, 0, Math.PI * 2);
      ctx.arc(cloudX + 25, cloudY, 35, 0, Math.PI * 2);
      ctx.arc(cloudX + 50, cloudY, 25, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw pipes
    gameData.pipes.forEach(pipe => {
      // Pipe gradient
      const pipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
      pipeGradient.addColorStop(0, "hsl(120, 60%, 30%)");
      pipeGradient.addColorStop(0.5, "hsl(120, 60%, 40%)");
      pipeGradient.addColorStop(1, "hsl(120, 40%, 60%)");
      
      ctx.fillStyle = pipeGradient;
      
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY);
      
      // Pipe caps
      ctx.fillStyle = "hsl(120, 40%, 60%)";
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, PIPE_WIDTH + 10, 30);
      ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 30);
    });

    // Draw ground
    ctx.fillStyle = "hsl(30, 40%, 35%)";
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);

    // Draw bird
    ctx.save();
    ctx.translate(gameData.bird.x + BIRD_SIZE / 2, gameData.bird.y + BIRD_SIZE / 2);
    ctx.rotate((gameData.bird.rotation * Math.PI) / 180);
    
    // Bird gradient
    const birdGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, BIRD_SIZE / 2);
    birdGradient.addColorStop(0, "hsl(45, 100%, 60%)");
    birdGradient.addColorStop(1, "hsl(30, 100%, 55%)");
    
    ctx.fillStyle = birdGradient;
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird eye
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(5, -5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(7, -5, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird beak
    ctx.fillStyle = "hsl(20, 80%, 50%)";
    ctx.beginPath();
    ctx.moveTo(BIRD_SIZE / 2 - 5, 0);
    ctx.lineTo(BIRD_SIZE / 2 + 5, -2);
    ctx.lineTo(BIRD_SIZE / 2 + 5, 2);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, checkCollision, createPipe, onGameOver, onScoreUpdate]);

  // Handle input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener("keydown", handleKeyPress);
    canvasRef.current?.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      canvasRef.current?.removeEventListener("click", handleClick);
    };
  }, [jump]);

  // Game state management
  useEffect(() => {
    if (gameState === "playing" && !gameDataRef.current.isGameRunning) {
      resetGame();
      gameDataRef.current.isGameRunning = true;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else if (gameState !== "playing" && gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop, resetGame]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="game-canvas cursor-pointer"
    />
  );
};