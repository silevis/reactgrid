export interface StickyOffsets {
  topRows: number[];
  bottomRows: number[];
  leftColumns: number[];
  rightColumns: number[];
}

export type GetCellOffsets = (
  rowIndex: number,
  colIndex: number,
  rowSpan: number,
  colSpan: number
) => {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export interface IndexedLocation {
  rowIndex: number;
  colIndex: number;
}

export type PaneName = "TopLeft" | "TopCenter" | "TopRight" | "Left" | "Center" | "Right" | "BottomLeft" | "BottomCenter" | "BottomRight";
