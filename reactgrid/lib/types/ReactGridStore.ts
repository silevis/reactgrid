import { Cell, CellMap, Column, Range, Row, SpanMember, StyledRange } from "./PublicModel.ts";
import { RowMeasurement } from "./RowMeasurement.ts";
import { ColumnMeasurement } from "./ColumnMeasurement.ts";
import { FocusedCell, IndexedLocation, NestedStylesPartial, PaneName } from "./InternalModel.ts";
import { NumericalRange } from "./PublicModel.ts";
import { Behavior, BehaviorId } from "./Behavior.ts";
import { RGTheme } from "./RGTheme.ts";

export interface ReactGridStoreProps {
  rows: Row[];
  columns: Column[];

  cells: CellMap;

  rowMeasurements: RowMeasurement[];
  colMeasurements: ColumnMeasurement[];

  paneRanges: Record<PaneName, NumericalRange>;
  styledRanges: StyledRange[];

  styles?: NestedStylesPartial<RGTheme>;

  focusedLocation: IndexedLocation;
  changedFocusedLocation?: IndexedLocation;
  selectedArea: NumericalRange;
  fillHandleArea: NumericalRange;

  reactGridRef?: HTMLDivElement;
  hiddenFocusTargetRef?: HTMLDivElement;

  behaviors?: Partial<Record<BehaviorId, Behavior>>;
  currentBehavior: Behavior;

  resizingColIdx?: number;

  enableColumnSelectionOnFirstRow?: boolean;

  enableRowSelectionOnFirstColumn?: boolean;

  linePosition?: number;
  lineOrientation: "vertical" | "horizontal";

  shadowPosition?: number;
  shadowSize?: number;

  pointerStartIdx: IndexedLocation;

  onCellChanged: <T>(cellIndexes: IndexedLocation, value: T) => void;

  onFillHandle?: (selectedArea: NumericalRange, fillRange: NumericalRange) => void;
  onAreaSelected?: (selectedArea: NumericalRange) => void;
  onCellFocused?: (cellLocation: IndexedLocation) => void;
  onCut?: (selectedArea: NumericalRange) => void;
  onCopy?: (selectedArea: NumericalRange) => void;
  onPaste?: (selectedArea: NumericalRange, pastedData: string) => void;
  onResizeColumn?: (width: number, columnIdx: number[]) => void;
  onColumnReorder?: (selectedColIndexes: number[], destinationColIdx: number) => void;
  onRowReorder?: (selectedRowIndexes: number[], destinationRowIdx: number) => void;
}

export interface ReactGridStore extends ReactGridStoreProps {
  readonly setRows: (rows: Row[]) => void;
  readonly getRowAmount: () => number;

  readonly setColumns: (columns: Column[]) => void;
  readonly getColumnByIdx: (columnIdx: number) => Column | null;
  readonly getColumnAmount: () => number;

  readonly getColumnCells: (columnIdx: number) => Cell[];

  readonly setStyles: (styles: RGTheme) => void;

  readonly getCellByIndexes: (rowIndex: number, colIndex: number) => Cell | null;
  readonly getCellOrSpanMemberByIndexes: (rowIndex: number, colIndex: number) => Cell | SpanMember | null;

  readonly setRowMeasurements: (rowMeasurements: RowMeasurement[]) => void;
  readonly setColMeasurements: (colMeasurements: ColumnMeasurement[]) => void;

  readonly setPaneRanges: (paneRanges: Record<PaneName, NumericalRange>) => void;

  readonly setFocusedLocation: (rowIndex: number, colIndex: number) => void;
  readonly getFocusedCell: () => FocusedCell | null;

  readonly getSelectedArea: () => NumericalRange;
  readonly setSelectedArea: (selectedArea: NumericalRange) => void;
  readonly setFillHandleArea: (fillHandleArea: NumericalRange) => void;

  readonly setSelectedColumns: (startColIdx: number, endColIdx: number) => void;

  readonly setSelectedRows: (startColIdx: number, endColIdx: number) => void;

  readonly setResizingColIdx: (columnIdx: number) => void;

  readonly setCurrentBehavior: (currentBehavior: Behavior) => void;
  readonly setLineOrientation: (lineOrientation: "horizontal" | "vertical") => void;
  readonly setLinePosition: (linePosition: number) => void;

  readonly assignReactGridRef: (reactGridRef?: HTMLDivElement) => void;

  readonly assignHiddenFocusTargetRef: (hiddenFocusTargetRef?: HTMLDivElement) => void;

  readonly getStyledRanges: (range?: Range) => StyledRange[] | [];

  readonly getBehavior: (behaviorId: BehaviorId) => Behavior;

  readonly setExternalData: (rgData: Partial<ReactGridStoreProps>) => void;
}
