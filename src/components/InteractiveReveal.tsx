import { useState, useRef, useEffect } from "react";
import { revealData } from "@/data/revealData";
import RevealStrip from "./RevealStrip";
import PopupModal from "./PopupModal";
import LearnedModal from "./LearnedModal";
import ControlButtons from "./ControlButtons";
import revealImage from "@/assets/reveal-image.png";

const InteractiveReveal = () => {
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [flippingIndex, setFlippingIndex] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [pendingRevealIndex, setPendingRevealIndex] = useState<number | null>(null);
  const [showLearnedModal, setShowLearnedModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalStrips = revealData.length;

  // Initialize audio and play on mount
  useEffect(() => {
    const audio = new Audio("/The Way I Feel Inside.mp3");
    audio.loop = false; // Don't repeat
    audioRef.current = audio;

    // Attempt to play on load
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        // Autoplay may be blocked by browser, user interaction required
        console.log("Autoplay blocked, user interaction required");
      }
    };

    playAudio();

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleReveal = (index: number) => {
    // Show popup but don't reveal yet
    setPopupMessage(revealData[index][0]);
    setPendingRevealIndex(index);
  };

  const handleClosePopup = () => {
    setPopupMessage(null);
    
    if (pendingRevealIndex !== null) {
      // Start the flip animation
      setFlippingIndex(pendingRevealIndex);
      
      // After flip animation completes, mark as fully revealed
      setTimeout(() => {
        setRevealedIndices((prev) => new Set([...prev, pendingRevealIndex]));
        setFlippingIndex(null);
      }, 1200); // Match the CSS transition duration
      
      setPendingRevealIndex(null);
    }
  };

  const handleReset = () => {
    setRevealedIndices(new Set());
    setFlippingIndex(null);
    setPendingRevealIndex(null);
    // Also restart the audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log("Error playing audio:", error);
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-background">
      <ControlButtons
        onReset={handleReset}
        onShowLearned={() => setShowLearnedModal(true)}
      />

      {/* Container with aspect ratio matching the image */}
      <div
        className="relative w-full max-w-5xl mx-auto flex flex-col"
        style={{ aspectRatio: "2735/2467" }}
      >
        {revealData.map((entry, index) => (
          <RevealStrip
            key={index}
            index={index}
            totalStrips={totalStrips}
            isRevealed={revealedIndices.has(index)}
            isFlipping={flippingIndex === index}
            revealedText={entry[1]}
            imageUrl={revealImage}
            onReveal={() => handleReveal(index)}
          />
        ))}
      </div>

      {/* Modals */}
      <PopupModal
        isOpen={popupMessage !== null}
        onClose={handleClosePopup}
        message={popupMessage || ""}
      />

      <LearnedModal
        isOpen={showLearnedModal}
        onClose={() => setShowLearnedModal(false)}
        revealedIndices={revealedIndices}
      />
    </div>
  );
};

export default InteractiveReveal;
