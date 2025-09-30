import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function CarPage() {
  const videoRef = useRef(null);
  
  const navigate = useNavigate();

  

  const handleVideoEnd = () => {
    navigate("/finalscore");
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Pitstop_2_v2.mp4" type="video/mp4" />
      </video>

     
    </div>
  );
}

export default CarPage;