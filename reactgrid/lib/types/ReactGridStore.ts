import { Cell, Column, Range, RGThemeType, Row, StyledRange } from "./PublicModel.ts";
import { RowMeasurement } from "./RowMeasurement.ts";
import { ColumnMeasurement } from "./ColumnMeasurement.ts";
import { CellMap, FocusedCell, IndexedLocation, PaneName, SpanMember } from "./InternalModel.ts";
import { NumericalRange } from "./PublicModel.ts";
import { Behavior, BehaviorId } from "./Behavior.ts";
import { RGTheme } from "./RGTheme.ts";
import { CellsLookup } from "./PublicModel.ts";

export interface ReactGridStoreProps {
  id: string;
  rows: Row[];
  columns: Column[];

  cells: CellMap;
  cellsLookup: CellsLookup;

  rowMeasurements: RowMeasurement[];
  colMeasurements: ColumnMeasurement[];

  paneRanges: Record<PaneName, NumericalRange>;
  styledRanges: StyledRange[];

  styles?: RGThemeType;

  focusedLocation: IndexedLocation;
  changedFocusedLocation?: IndexedLocation;
  selectedArea: NumericalRange;
  fillHandleArea: NumericalRange;

  reactGridRef?: HTMLDivElement;

  behaviors?: Partial<Record<BehaviorId, Behavior>>;
  currentBehavior: Behavior;

  resizingColIdx?: number;

  enableColumnSelectionOnFirstRow?: boolean;
  enableRowSelectionOnFirstColumn?: boolean;

  disableCut?: boolean;
  disableCopy?: boolean;
  disablePaste?: boolean;
  disableFillHandle?: boolean;

  enableLogging?: boolean;

  linePosition?: number;
  lineOrientation: "vertical" | "horizontal";

  moveRightOnEnter: boolean;

  shadowPosition?: number;
  shadowSize?: number;

  pointerStartIdx: IndexedLocation;

  onFillHandle?: (selectedArea: NumericalRange, fillRange: NumericalRange, cellsLookup: CellsLookup) => boolean;
  onAreaSelected?: (selectedArea: NumericalRange) => void;
  onCellFocused?: (cellLocation: IndexedLocation) => void;
  onCut?: (
    event: React.ClipboardEvent<HTMLDivElement>,
    cellsRange: NumericalRange,
    cellsLookup: CellsLookup
  ) => boolean;
  onCopy?: (
    event: React.ClipboardEvent<HTMLDivElement>,
    cellsRange: NumericalRange,
    cellsLookup: CellsLookup
  ) => boolean;
  onPaste?: (
    event: React.ClipboardEvent<HTMLDivElement>,
    cellsRange: NumericalRange,
    cellsLookup: CellsLookup
  ) => boolean;
  onResizeColumn?: (width: number, columnIdx: number[]) => void;
  onColumnReorder?: (selectedColIndexes: number[], destinationColIdx: number) => void;
  onRowReorder?: (selectedRowIndexes: number[], destinationRowIdx: number) => void;
}

export interface ReactGridStore extends ReactGridStoreProps {
  readonly getRowAmount: () => number;

  readonly getColumnByIdx: (columnIdx: number) => Column | null;
  readonly getColumnAmount: () => number;

  readonly getColumnCells: (columnIdx: number) => Cell[];

  readonly setStyles: (styles: RGTheme) => void;

  readonly getCellByIndexes: (rowIndex: number, colIndex: number) => Cell | null;
  readonly getCellOrSpanMemberByIndexes: (rowIndex: number, colIndex: number) => Cell | SpanMember | null;

  readonly setCellsLookup: (cellsLookup: CellsLookup) => void;
  readonly getCellsLookup: () => CellsLookup;

  readonly setRowMeasurements: (rowMeasurements: RowMeasurement[]) => void;
  readonly setColMeasurements: (colMeasurements: ColumnMeasurement[]) => void;

  readonly getPaneRanges: () => Record<PaneName, NumericalRange>;
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

  readonly getStyledRanges: (range?: Range) => StyledRange[] | [];

  readonly getBehavior: (behaviorId: BehaviorId) => Behavior;

  readonly setExternalData: (rgData: Partial<ReactGridStoreProps>) => void;
}
