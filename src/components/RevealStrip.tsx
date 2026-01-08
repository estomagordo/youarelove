import { cn } from "@/lib/utils";

const SWAP_DURATION_MS = 500;

interface RevealStripProps {
  visualIndex: number;
  dataIndex: number;
  totalStrips: number;
  isRevealed: boolean;
  isFlipping: boolean;
  revealedText: string;
  imageUrl: string;
  onReveal: () => void;
  isSwapping?: boolean;
  swapDirection?: number; // -1 for moving up, 1 for moving down, 0 for no swap
}

const RevealStrip = ({
  visualIndex,
  dataIndex,
  totalStrips,
  isRevealed,
  isFlipping,
  revealedText,
  imageUrl,
  onReveal,
  isSwapping = false,
  swapDirection = 0,
}: RevealStripProps) => {
  const heightPercent = 100 / totalStrips;
  const shouldFlip = isRevealed || isFlipping;

  return (
    <div
      className="absolute w-full flip-container"
      style={{
        height: `${heightPercent}%`,
        top: `${visualIndex * heightPercent}%`,
        transition: `top ${SWAP_DURATION_MS}ms ease-in-out`,
        zIndex: isSwapping ? 10 : 1,
      }}
    >
      <div className={cn("flip-card", shouldFlip && "flipped")}>
        {/* Front face - Image strip */}
        <div className="flip-face">
          <button
            onClick={onReveal}
            disabled={isRevealed || isFlipping || isSwapping}
            className={cn(
              "w-full h-full cursor-pointer overflow-hidden relative",
              "transition-all duration-300",
              "hover:ring-4 hover:ring-primary hover:z-10",
              "group",
              (isRevealed || isFlipping || isSwapping) && "pointer-events-none"
            )}
            aria-label={`Reveal section ${visualIndex + 1}`}
          >
            {/* Clipped portion of the full image */}
            <div
              className="absolute w-full"
              style={{
                height: `${totalStrips * 100}%`,
                top: `-${dataIndex * 100}%`,
              }}
            >
              <img
                src={imageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
          </button>
        </div>

        {/* Back face - Revealed text */}
        <div className="flip-face flip-back bg-background flex items-center justify-center">
          <p className="text-foreground text-lg md:text-xl lg:text-2xl text-center font-medium px-8">
            {revealedText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevealStrip;
