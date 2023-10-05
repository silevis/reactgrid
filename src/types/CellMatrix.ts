import { Row, Column, CellMap } from "./PublicModel";

export interface GridRow<TRowId extends string = string> extends Row<TRowId> {
  readonly heightInPx: number;
  readonly top: number;
  readonly bottom: number;
}

export interface GridColumn<TColumnId extends string = string> extends Column<TColumnId> {
  readonly widthInPx: number;
  readonly left: number;
  readonly right: number;
}

// export interface StickyAmount {
//   top: number;
//   right: number;
//   bottom: number;
//   left: number;
// }

export interface CellMatrix<TRowId extends string = string, TColumnId extends string = string> {
  rows: Row<TRowId>[];
  columns: Column<TColumnId>[];

  cells: CellMap<TRowId, TColumnId>;
}

export interface GridMeasurements {
  rows: GridRow[];
  columns: GridColumn[];

  totalHeight: number;
  totalWidth: number;
}

export type NumericalRange = {
  startRowIdx: number,
  endRowIdx: number,
  startColIdx: number,
  endColIdx: number
};
