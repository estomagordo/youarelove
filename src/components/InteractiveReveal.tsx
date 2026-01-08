import { useState, useRef, useEffect } from "react";
import { revealData } from "@/data/revealData";
import RevealStrip from "./RevealStrip";
import PopupModal from "./PopupModal";
import LearnedModal from "./LearnedModal";
import ControlButtons from "./ControlButtons";
import revealImage from "@/assets/reveal-image.png";

// Animation timing constant
const SWAP_DURATION_MS = 500;

// Generate a valid shuffle: at least 5 differences, last element stays in place
const generateValidShuffle = (length: number): number[] => {
  const maxAttempts = 100;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Create array [0, 1, 2, ..., length-2] (excluding last)
    const indices = Array.from({ length: length - 1 }, (_, i) => i);
    
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // Add last element in its correct position
    const shuffled = [...indices, length - 1];
    
    // Check if at least 5 positions are different
    let differences = 0;
    for (let i = 0; i < length; i++) {
      if (shuffled[i] !== i) {
        differences++;
      }
    }
    
    // Also verify last element is in correct position
    if (differences >= 5 && shuffled[length - 1] === length - 1) {
      return shuffled;
    }
  }
  
  // Fallback: return a shuffle that definitely has differences
  // (shuffle first 5 elements)
  const fallback = Array.from({ length }, (_, i) => i);
  for (let i = 0; i < Math.min(5, length - 1); i++) {
    const j = Math.floor(Math.random() * (length - 1));
    [fallback[i], fallback[j]] = [fallback[j], fallback[i]];
  }
  fallback[length - 1] = length - 1; // Ensure last stays in place
  return fallback;
};

// Generate bubble sort swaps to sort array back to [0, 1, 2, ..., n-1]
const generateSortSwaps = (currentOrder: number[]): Array<{ i: number; j: number }> => {
  const swaps: Array<{ i: number; j: number }> = [];
  const order = [...currentOrder];
  const n = order.length;
  
  // Bubble sort: find where each element should go
  // We'll use a more efficient approach: track target positions
  const targetPositions = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    targetPositions.set(i, i); // Element i should be at position i
  }
  
  // Create inverse mapping: where is each element currently?
  const currentPositions = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    currentPositions.set(order[i], i);
  }
  
  // Bubble sort: repeatedly swap adjacent elements that are out of order
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      // Check if elements at positions i and i+1 are out of order
      const elemAtI = order[i];
      const elemAtI1 = order[i + 1];
      
      // They're out of order if elemAtI > elemAtI1
      if (elemAtI > elemAtI1) {
        swaps.push({ i, j: i + 1 });
        // Swap in our tracking array
        [order[i], order[i + 1]] = [order[i + 1], order[i]];
        swapped = true;
      }
    }
  }
  
  return swaps;
};

const InteractiveReveal = () => {
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [flippingIndex, setFlippingIndex] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [pendingRevealIndex, setPendingRevealIndex] = useState<number | null>(null);
  const [showLearnedModal, setShowLearnedModal] = useState(false);
  const [visualOrder, setVisualOrder] = useState<number[]>(() => generateValidShuffle(revealData.length));
  const [isAnimating, setIsAnimating] = useState(false);
  const [swappingIndices, setSwappingIndices] = useState<{ i: number; j: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalStrips = revealData.length;
  const imageAspectRatio = 2735 / 2467;

  // Calculate container size to fit viewport
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current?.parentElement) {
        const parent = containerRef.current.parentElement;
        const availableWidth = parent.clientWidth;
        const availableHeight = parent.clientHeight;
        
        // Calculate size maintaining aspect ratio
        const widthByHeight = availableHeight * imageAspectRatio;
        const heightByWidth = availableWidth / imageAspectRatio;
        
        let width: number;
        let height: number;
        
        if (widthByHeight <= availableWidth) {
          // Constrained by height
          height = availableHeight;
          width = widthByHeight;
        } else {
          // Constrained by width
          width = availableWidth;
          height = heightByWidth;
        }
        
        setContainerSize({ width, height });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [imageAspectRatio]);

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

  // Check if all strips are revealed and trigger animation
  useEffect(() => {
    if (revealedIndices.size === totalStrips && !isAnimating) {
      // All revealed - start sorting animation
      setIsAnimating(true);
      const currentOrder = [...visualOrder];
      const swaps = generateSortSwaps(currentOrder);
      
      if (swaps.length === 0) {
        // Already sorted
        setIsAnimating(false);
        return;
      }
      
      let swapIndex = 0;
      
      const performNextSwap = () => {
        if (swapIndex >= swaps.length) {
          setIsAnimating(false);
          setSwappingIndices(null);
          return;
        }
        
        const swap = swaps[swapIndex];
        setSwappingIndices(swap);
        
        // Update visual order immediately (React will batch and animate)
        setVisualOrder((prev) => {
          const newOrder = [...prev];
          [newOrder[swap.i], newOrder[swap.j]] = [newOrder[swap.j], newOrder[swap.i]];
          return newOrder;
        });
        
        swapIndex++;
        
        // Schedule next swap after animation completes
        setTimeout(() => {
          setSwappingIndices(null);
          setTimeout(performNextSwap, 50); // Small delay between swaps
        }, SWAP_DURATION_MS);
      };
      
      performNextSwap();
    }
  }, [revealedIndices.size, totalStrips, isAnimating]);

  const handleReveal = (visualIndex: number) => {
    // visualIndex is the visual position, we need to find the data index
    const dataIndex = visualOrder[visualIndex];
    // Show popup but don't reveal yet
    setPopupMessage(revealData[dataIndex][0]);
    setPendingRevealIndex(dataIndex);
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
    setIsAnimating(false);
    setSwappingIndices(null);
    // Generate new shuffle
    setVisualOrder(generateValidShuffle(totalStrips));
    // Also restart the audio
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log("Error playing audio:", error);
      });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background flex flex-col">
      <ControlButtons
        onReset={handleReset}
        onShowLearned={() => setShowLearnedModal(true)}
      />

      {/* Container with aspect ratio matching the image - fits within viewport */}
      <div className="relative w-full flex-1 flex items-center justify-center bg-background min-h-0 overflow-hidden">
        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{ 
            aspectRatio: "2735/2467",
            width: containerSize ? `${containerSize.width}px` : "100%",
            height: containerSize ? `${containerSize.height}px` : "auto",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
        {/* Render strips in visual order (0, 1, 2, ...) but with shuffled data assignments */}
        {visualOrder.map((dataIndex, visualIndex) => {
          const entry = revealData[dataIndex];
          const isSwapping = swappingIndices !== null && 
            (swappingIndices.i === visualIndex || swappingIndices.j === visualIndex);
          
          // Determine swap direction
          let swapDirection = 0;
          if (swappingIndices) {
            if (swappingIndices.i === visualIndex) {
              swapDirection = 1; // Moving down
            } else if (swappingIndices.j === visualIndex) {
              swapDirection = -1; // Moving up
            }
          }
          
          return (
            <RevealStrip
              key={`strip-${visualIndex}-${dataIndex}`}
              visualIndex={visualIndex}
              dataIndex={dataIndex}
              totalStrips={totalStrips}
              isRevealed={revealedIndices.has(dataIndex)}
              isFlipping={flippingIndex === dataIndex}
              revealedText={entry[1]}
              imageUrl={revealImage}
              onReveal={() => handleReveal(visualIndex)}
              isSwapping={isSwapping}
              swapDirection={swapDirection}
            />
          );
        })}
        </div>
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
