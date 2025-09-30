// src/components/WavyLines.jsx
import React from "react";
import { motion } from "framer-motion";

const WavyLines = ({ numberOfLines = 20 }) => {
  const viewBoxWidth = 1000;
  const viewBoxHeight = 600;

  const lines = Array.from({ length: numberOfLines }).map((_, i) => {
    // Start points along the left edge
    const startX = 0;
    const startY = (i / (numberOfLines - 1)) * viewBoxHeight;

    // End points along the bottom edge
    const endX = (i / (numberOfLines - 1)) * viewBoxWidth;
    const endY = viewBoxHeight;

    // Draw a quadratic curve (smooth arc between start and end)
    const controlX = viewBoxWidth / 2;
    const controlY = 0;

    const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`;

    return (
      <motion.path
        key={i}
        d={d}
        stroke="url(#fadeStroke)"
        fill="none"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 2,
          delay: i * 0.2, // stagger each line
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    );
  });

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
      <svg
        width="50%"
        height="50%"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* gradient for smooth line endings */}
        <defs>
          <linearGradient id="fadeStroke" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(180,160,255,0.5)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        <g>{lines}</g>
      </svg>
    </div>
  );
};

export default WavyLines;
