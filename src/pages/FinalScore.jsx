import React from "react";
import { useGame } from "../contexts/GameContext";
import { Navigate, useNavigate } from "react-router-dom";

const FinalScore = () => {
  const { completionTimeFormatted, completionTime, resetGame } = useGame();
  const navigate = useNavigate();
  // Use completion time from context, fallback to default if not available
  const displayTime = completionTimeFormatted || "1.202";

  const handlePlayAgain = () => {
    resetGame();
    // Navigate back to game page or home - you can customize this
    navigate("/");
  };

  return (
    <div className="absolute inset-0 flex justify-center items-center flex-col">
      <img className="w-40 h-auto " src="/images/speedometer.png" />

      <div className="flex justify-center items-center">
        <div className="digitalnumbers-header-bigger ">{displayTime}</div>
        <div className="flex flex-col digital-small mt-2">
          <div>S</div>
          <div>E</div>
          <div>C</div>
        </div>
      </div>
      <div className="formula-small ">Your Time Was!</div>

      {/* Optional: Add performance feedback */}
      {/* {completionTime && (
        <div className="formula-small mt-4">
          {completionTime < 5
            ? "Lightning Fast! ⚡"
            : completionTime < 10
            ? "Great Time! 🏁"
            : completionTime < 20
            ? "Good Job! 👍"
            : "Keep Practicing! 🎯"}
        </div>
      )} */}
      <div className="mt-3">
        <button onClick={handlePlayAgain} className="lights-out-button">
          RESET
        </button>
      </div>
      {/* Play again button */}
      {/* <button
        onClick={handlePlayAgain}
        className="mt-6 px-8 py-3 bg-gradient-to-b from-orange-400 via-pink-500 to-purple-500 hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 text-white font-semibold rounded-full transform hover:scale-105 transition-all duration-200 shadow-xl"
      >
        Play Again
      </button> */}

      {/* <img
        className="sm:w-1/2 w-full h-auto bottom-0 mt-auto"
        src="/images/mover.png"
        alt="Moving graphic"
      /> */}
    </div>
  );
};

export default FinalScore;
