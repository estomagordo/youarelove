import { cn } from "@/lib/utils";

interface RevealStripProps {
  index: number;
  totalStrips: number;
  isRevealed: boolean;
  isFlipping: boolean;
  revealedText: string;
  imageUrl: string;
  onReveal: () => void;
}

const RevealStrip = ({
  index,
  totalStrips,
  isRevealed,
  isFlipping,
  revealedText,
  imageUrl,
  onReveal,
}: RevealStripProps) => {
  const heightPercent = 100 / totalStrips;
  const shouldFlip = isRevealed || isFlipping;

  return (
    <div
      className="relative w-full flip-container"
      style={{ height: `${heightPercent}%` }}
    >
      <div className={cn("flip-card", shouldFlip && "flipped")}>
        {/* Front face - Image strip */}
        <div className="flip-face">
          <button
            onClick={onReveal}
            disabled={isRevealed || isFlipping}
            className={cn(
              "w-full h-full cursor-pointer overflow-hidden relative",
              "transition-all duration-300",
              "hover:ring-4 hover:ring-primary hover:z-10",
              "group",
              (isRevealed || isFlipping) && "pointer-events-none"
            )}
            aria-label={`Reveal section ${index + 1}`}
          >
            {/* Clipped portion of the full image */}
            <div
              className="absolute w-full"
              style={{
                height: `${totalStrips * 100}%`,
                top: `-${index * 100}%`,
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
