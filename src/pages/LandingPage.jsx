import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import SplitText from "../components/SplitText";
import { useNavigate } from "react-router-dom";
import Globe from '../components/globe'
function App() {
  const navigate = useNavigate();
  useGSAP(() => {
    const audio = document.getElementById("bg-music");
    const startMusic = () => {
      audio?.play().catch(() => {});
    };

    document.addEventListener("click", startMusic, { once: true });

    gsap.fromTo(
      ".w-40",
      { rotation: 0 },
      { rotation: 360, duration: 2, repeat: -1, ease: "linear" }
    );

    return () => {
      document.removeEventListener("click", startMusic);
    };
  }, []);
  const moveToReadyPage = () => {
    navigate("/getReady");
  };
  return (
    <>
      <audio id="bg-music" loop style={{ display: "none" }}>
        <source src="/sfx/crowdcheering.mp3" type="audio/mpeg" />
      </audio>

      <div className="absolute inset-0 flex items-center justify-center flex-col z-10 overflow-y-auto ">
        <img src="/images/Tyre.png" className="w-40 h-auto" />

        <SplitText
          text=" Are you ready to take the"
          className="formula1-header  text-center text-white z-50"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <SplitText
          text=" Exteme Networks pitstop challenge?"
          className="formula1-header  text-center text-white z-50"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <div className="absolute bottom-0 left-0 ">
          <Globe className="z-999"/>
        </div>
      </div>

      <button
        onClick={() => moveToReadyPage()}
        className="absolute bottom-5 right-5 z-20 bg-black/60 text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer"
      >
        🎮 Click To Play
      </button>
    </>
  );
}

export default App;
