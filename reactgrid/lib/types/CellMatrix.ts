import { Row, Column, SpanMember, Cell } from "./PublicModel";

export interface CellMatrix {
  rows: Row[];
  columns: Column[];

  cells: (Cell | SpanMember)[][];
}
