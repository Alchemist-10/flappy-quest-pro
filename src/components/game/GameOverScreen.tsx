interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export const GameOverScreen = ({ score, highScore, onRestart }: GameOverScreenProps) => {
  const isNewRecord = score === highScore && score > 0;

  return (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-lg">
      <div className="text-center text-white p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl max-w-md">
        <div className="mb-6">
          <div className="text-6xl mb-4">
            {isNewRecord ? "🏆" : "💥"}
          </div>
          <h2 className="text-4xl font-bold mb-2">
            {isNewRecord ? "New Record!" : "Game Over"}
          </h2>
          {isNewRecord && (
            <p className="text-lg text-yellow-300 mb-4 animate-pulse">
              Congratulations! 🎉
            </p>
          )}
        </div>
        
        <div className="mb-6 space-y-3">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-white/70 mb-1">Final Score</p>
            <p className="text-3xl font-bold animate-score-pop">{score}</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-white/70 mb-1">Best Score</p>
            <p className="text-2xl font-bold text-yellow-300">{highScore}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="game-button w-full"
          >
            🔄 Play Again
          </button>
          
          <p className="text-sm text-white/60">
            Challenge yourself to beat your high score!
          </p>
        </div>
      </div>
    </div>
  );
};