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
        // No position animation - strips stay in place, only text content swaps
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
              "bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200",
              "shadow-md",
              "border-x border-slate-300/60",
              visualIndex === 0 && "border-t border-slate-300/60",
              visualIndex === totalStrips - 1 && "border-b border-slate-300/60",
              "rounded-sm",
              (isRevealed || isFlipping || isSwapping) && "pointer-events-none"
            )}
            style={{
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)",
              borderTopWidth: visualIndex > 0 ? "2px" : undefined,
              borderBottomWidth: visualIndex < totalStrips - 1 ? "2px" : undefined,
            }}
            aria-label={`Reveal section ${visualIndex + 1}`}
          >
            {/* Clipped portion of the full image */}
            <div
              className="absolute w-full"
              style={{
                height: `${totalStrips * 100}%`,
                top: `-${visualIndex * 100}%`,
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
        <div 
          className="flip-face flip-back bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 border-x border-slate-300/60 shadow-md rounded-sm flex items-center justify-center overflow-hidden"
          style={{
            borderTopWidth: visualIndex === 0 ? "1px" : "2px",
            borderBottomWidth: visualIndex === totalStrips - 1 ? "1px" : "2px",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          <p 
            className="text-foreground text-lg md:text-xl lg:text-2xl text-center font-medium px-8 transition-all duration-500 ease-in-out"
            style={{
              transform: isSwapping 
                ? `translateY(${swapDirection * 100}%)` 
                : 'translateY(0)',
              opacity: isSwapping ? 0.7 : 1,
            }}
          >
            {revealedText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevealStrip;
