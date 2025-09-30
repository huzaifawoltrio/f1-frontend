import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import WavyLines from "../components/WavyLines";

const ReadyGo = () => {
  const [activeCircles, setActiveCircles] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const navigate = useNavigate();

  const audio = useMemo(() => new Audio("/sfx/Beep5.mp3"), []);

  const handleStart = () => {
    setHasStarted(true);
    try {
      audio.play();
    } catch (error) {
      console.log("Audio playback failed:", error);
    }
  };

  useEffect(() => {
    let timeoutIds = [];

    if (hasStarted) {
      // Light up the first circle immediately
      setActiveCircles(1);

      // Schedule subsequent circles to light up every second
      timeoutIds.push(setTimeout(() => setActiveCircles(2), 1000));
      timeoutIds.push(setTimeout(() => setActiveCircles(3), 2000));
      timeoutIds.push(setTimeout(() => setActiveCircles(4), 3000));
      timeoutIds.push(setTimeout(() => setActiveCircles(5), 4000));

      // After the last circle lights up, navigate to the next page
      timeoutIds.push(
        setTimeout(() => {
          navigate("/playgame");
        }, 5000) // Navigate after 5 seconds (at the start of the 6th second)
      );
    }

    // Cleanup function to clear all timeouts
    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [hasStarted, navigate, audio]);

  return (
    <div
      className="absolute inset-0 flex flex-col justify-center items-center"
      style={{ backgroundColor: "#0d1117" }}
    >
      <WavyLines />
      <div className="flex items-center gap-5">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={`orb ${
              index <= activeCircles ? "orb-active" : "orb-inactive"
            }`}
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.3s ease-in-out",
              boxShadow: "9px 7px 11.3px 0px rgba(0, 0, 0, 0.39)",
              ...(index <= activeCircles
                ? {
                    background:
                      "radial-gradient(circle, #ff6b6b 0%, #a50000 100%)",
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
            {index <= activeCircles && (
              <>
                <div
                  style={{
                    position: "absolute",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    filter: "blur(10px)",
                    boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.6)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                  }}
                />
              </>
            )}

            {index > activeCircles && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "80px",
                  height: "20px",
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "50%",
                  filter: "blur(5px)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {!hasStarted && (
        <div className="mt-8">
          <button onClick={handleStart} className="lights-out-button">
            LIGHTS OUT
          </button>
        </div>
      )}

      <style jsx>{`
        .orb:hover {
          transform: translateY(-10px);
        }
      `}</style>
    </div>
  );
};

export default ReadyGo;
