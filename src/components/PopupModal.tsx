import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Heart } from "lucide-react";

interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const PopupModal = ({ isOpen, onClose, message }: PopupModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md [&>button:last-child]:hidden">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10">
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-medium text-muted-foreground">
            I admire
          </DialogTitle>
          <DialogTitle className="text-center text-xl font-medium mt-2">
            {message}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PopupModal;
