import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function IntroPage() {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const navigate = useNavigate();

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false; // unmute video
      videoRef.current.play().catch(() => {}); // ensure playback
      setMuted(false); // hide button
    }
  };

  const moveToReady = () => {
    navigate("/getReady");
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background video */}
      <video
        ref={videoRef}
        onClick={() => moveToReady()}
        autoPlay
        loop
        playsInline
        muted={muted}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://tlkf66voux.ufs.sh/f/9MQRj1X7dKZVTjPXVpHxB7SEfU4R5mv3Tt6Pn8ZVJbXMcKNF"
          type="video/mp4"
        />
      </video>

      {/* Unmute button (only visible when muted) */}
      {muted && (
        <button
          onClick={handleUnmute}
          className="absolute bottom-5 right-5 z-20 bg-black/60 text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer"
        >
          🔊 Tap for Sound
        </button>
      )}
    </div>
  );
}

export default IntroPage;
