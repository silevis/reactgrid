import React from "react";
import { useReactGridState } from "./StateProvider";

export const Shadow: React.FC = () => {
  const {
    lineOrientation,
    shadowSize,
    shadowPosition,
    shadowCursor,
    cellMatrix,
  } = useReactGridState();

  const isVertical = lineOrientation === "vertical";

  if (shadowPosition === -1) return null;

  return (
    <div
      className="rg-shadow"
      style={{
        cursor: shadowCursor,
        top: isVertical ? 0 : shadowPosition,
        left: isVertical ? shadowPosition : 0,
        width: isVertical ? shadowSize : cellMatrix.width,
        height: isVertical ? cellMatrix.height : shadowSize,
      }}
    />
  );
};
