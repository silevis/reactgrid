import { useState } from "react";
import { CellContextType } from "../types/PublicModel";

export const useDoubleTouch = (
  ctx: CellContextType,
  setIsInEditMode: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [lastTouchEnd, setLastTouchEnd] = useState(0);

  const handleDoubleTouch = () => {
    const now = new Date().getTime();
    const timesince = now - lastTouchEnd;
    if (timesince < 300 && timesince > 0) {
      // double touch detected
      setIsInEditMode(true);
      ctx.requestFocus();
    }
    setLastTouchEnd(now);
  };

  return { handleDoubleTouch };
};
