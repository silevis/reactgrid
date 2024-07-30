import { Row, Column, SpanMember, Cell } from "./PublicModel";

export interface CellMatrix<TRowIdx extends number = number, TColumnIdx extends number = number> {
  rows: Row[];
  columns: Column[];

  cells: (Cell | SpanMember)[][];
}

export type NumericalRange = {
  startRowIdx: number;
  endRowIdx: number;
  startColIdx: number;
  endColIdx: number;
};
