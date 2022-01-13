import * as React from "react";
import { Orientation } from "../../core";
import { ProCellMatrix } from "../Model/ProCellMatrixBuilder";

interface ShadowProps {
  shadowPosition: number;
  orientation: Orientation;
  cellMatrix: ProCellMatrix;
  shadowSize: number;
  cursor: string;
}

export const Shadow: React.FC<ShadowProps> = ({
  shadowSize,
  shadowPosition,
  cellMatrix,
  cursor,
  orientation,
}) => {
  const isVertical = orientation === "vertical";
  if (shadowPosition === -1) {
    return null;
  } else {
    return (
      <div
        className="rg-shadow"
        style={{
          cursor: cursor,
          top: isVertical ? 0 : shadowPosition,
          left: isVertical ? shadowPosition : 0,
          width: isVertical ? shadowSize : cellMatrix.width,
          height: isVertical ? cellMatrix.height : shadowSize,
        }}
      />
    );
  }
};
