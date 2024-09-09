import { GridLookup } from "./PublicModel";
import { CellMap, Column, Row } from "./PublicModel";

export type CellMatrix = {
  rows: Row[];
  columns: Column[];
  cells: CellMap;
  gridLookup: GridLookup;
};
