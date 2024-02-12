import { Cell, CellMap, Column, Range, Row, SpanMember, StyledRange } from "./PublicModel.ts";
import { RowMeasurement } from "./RowMeasurement.ts";
import { ColumnMeasurement } from "./ColumnMeasurement.ts";
import { FocusedCell, IndexedLocation, PaneName } from "./InternalModel.ts";
import { NumericalRange } from "./CellMatrix.ts";
import { Behavior, BehaviorId } from "./Behavior.ts";

export interface ReactGridStoreProps {
  readonly rows: Row[];
  readonly columns: Column[];
  readonly cells: CellMap;

  readonly rowMeasurements: RowMeasurement[];
  readonly colMeasurements: ColumnMeasurement[];

  readonly paneRanges: Record<PaneName, NumericalRange>;
  readonly styledRanges: StyledRange[];

  readonly focusedLocation: IndexedLocation;
  readonly selectedArea: NumericalRange;
  readonly currentlyEditedCell: IndexedLocation;

  readonly reactGridRef?: HTMLDivElement;
  readonly hiddenFocusTargetRef?: HTMLDivElement;

  readonly behaviors: Record<BehaviorId, Behavior>;
  readonly currentBehavior: Behavior;
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
