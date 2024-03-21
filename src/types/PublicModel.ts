import React from "react";

import { Behavior, BehaviorId } from "./Behavior";
import { NumericalRange } from "./CellMatrix";
import { IndexedLocation } from "./InternalModel";
import { RGTheme } from "./Theme";

export type Row<Id = string> = {
  id: Id;
  height: string | number;
};

export type Column<Id = string> = {
  id: Id;
  width: string | number;
};

export type Cell<RowIdType extends string = string, ColIdType extends string = string> = {
  /** User defined row ID, must exist in the `rows` array! */
  rowId: RowIdType;
  /** User defined column ID, must exist in the `columns` array! */
  colId: ColIdType;

  /** Cell's template - typically the name of the React component. Should start from the uppercase letter. */
  // Type `any` is required to use React.ComponentType here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Template: React.ComponentType<any>;
  /** Props passed to the cell's template. Types and structure is inherited from Template prop, but instead of JSX properties it's an object. */
  props?: React.ComponentPropsWithRef<Cell["Template"]>;

  /** Represents how many rows should the cell occupy. */
  rowSpan?: number;
  /** Represents how many columns should the cell occupy. */
  colSpan?: number;
  /** Marks a cell as focusable or not */
  isFocusable?: boolean;
  /** Marks a cell as selectable or not */
  isSelectable?: boolean;
};

export type SpanMember = {
  originRowId: string;
  originColId: string;
};

export type Position = {
  x: number;
  y: number;
};

export type Range<RowIdType extends string = string, ColIdType extends string = string> = {
  start: {
    rowId: RowIdType;
    columnId: ColIdType;
  };
  end: {
    rowId: RowIdType;
    columnId: ColIdType;
  };
};

export type CellContextType = {
  /** User defined row ID. */
  rowId: string;
  /** User defined column ID. */
  colId: string;

  /** Numerical cell's row index representation in relation to whole grid (incl. sticky). */
  realRowIndex: number;
  /** Numerical cell's column index representation in relation to whole grid (incl. sticky). */
  realColumnIndex: number;

  /** Represents how many rows should the cell occupy. */
  rowSpan?: number;
  /** Represents how many columns should the cell occupy. */
  colSpan?: number;

  /** Internal: provides cell container's style  */
  containerStyle: React.CSSProperties;

  /** Disables edit mode */
  disableEditMode: () => void;
  /** Requests focus and enables edit mode if true is passed as a parameter. */
  requestFocus: (enableEditMode: boolean) => void;

  isInEditMode: boolean;
  isFocused: boolean;
};

export type CellMap<RowIdType extends string = string, ColIdType extends string = string> = Map<
  `${RowIdType} ${ColIdType}`,
  Cell<RowIdType, ColIdType> | SpanMember
>;

export type StyledRange = {
  styles: React.CSSProperties;
  range: Range;
};

export type StyledRangesCSS = {
  [selector: string]: React.CSSProperties;
}[];

export type Location = {
  rowId: string;
  columnId: string;
};

export interface ReactGridProps {
  id: string;

  styles?: RGTheme;

  styledRanges?: StyledRange[];

  columns: Column[];
  rows: Row[];

  cells: CellMap;

  handleSelectArea?: (selectedArea: NumericalRange) => void;
  handleFocusCell?: (cellLocation: IndexedLocation) => void;

  stickyTopRows?: number;
  stickyRightColumns?: number;
  stickyBottomRows?: number;
  stickyLeftColumns?: number;

  // enableVirtualization?: boolean;

  behaviors?: Record<BehaviorId, Behavior>;

  initialFocusLocation?: Location;
  initialSelectedRange?: Range;

  onFocusLocationChanging?: ({ location }: { location: Location }) => boolean;
  onFocusLocationChanged?: ({ location }: { location: Location }) => void;
}
