import { NumericalRange } from "../types/CellMatrix";
import { Cell, SpanMember } from "../types/PublicModel";
import { ReactGridStore } from "./reactGridStore";

export const isSpanMember = (cell: Cell | SpanMember): cell is SpanMember => {
  return 'originRowId' in cell && 'originColId' in cell;
}

type SpannedCell = Cell & {
  rowSpan: number;
  colSpan: number;
}

export const isCellSpanned = (cell: Cell | SpanMember): cell is SpannedCell => {
  return 'rowSpan' in cell || 'colSpan' in cell;
}

export const getOriginCell = (cell: Cell | SpanMember, store: ReactGridStore): Cell => {
  if (isSpanMember(cell)) {
    return store.getCellByIds(cell.originRowId, cell.originColId) as Cell;
  } 
  
  return cell;
}

export const getCellArea = (cell: Cell | SpanMember, store: ReactGridStore): NumericalRange => {
  const originCell = getOriginCell(cell, store);
  const rowIndex = store.rows.findIndex(row => row.id === originCell.rowId);
  const colIndex = store.columns.findIndex(col => col.id === originCell.colId);

  if (isCellSpanned(originCell)) {
    return {
      startRowIdx: rowIndex,
      endRowIdx: rowIndex + originCell.rowSpan,
      startColIdx: colIndex,
      endColIdx: colIndex + originCell.colSpan,
    }
  }

  return {
    startRowIdx: rowIndex,
    endRowIdx: rowIndex + 1,
    startColIdx: colIndex,
    endColIdx: colIndex + 1,
  }
}

export const areAreasEqual = (area1: NumericalRange, area2: NumericalRange): boolean => {
  return area1.startRowIdx === area2.startRowIdx &&
    area1.endRowIdx === area2.endRowIdx &&
    area1.startColIdx === area2.startColIdx &&
    area1.endColIdx === area2.endColIdx;
}

export const findMinimalSelectedArea = (currentArea: NumericalRange, store: ReactGridStore): NumericalRange => {
  let didChange = false;
  const minimalArea: NumericalRange = { ...currentArea };

  for (let rowIndex = currentArea.startRowIdx; rowIndex < currentArea.endRowIdx; rowIndex++) {
    for (let colIndex = currentArea.startColIdx; colIndex < currentArea.endColIdx; colIndex++) {
      const cell = store.getCellByIndexes(rowIndex, colIndex);
      if (!cell) continue;

      const area = getCellArea(cell, store);

      if (area.startRowIdx < minimalArea.startRowIdx) {
        minimalArea.startRowIdx = area.startRowIdx;
        didChange = true;
      }
      if (area.endRowIdx > minimalArea.endRowIdx) {
        minimalArea.endRowIdx = area.endRowIdx;
        didChange = true;
      }
      if (area.startColIdx < minimalArea.startColIdx) {
        minimalArea.startColIdx = area.startColIdx;
        didChange = true;
      }
      if (area.endColIdx > minimalArea.endColIdx) {
        minimalArea.endColIdx = area.endColIdx;
        didChange = true;
      }
    }
  }

  if (didChange) {
    return findMinimalSelectedArea(minimalArea, store);
  }

  return minimalArea;
}
