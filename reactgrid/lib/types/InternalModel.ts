import { NumericalRange } from "./PublicModel";
import { Cell } from "./PublicModel";

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

export interface GridLookupCallbacks {
  onStringValueRequsted: () => string;
  onStringValueReceived: (v: string) => void;
}

export type GridLookup<RowIdxType extends number = number, ColIdxType extends number = number> = Map<
  `${RowIdxType} ${ColIdxType}`,
  GridLookupCallbacks
>;

export type InternalStyledRange = {
  styles: React.CSSProperties;
  range: NumericalRange;
};

export interface IndexedLocation {
  rowIndex: number;
  colIndex: number;
}

export type FocusedCell = Cell & {
  rowIndex: number;
  colIndex: number;
};

export type PaneName =
  | "TopLeft"
  | "TopCenter"
  | "TopRight"
  | "Left"
  | "Center"
  | "Right"
  | "BottomLeft"
  | "BottomCenter"
  | "BottomRight";

export type Direction = "Bottom" | "Right" | "Top" | "Left";

export const EMPTY_AREA = {
  startRowIdx: -1,
  endRowIdx: -1,
  startColIdx: -1,
  endColIdx: -1,
};

/**
 * Indicates location for non-existing cell.
 * e.g. When user wants to unfocus all cells, change focusedCell both row and column indexes to -1.
 */
export const NO_CELL_LOCATION = {
  rowIndex: -1,
  colIndex: -1,
} as const;

export type SpannedCell = Cell & {
  rowSpan: number;
  colSpan: number;
};

export type NestedStylesPartial<T> = {
  [P in keyof T]?: T[P] extends object ? NestedStylesPartial<T[P]> : T[P];
};
