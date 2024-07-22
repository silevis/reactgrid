import { ColumnMeasurement } from "../types/ColumnMeasurement";
import { RowMeasurement } from "../types/RowMeasurement";

/**
 * Returns an array of sticky rows offsets based on row measurements.
 * Depending on the direction, the offsets are calculated from the top or the bottom of the grid.
 * @param rowMeasurements an array of row measurements
 * @param stickyRowsAmount the amount of sticky rows you need to get offsets for
 * @param direction the direction in which the sticky rows are located
 * @returns a array of sticky rows offsets
 */
export const getStickyRowsOffsetsFromMeasurements = (
  rowMeasurements: RowMeasurement[],
  stickyRowsAmount: number,
  direction: "forward" | "backward" = "forward"
): number[] => {
  if (!rowMeasurements.length) return [];

  const gapWidth = rowMeasurements[0].offsetTop;
  const stickyRowOffsets = [gapWidth];

  if (direction === "forward") {
    for (let rowIndex = 1; rowIndex < stickyRowsAmount; rowIndex++) {
      stickyRowOffsets.push(rowMeasurements[rowIndex].offsetTop);
    }
  } else {
    const lastRowIndex = rowMeasurements.length - 1;

    for (let rowIndex = lastRowIndex - 1; rowIndex >= rowMeasurements.length - stickyRowsAmount; rowIndex--) {
      // In measurements, we have offsets from the top of the grid,
      // but we need offsets from the bottom of the grid here,
      // so we use the previous offset and add the height of the next (because we are going backwards) row as well as the gap width
      const bottomOffset =
        stickyRowOffsets[lastRowIndex - rowIndex - 1] + rowMeasurements[rowIndex + 1].height + gapWidth;
      stickyRowOffsets.push(bottomOffset + gapWidth);
    }
  }

  return stickyRowOffsets;
};

/**
 * Returns an array of sticky columns offsets based on column measurements.
 * Depending on the direction, the offsets are calculated from the left or the right of the grid.
 * @param colMeasurements an array of column measurements
 * @param stickyColumnsAmount the amount of sticky columns you need to get offsets for
 * @param direction the direction in which the sticky columns are located
 * @returns a array of sticky columns offsets
 */
export const getStickyColumnsOffsetsFromMeasurements = (
  colMeasurements: ColumnMeasurement[],
  stickyColumnsAmount: number,
  direction: "forward" | "backward" = "forward"
): number[] => {
  if (!colMeasurements.length) return [];

  const gapWidth = colMeasurements[0].offsetLeft;
  const stickyColumnOffsets = [gapWidth];

  if (direction === "forward") {
    for (let colIndex = 1; colIndex < stickyColumnsAmount; colIndex++) {
      stickyColumnOffsets.push(colMeasurements[colIndex].offsetLeft);
    }
  } else {
    const lastColumnIndex = colMeasurements.length - 1;

    for (let colIndex = lastColumnIndex - 1; colIndex >= colMeasurements.length - stickyColumnsAmount; colIndex--) {
      // In measurements, we have offsets from the left of the grid,
      // but we need offsets from the right of the grid here,
      // so we use the previous offset and add the width of the next (because we are going backwards) column as well as the gap width
      const rightOffset =
        stickyColumnOffsets[lastColumnIndex - colIndex - 1] + colMeasurements[colIndex + 1].width + gapWidth;
      stickyColumnOffsets.push(rightOffset);
    }
  }

  return stickyColumnOffsets;
};
