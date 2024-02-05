import { Cell, CellMap, Column, Range, Row, SpanMember, StyledRange } from "./PublicModel.ts";
import { RowMeasurement } from "./RowMeasurement.ts";
import { ColumnMeasurement } from "./ColumnMeasurement.ts";
import { FocusedCell, IndexedLocation, PaneName } from "./InternalModel.ts";
import { NumericalRange } from "./CellMatrix.ts";
import { Behavior, BehaviorId } from "./Behavior.ts";

export interface ReactGridStore {
  rows: Row[];
  readonly setRows: (rows: Row[]) => void;
  readonly getRowAmount: () => number;
  columns: Column[];
  readonly setColumns: (columns: Column[]) => void;
  readonly getColumnAmount: () => number;
  cells: CellMap;
  readonly setCells: (cellMap: CellMap) => void;
  readonly getCellByIds: (
    rowId: ReactGridStore["rows"][number]["id"],
    colId: ReactGridStore["rows"][number]["id"]
  ) => Cell | null;
  readonly getCellByIndexes: (rowIndex: number, colIndex: number) => Cell | null;
  readonly getCellOrSpanMemberByIndexes: (rowIndex: number, colIndex: number) => Cell | SpanMember | null;

  rowMeasurements: RowMeasurement[];
  readonly setRowMeasurements: (rowMeasurements: RowMeasurement[]) => void;
  colMeasurements: ColumnMeasurement[];
  readonly setColMeasurements: (colMeasurements: ColumnMeasurement[]) => void;

  paneRanges: Record<PaneName, NumericalRange>;
  readonly setPaneRanges: (paneRanges: Record<PaneName, NumericalRange>) => void;

  focusedLocation: IndexedLocation;
  readonly setFocusedLocation: (rowIndex: number, colIndex: number) => void;
  readonly getFocusedCell: () => FocusedCell | null;

  selectedArea: NumericalRange;
  readonly setSelectedArea: (selectedArea: NumericalRange) => void;

  currentlyEditedCell: IndexedLocation;
  readonly setCurrentlyEditedCell: (rowIndex: number, colIndex: number) => void;

  reactGridRef?: HTMLDivElement;
  readonly assignReactGridRef: (reactGridRef?: HTMLDivElement) => void;

  hiddenFocusTargetRef?: HTMLDivElement;
  readonly assignHiddenFocusTargetRef: (hiddenFocusTargetRef?: HTMLDivElement) => void;

  styledRanges: StyledRange[];
  readonly setStyledRanges: (styledRanges: StyledRange[]) => void;
  readonly getStyledRanges: (range?: Range) => StyledRange[] | [];

  /* == Behaviors == */
  behaviors: Record<BehaviorId, Behavior>;
  currentBehavior: Behavior;
  readonly setBehaviors: (behaviors: Record<BehaviorId, Behavior>) => void;
  readonly getBehavior: (behaviorId: BehaviorId) => Behavior;
}