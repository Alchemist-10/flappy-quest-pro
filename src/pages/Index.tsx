import { FlappyBird } from "@/components/game/FlappyBird";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-game-sky-light to-game-sky-dark flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-2 floating-animation">
            🐦 Flappy Bird Pro
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            The ultimate flappy experience!
          </p>
        </div>
        <FlappyBird />
      </div>
    </div>
  );
};

export default Index;