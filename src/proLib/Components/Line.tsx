import * as React from "react";
import { Orientation } from "../../core";
import { ProCellMatrix } from "../Model/ProCellMatrixBuilder";

interface LineProps {
  linePosition: number;
  orientation: Orientation;
  cellMatrix: ProCellMatrix;
}

export const Line: React.FC<LineProps> = ({
  cellMatrix,
  linePosition,
  orientation,
}) => {
  const isVertical = orientation === "vertical";
  const lineStyles = Object.assign(
    {},
    isVertical
      ? { left: linePosition, height: cellMatrix.height }
      : { top: linePosition, width: cellMatrix.width }
  );
  return (
    <>
      {linePosition !== -1 && (
        <div
          className={`rg-line ${
            isVertical ? "rg-line-vertical" : "rg-line-horizontal"
          }`}
          style={lineStyles}
        />
      )}
    </>
  );
};
