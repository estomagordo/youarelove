import { RotateCcw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ControlButtonsProps {
  onReset: () => void;
  onShowLearned: () => void;
}

const ControlButtons = ({ onReset, onShowLearned }: ControlButtonsProps) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            onClick={onShowLearned}
            className="rounded-full shadow-lg"
          >
            <BookOpen className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Some of the things I admire about you</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            onClick={onReset}
            className="rounded-full shadow-lg"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Reset</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ControlButtons;
