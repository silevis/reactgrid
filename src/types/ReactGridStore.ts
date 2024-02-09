import { Cell, CellMap, Column, Range, Row, SpanMember, StyledRange } from "./PublicModel.ts";
import { RowMeasurement } from "./RowMeasurement.ts";
import { ColumnMeasurement } from "./ColumnMeasurement.ts";
import { FocusedCell, IndexedLocation, PaneName } from "./InternalModel.ts";
import { NumericalRange } from "./CellMatrix.ts";
import { Behavior, BehaviorId } from "./Behavior.ts";

export interface ReactGridStoreProps {
  rows: Row[];
  columns: Column[];
  cells: CellMap;

  rowMeasurements: RowMeasurement[];
  colMeasurements: ColumnMeasurement[];

  paneRanges: Record<PaneName, NumericalRange>;
  styledRanges: StyledRange[];

  focusedLocation: IndexedLocation;
  absoluteFocusedLocation: IndexedLocation;
  selectedArea: NumericalRange;
  currentlyEditedCell: IndexedLocation;

  reactGridRef?: HTMLDivElement;
  hiddenFocusTargetRef?: HTMLDivElement;

  behaviors: Record<BehaviorId, Behavior>;
  currentBehavior: Behavior;
}

export interface ReactGridStore extends ReactGridStoreProps {
  readonly setRows: (rows: Row[]) => void;
  readonly getRowAmount: () => number;

  readonly setColumns: (columns: Column[]) => void;
  readonly getColumnAmount: () => number;

  readonly setCells: (cellMap: CellMap) => void;
  readonly getCellByIds: (
    rowId: ReactGridStore["rows"][number]["id"],
    colId: ReactGridStore["rows"][number]["id"]
  ) => Cell | null;
  // TODO: don't return null:
  readonly getCellByIndexes: (rowIndex: number, colIndex: number) => Cell | null;
  readonly getCellOrSpanMemberByIndexes: (rowIndex: number, colIndex: number) => Cell | SpanMember | null;

  readonly setRowMeasurements: (rowMeasurements: RowMeasurement[]) => void;
  readonly setColMeasurements: (colMeasurements: ColumnMeasurement[]) => void;

  readonly setPaneRanges: (paneRanges: Record<PaneName, NumericalRange>) => void;

  readonly setFocusedLocation: (rowIndex: number, colIndex: number) => void;
  readonly getFocusedCell: () => FocusedCell | null;

  readonly setSelectedArea: (selectedArea: NumericalRange) => void;

  readonly setCurrentlyEditedCell: (rowIndex: number, colIndex: number) => void;

  readonly assignReactGridRef: (reactGridRef?: HTMLDivElement) => void;

  readonly assignHiddenFocusTargetRef: (hiddenFocusTargetRef?: HTMLDivElement) => void;

  readonly setStyledRanges: (styledRanges: StyledRange[]) => void;
  readonly getStyledRanges: (range?: Range) => StyledRange[] | [];

  readonly setBehaviors: (behaviors: Record<BehaviorId, Behavior>) => void;
  readonly getBehavior: (behaviorId: BehaviorId) => Behavior;
}
