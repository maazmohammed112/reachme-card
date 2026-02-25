import { useEffect, useState } from "react";
import logo from "@/assets/reach-logo.png";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [visible, setVisible] = useState(true);
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const dotInterval = setInterval(() => setDots((d) => (d + 1) % 4), 400);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400);
    }, 2000);
    return () => {
      clearTimeout(timer);
      clearInterval(dotInterval);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-400 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-105"
      }`}
      style={{ background: "hsl(220 65% 18%)", perspective: "600px" }}
    >
      <div className="animate-logo-pulse" style={{ transformStyle: "preserve-3d" }}>
        <img
          src={logo}
          alt="REACH.MME"
          className="w-52 drop-shadow-[0_0_30px_hsl(220,65%,40%,0.4)]"
        />
      </div>
      <div className="mt-6 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i < dots ? "hsl(0, 0%, 100%)" : "hsl(220, 40%, 40%)",
              transform: i < dots ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
