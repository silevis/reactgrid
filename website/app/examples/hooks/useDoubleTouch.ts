import { CellContextType } from "@silevis/reactgrid";
import { useState } from "react";

export const useDoubleTouch = (
  ctx: CellContextType,
  setIsInEditMode: (enableEditMode: boolean) => void
) => {
  const [lastTouchEnd, setLastTouchEnd] = useState(0);

  const handleDoubleTouch = () => {
    if (!ctx.isFocused) return;

    const now = new Date().getTime();
    const timesince = now - lastTouchEnd;
    if (timesince < 300 && timesince > 0) {
      // double touch detected
      setIsInEditMode(true);
    }
    setLastTouchEnd(now);
  };

  return { handleDoubleTouch };
};
