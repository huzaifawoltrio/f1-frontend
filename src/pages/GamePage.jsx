import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../contexts/GameContext";

const GamePage = () => {
  const [activeOrbIndex, setActiveOrbIndex] = useState(0);
  const navigate = useNavigate();

  const {
    isGameActive,
    elapsedTimeFormatted,
    targetPortsCount,
    completedTargetsCount,
    isGameComplete,
    getPortClass,
    startGame,
    error,
  } = useGame();

  // Auto-start game when page loads
  useEffect(() => {
    if (!isGameActive) {
      startGame();
    }
  }, []);

  // Navigate to final score when game is complete
  useEffect(() => {
    if (isGameComplete) {
      // Small delay to show the final state before navigation
      setTimeout(() => {
        navigate("/carpage");
      }, 1000);
    }
  }, [isGameComplete, navigate]);

  // Orb cycling animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrbIndex((prevIndex) => (prevIndex + 1) % 4);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const Orb = ({ isActive }) => (
    <div
      className={`orb transition-all duration-300 ease-in-out ${
        isActive ? "orb-active" : "orb-inactive"
      }`}
      style={{
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "transform 0.3s ease-in-out",
        boxShadow: "9px 7px 11.3px 0px rgba(0, 0, 0, 0.39)",
        ...(isActive
          ? {
              background: "radial-gradient(circle, #ff6b6b 0%, #a50000 100%)",
              boxShadow:
                "0 0 10px 4px rgba(255, 0, 0, 0.5), 0 0 0 10px rgba(255, 255, 255, 0.2)",
            }
          : {
              background:
                "radial-gradient(circle at 50% 10%, #2a3340 0%, #0d1218 100%)",
              boxShadow: "9px 7px 11.3px 0px rgba(0, 0, 0, 0.39)",
            }),
      }}
    >
      {isActive && (
        <>
          <div
            style={{
              position: "absolute",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              filter: "blur(10px)",
              boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.6)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.5)",
            }}
          />
        </>
      )}

      {!isActive && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40px",
            height: "10px",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            filter: "blur(5px)",
          }}
        />
      )}
    </div>
  );

  // Helper function to get the appropriate icon based on port class
  const getPortIcon = (portClass) => {
    switch (portClass) {
      case "green-state":
        return "/images/addcircle.png";
      case "purple-state":
        return "/images/pluggedIn.png";
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto">
      <video
        autoPlay
        loop
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://tlkf66voux.ufs.sh/f/9MQRj1X7dKZVKzAhYxCZaje47vcf3D9mpXyVl5wW0C18PUhJ"
          type="video/mp4"
        />
      </video>
      <div className=""></div>
      <img
        src="/images/Frame1.png"
        alt=""
        className="absolute w-[40%] h-auto top-0 left-[10%] z-20 blur-[3px] opacity-70" // Added blur-lg and opacity-50
      />
      <img
        src="/images/Frame2.png"
        alt=""
        className="absolute w-[40%] h-auto top-0 left-[40%]  z-20 blur-[3px] opacity-70" // Added blur-lg and opacity-50
      />
      <img
        src="/images/Frame3.png"
        alt=""
        className="absolute w-[20%] h-auto top-0 right-0  z-20 blur-[3px] opacity-70" // Added blur-lg and opacity-50
      />
      {/* <img
        src="/images/Frame4.png"
        alt=""
        className="absolute w-[20%] h-auto bottom-0 left-0  z-20 blur-[3px] opacity-70" // Added blur-lg and opacity-50
      /> */}
      <img
        src="/images/Frame5.png"
        alt=""
        className="absolute w-[20%] h-auto bottom-0 right-0  z-20 blur-[3px] opacity-70" // Added blur-lg and opacity-50
      />
      {/* <div className="absolute bg-black/25 z-25 inset-0 blur-3xl"></div> */}

      <div className="background-blur"></div>
      <div className="relative z-30 flex-col flex items-center w-full">
        <div>
          <img
            src="/images/ex-logo.png"
            alt=""
            className="w-110 mt-10 h-auto"
          />
        </div>
        {/* 
        <div className="text-[12px] font-sans text-lightpurple mt-4">
          Number of target points: {targetPortsCount}
          {isGameActive && (
            <span className="ml-4">
              Completed: {completedTargetsCount}/{targetPortsCount}
            </span>
          )}
        </div> */}

        {error && (
          <div className="text-red-400 text-sm mt-2 px-4 py-2 bg-red-900/20 rounded">
            {error}
          </div>
        )}

        <div className="digitalnumbers-header text-center text-lightpurple z-50 relative lg:mt-18 md:mt-14 mt-5">
          {elapsedTimeFormatted}
          <span className="text-[12px] absolute -right-8 bottom-[-20px] tracking-widest">
            SEC
          </span>
        </div>

        <div className="w-[90%] max-w-[1400px] mx-auto px-3 sm:py-10 py-4 game-view rounded-2xl mt-5">
          {/* Top row (odd numbers) */}
          <div className="grid grid-cols-12 gap-5">
            {[...Array(24)].map((_, index) => {
              const portNumber = index + 1;
              if (portNumber % 2 === 0) return null; // only odds
              const portClass = getPortClass(portNumber);
              const iconSrc = getPortIcon(portClass);

              return (
                <button
                  key={portNumber}
                  className={`aspect-square text-lightpurple rounded-lg flex items-center justify-center flex-col transition-all duration-300 text-2xl ${portClass} relative w-full h-full`}
                >
                  <span className={iconSrc ? "" : ""}>{portNumber}</span>
                  {iconSrc && (
                    <img
                      src={iconSrc}
                      alt="Port status"
                      className={`${
                        portClass === "purple-state" ? "w-4 h-4" : "w-6 h-6"
                      } mt-1`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom row (even numbers) */}
          <div className="grid grid-cols-12 gap-5 mt-5">
            {[...Array(24)].map((_, index) => {
              const portNumber = index + 1;
              if (portNumber % 2 !== 0) return null; // only evens
              const portClass = getPortClass(portNumber);
              const iconSrc = getPortIcon(portClass);

              return (
                <button
                  key={portNumber}
                  className={`aspect-square text-lightpurple rounded-lg flex items-center justify-center flex-col transition-all duration-300 text-2xl ${portClass} relative w-full h-full`}
                >
                  <span className={iconSrc ? "" : ""}>{portNumber}</span>
                  {iconSrc && (
                    <img
                      src={iconSrc}
                      alt="Port status"
                      className={`${
                        portClass === "purple-state" ? "w-4 h-4" : "w-6 h-6"
                      } mt-1`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 
        <div className="flex items-center gap-5 mt-7">
          {[0, 1, 2, 3].map((index) => (
            <Orb key={index} isActive={index === activeOrbIndex} />
          ))}
        </div> */}

        {/* Game completion indicator */}
        {/* {isGameComplete && (
          <div className="mt-4 text-green-400 text-xl font-bold animate-pulse">
            Game Complete! Redirecting to results...
          </div>
        )} */}
      </div>
    </div>
  );
};

export default GamePage;
