import { NumericalRange } from "../types/CellMatrix";


export const areAreasEqual = (area1: NumericalRange, area2: NumericalRange): boolean => {
  return (
    area1.startRowIdx === area2.startRowIdx &&
    area1.endRowIdx === area2.endRowIdx &&
    area1.startColIdx === area2.startColIdx &&
    area1.endColIdx === area2.endColIdx
  );
};
