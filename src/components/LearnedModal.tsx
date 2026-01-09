import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
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
