interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-lg">
      <div className="text-center text-white p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">🐦</div>
          <h2 className="text-4xl font-bold mb-2 floating-animation">
            Ready to Fly?
          </h2>
          <p className="text-lg text-white/90 mb-6">
            Navigate through the pipes and set a new high score!
          </p>
        </div>
        
        <button
          onClick={onStart}
          className="game-button mb-4 pulse-glow"
        >
          🚀 Start Game
        </button>
        
        <div className="text-sm text-white/70">
          <p>Press <kbd className="bg-white/20 px-2 py-1 rounded text-xs">SPACE</kbd> or click to fly</p>
        </div>
      </div>
    </div>
  );
};