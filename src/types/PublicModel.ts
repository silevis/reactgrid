import React from "react";
import { BehaviorConstructor } from "./Behavior";
import { IndexedLocation } from "./InternalModel";
import { NumericalRange } from "./CellMatrix";

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

type EventHandlers = Omit<React.DOMAttributes<HTMLDivElement>, "dangerouslySetInnerHTML" | "children">;

// Based on: https://stackoverflow.com/a/74852313
// Returns a type with keys that end with the given string
type PickEndsWith<Type extends object, SearchString extends string> = {
  [Key in keyof Type as Key extends `${infer R}${SearchString}` ? Key : never]: Type[Key];
};

export type CaptureEventHandlers = PickEndsWith<EventHandlers, "Capture">;

export type ReactGridCallbacks = {
  onFocusLocationChanging?: (location: IndexedLocation) => boolean;
  onFocusLocationChanged?: (location: IndexedLocation) => void;

  onSelectionChanging?: (area: NumericalRange) => boolean;
  onSelectionChanged?: (area: NumericalRange) => void;

  onFillHandle?: (event: React.PointerEvent<HTMLDivElement>, area: NumericalRange) => void;

  onRowSelection?: (event: React.PointerEvent<HTMLDivElement>, rowId: string) => void;
  onRowResize?: (
    event: React.PointerEvent<HTMLDivElement>,
    rowId: string,
    oldHeightInPx: number,
    newHeightInPx: number
  ) => void;
  onRowReorder?: (event: React.PointerEvent<HTMLDivElement>, rowIds: string[]) => void;

  onColumnSelection?: (event: React.PointerEvent<HTMLDivElement>, colId: string) => void;
  onColumnResize?: (
    event: React.PointerEvent<HTMLDivElement>,
    colId: string,
    oldWidthInPx: number,
    newWidthInPx: number
  ) => void;
  onColumnReorder?: (event: React.PointerEvent<HTMLDivElement>, colIds: string[]) => void;
};

export interface ReactGridProps extends CaptureEventHandlers, ReactGridCallbacks {
  id: string;

  style?: React.CSSProperties;

  rows: Row[];
  columns: Column[];

  cells: CellMap;

  stickyTopRows?: number;
  stickyRightColumns?: number;
  stickyBottomRows?: number;
  stickyLeftColumns?: number;

  // enableVirtualization?: boolean;
  enableFillHandle?: boolean;
  fillHandleDirection?: "both" | "horizontal" | "vertical";

  enableRowSelection?: boolean;
  enableRowResize?: boolean;
  enableRowReorder?: boolean;

  enableColumnSelection?: boolean;
  enableColumnResize?: boolean;
  enableColumnReorder?: boolean;

  behaviors?: Record<string, BehaviorConstructor>;

  focusLocation?: [number, number];
  initialFocusLocation?: [number, number];
}
