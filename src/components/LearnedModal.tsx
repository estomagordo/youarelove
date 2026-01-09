import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Heart } from "lucide-react";
import { revealData } from "@/data/revealData";

interface LearnedModalProps {
  isOpen: boolean;
  onClose: () => void;
  revealedIndices: Set<number>;
}

const LearnedModal = ({ isOpen, onClose, revealedIndices }: LearnedModalProps) => {
  const learnedMessages = Array.from(revealedIndices)
    .sort((a, b) => a - b)
    .map((index) => revealData[index][0]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto [&>button:last-child]:hidden">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10">
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-xl">Things I admire about you</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-4">
          {learnedMessages.length === 0 ? (
            <p className="text-muted-foreground text-center italic">
              Nothing uncovered yet. Click on the image to discover messages.
            </p>
          ) : (
            learnedMessages.map((message, idx) => (
              <p key={idx} className="text-foreground border-l-2 border-primary pl-3">
                {message}
              </p>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnedModal;
