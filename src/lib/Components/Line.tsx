import * as React from "react";
import { useReactGridState } from "./StateProvider";

export const Line: React.FC = () => {
  const { linePosition, lineOrientation, cellMatrix } = useReactGridState();

  const isVertical = lineOrientation === "vertical";

  const lineStyles = Object.assign(
    {},
    isVertical
      ? { left: linePosition, height: cellMatrix.height }
      : { top: linePosition, width: cellMatrix.width }
  );

  if (linePosition === -1) return null;

  return (
    <div
      className={`rg-line ${
        isVertical ? "rg-line-vertical" : "rg-line-horizontal"
      }`}
      style={lineStyles}
    />
  );
};
