import { Row, Column, CellMap } from "./PublicModel";

export interface GridRow<TRowId extends string = string> extends Row<TRowId> {
  // readonly idx: number;
  readonly top: number;
  readonly bottom: number;
}

export interface GridColumn<TColumnId extends string = string> extends Column<TColumnId> {
  // readonly idx: number;
  readonly left: number;
  readonly right: number;
}

export interface StickyAmount {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CellMatrix<TRowId extends string = string, TColumnId extends string = string> {
  rows: GridRow<TRowId>[];
  columns: GridColumn<TColumnId>[];

  cells: CellMap<TRowId, TColumnId>;

  totalHeight: number;
  totalWidth: number;

  stickyAmount: StickyAmount;
}