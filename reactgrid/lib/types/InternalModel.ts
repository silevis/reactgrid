import { NumericalRange } from "./PublicModel";
import { Cell } from "./PublicModel";

/**
 * Represents a map of cells indexed by row and column indices.
 */
export type CellMap<RowIdxType extends number = number, ColIdxType extends number = number> = Map<
  `${RowIdxType} ${ColIdxType}`,
  Cell | SpanMember
>;

export type SpanMember = {
  originRowIndex: number;
  originColIndex: number;
};

export type Position = {
  x: number;
  y: number;
};

export type StyledRangesCSS = {
  [selector: string]: React.CSSProperties;
}[];

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

export type PaneShadowName = "Top" | "Right" | "Bottom" | "Left";

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

// Generic type that creates a new type based on T.
// It makes all properties optional, excludes the "gap" property, and recursively applies the same transformation to nested objects.
export type NestedStylesPartial<T> = {
  // Iterate over each property P in T
  [P in keyof T as P extends "gap" ? never : P]?: T[P] extends object // If the property is an object, recursively apply NestedStylesPartial // Exclude the "gap" property
    ? NestedStylesPartial<T[P]>
    : // Otherwise, keep the property type as is
      T[P];
};
