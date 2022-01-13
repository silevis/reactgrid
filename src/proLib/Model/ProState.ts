import { State, Orientation, SelectionMode, Id, Range } from "../../core";
import { ProBehavior } from "./ProBehavior";
import { ProCellMatrix } from "./ProCellMatrixBuilder";

export interface StateExtension {
  readonly enableFillHandle: boolean;
  readonly enableRangeSelection: boolean;
  readonly enableColumnSelection: boolean;
  readonly enableRowSelection: boolean;
  readonly contextMenuPosition: { top: number; left: number };
  readonly lineOrientation: Orientation;
  readonly linePosition: number;
  readonly shadowSize: number;
  readonly shadowPosition: number;
  readonly shadowCursor: string;
  readonly selectionMode: SelectionMode;
  readonly selectedRanges: Range[];
  readonly selectedIndexes: number[];
  readonly selectedIds: Id[];
  readonly activeSelectedRangeIdx: number;
  readonly copyRange?: Range;
  readonly rightStickyColumns: number | undefined;
  readonly bottomStickyRows: number | undefined;
}

export type ProState = State<ProCellMatrix, ProBehavior> & StateExtension;

// export interface ProState extends StateMerge { }

export const defaultProStateFields: StateExtension = {
  enableFillHandle: false,
  enableRangeSelection: true,
  enableColumnSelection: false,
  enableRowSelection: false,
  contextMenuPosition: { top: -1, left: -1 },
  lineOrientation: "horizontal",
  linePosition: -1,
  shadowSize: 0,
  shadowPosition: -1,
  shadowCursor: "default",
  selectionMode: "range",
  selectedRanges: [],
  selectedIndexes: [],
  selectedIds: [],
  activeSelectedRangeIdx: 0,
  copyRange: undefined,
  rightStickyColumns: undefined,
  bottomStickyRows: undefined,
};
