import { Cell, CellMap, Column, Range, Row, SpanMember, StyledRange } from "./PublicModel.ts";
import { RowMeasurement } from "./RowMeasurement.ts";
import { ColumnMeasurement } from "./ColumnMeasurement.ts";
import { FocusedCell, IndexedLocation, PaneName } from "./InternalModel.ts";
import { NumericalRange } from "./CellMatrix.ts";
import { Behavior, BehaviorId } from "./Behavior.ts";
import { RGTheme } from "./Theme";

export interface ReactGridStoreProps {
  rows: Row[];
  columns: Column[];
  minColumnWidth: number;

  cells: CellMap;

  rowMeasurements: RowMeasurement[];
  colMeasurements: ColumnMeasurement[];

  paneRanges: Record<PaneName, NumericalRange>;
  styledRanges: StyledRange[];

  userStyles?: Partial<RGTheme>;

  focusedLocation: IndexedLocation;
  absoluteFocusedLocation: IndexedLocation;
  selectedArea: NumericalRange;
  fillHandleArea: NumericalRange;

  reactGridRef?: HTMLDivElement;
  hiddenFocusTargetRef?: HTMLDivElement;

  behaviors: Record<BehaviorId, Behavior>;
  currentBehavior: Behavior;

  resizingColId?: number | string;

  enableColumnSelection?: boolean;

  enableRowSelection?: boolean;

  linePosition?: number;
  lineOrientation: "vertical" | "horizontal";

  shadowPosition?: number;
  shadowSize?: number;

  onFillHandle?: (selectedArea: NumericalRange, fillRange: NumericalRange) => void;
  onAreaSelected?: (selectedArea: NumericalRange) => void;
  onCellFocused?: (cellLocation: IndexedLocation) => void;
  onCut?: (selectedArea: NumericalRange) => void;
  onCopy?: (selectedArea: NumericalRange) => void;
  onPaste?: (selectedArea: NumericalRange, pastedData: string) => void;
  onResizeColumn?: (width: number, columnId: number | string) => void;
  onColumnReorder?: (selectedColIndexes: number[], destinationColIdx: number) => void;
  onRowReorder?: (selectedRowIndexes: number[], destinationRowIdx: number) => void;
}

export interface ReactGridStore extends ReactGridStoreProps {
  readonly setRows: (rows: Row[]) => void;
  readonly getRowAmount: () => number;

  readonly setColumns: (columns: Column[]) => void;
  readonly getColumnAmount: () => number;

  readonly setCells: (cellMap: CellMap) => void;

  readonly setUserStyles: (userStyles: RGTheme) => void;

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
  readonly setFillHandleArea: (fillHandleArea: NumericalRange) => void;

  readonly setSelectedColumns: (startColIdx: number, endColIdx: number) => void;

  readonly setSelectedRows: (startColIdx: number, endColIdx: number) => void;

  readonly setResizingColId: (columnId: number | string) => void;

  readonly setCurrentBehavior: (currentBehavior: Behavior) => void;
  readonly setLineOrientation: (lineOrientation: "horizontal" | "vertical") => void;
  readonly setLinePosition: (linePosition: number) => void;

  readonly assignReactGridRef: (reactGridRef?: HTMLDivElement) => void;

  readonly assignHiddenFocusTargetRef: (hiddenFocusTargetRef?: HTMLDivElement) => void;

  readonly getStyledRanges: (range?: Range) => StyledRange[] | [];

  readonly setBehaviors: (behaviors: Record<BehaviorId, Behavior>) => void;
  readonly getBehavior: (behaviorId: BehaviorId) => Behavior;
}
