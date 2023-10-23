import { Row, Column, CellMap } from "./PublicModel";

export interface CellMatrix<TRowId extends string = string, TColumnId extends string = string> {
  rows: Row<TRowId>[];
  columns: Column<TColumnId>[];

  cells: CellMap<TRowId, TColumnId>;
}

export type NumericalRange = {
  startRowIdx: number,
  endRowIdx: number,
  startColIdx: number,
  endColIdx: number
};
