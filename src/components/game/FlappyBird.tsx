import { useState, useCallback } from "react";
import { GameCanvas } from "./GameCanvas";
import { StartScreen } from "./StartScreen";
import { GameOverScreen } from "./GameOverScreen";
import { GameUI } from "./GameUI";
import { toast } from "sonner";

export type GameState = "start" | "playing" | "gameOver";

export interface GameData {
  score: number;
  highScore: number;
}

export const FlappyBird = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [gameData, setGameData] = useState<GameData>({ 
    score: 0, 
    highScore: parseInt(localStorage.getItem("flappybird-highscore") || "0") 
  });

  const handleGameStart = useCallback(() => {
    setGameState("playing");
    setGameData(prev => ({ ...prev, score: 0 }));
    toast("Game started! Press spacebar or click to fly!", {
      duration: 2000,
    });
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    const newHighScore = Math.max(finalScore, gameData.highScore);
    if (newHighScore > gameData.highScore) {
      localStorage.setItem("flappybird-highscore", newHighScore.toString());
      toast(`🎉 New high score: ${newHighScore}!`, {
        duration: 3000,
      });
    }
    
    setGameData({ score: finalScore, highScore: newHighScore });
    setGameState("gameOver");
  }, [gameData.highScore]);

  const handleScoreUpdate = useCallback((newScore: number) => {
    setGameData(prev => ({ ...prev, score: newScore }));
  }, []);

  const handleRestart = useCallback(() => {
    setGameState("start");
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Game Canvas */}
      <div className="relative">
        <GameCanvas
          gameState={gameState}
          onGameOver={handleGameOver}
          onScoreUpdate={handleScoreUpdate}
        />
        
        {/* Game UI Overlay */}
        {gameState === "playing" && (
          <GameUI score={gameData.score} />
        )}
        
        {/* Start Screen Overlay */}
        {gameState === "start" && (
          <StartScreen onStart={handleGameStart} />
        )}
        
        {/* Game Over Screen Overlay */}
        {gameState === "gameOver" && (
          <GameOverScreen
            score={gameData.score}
            highScore={gameData.highScore}
            onRestart={handleRestart}
          />
        )}
      </div>
      
      {/* Instructions */}
      <div className="text-center text-white/80 max-w-md">
        <p className="text-lg mb-2">🎮 How to play:</p>
        <p className="text-sm">
          Press <kbd className="bg-white/20 px-2 py-1 rounded">spacebar</kbd> or 
          <kbd className="bg-white/20 px-2 py-1 rounded ml-1">click</kbd> to make the bird fly!
        </p>
      </div>
    </div>
  );
};