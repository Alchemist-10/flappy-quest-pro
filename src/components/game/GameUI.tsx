interface GameUIProps {
  score: number;
}

export const GameUI = ({ score }: GameUIProps) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="score-display animate-score-pop">
        {score}
      </div>
    </div>
  );
};