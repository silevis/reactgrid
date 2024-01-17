import { NumericalRange } from "../types/CellMatrix";
import { PaneName } from "../types/InternalModel";
import { Cell, SpanMember } from "../types/PublicModel";
import { ReactGridStore } from "./reactGridStore";

export const isSpanMember = (cell: Cell | SpanMember): cell is SpanMember => {
  return "originRowId" in cell && "originColId" in cell;
};

type SpannedCell = Cell & {
  rowSpan: number;
  colSpan: number;
};

export const EMPTY_AREA = {
  startRowIdx: -1,
  endRowIdx: -1,
  startColIdx: -1,
  endColIdx: -1,
} as const;

export const isCellSpanned = (cell: Cell | SpanMember): cell is SpannedCell => {
  return "rowSpan" in cell || "colSpan" in cell;
};

export const getOriginCell = (store: ReactGridStore, cell: Cell | SpanMember): Cell => {
  if (isSpanMember(cell)) {
    return store.getCellByIds(cell.originRowId, cell.originColId) as Cell;
  }

  return cell;
};

export const getCellArea = (store: ReactGridStore, cell: Cell | SpanMember): NumericalRange => {
  const originCell = getOriginCell(store, cell);
  const rowIndex = store.rows.findIndex((row) => row.id === originCell.rowId);
  const colIndex = store.columns.findIndex((col) => col.id === originCell.colId);

  if (isCellSpanned(originCell)) {
    return {
      startRowIdx: rowIndex,
      endRowIdx: rowIndex + originCell.rowSpan,
      startColIdx: colIndex,
      endColIdx: colIndex + originCell.colSpan,
    };
  }

  return {
    startRowIdx: rowIndex,
    endRowIdx: rowIndex + 1,
    startColIdx: colIndex,
    endColIdx: colIndex + 1,
  };
};

export const areAreasEqual = (area1: NumericalRange, area2: NumericalRange): boolean => {
  return (
    area1.startRowIdx === area2.startRowIdx &&
    area1.endRowIdx === area2.endRowIdx &&
    area1.startColIdx === area2.startColIdx &&
    area1.endColIdx === area2.endColIdx
  );
};

export const isCellInRange = (store: ReactGridStore, cell: Cell | SpanMember, range: NumericalRange): boolean => {
  const cellArea = getCellArea(store, cell);

  return (
    cellArea.startRowIdx >= range.startRowIdx &&
    cellArea.endRowIdx <= range.endRowIdx &&
    cellArea.startColIdx >= range.startColIdx &&
    cellArea.endColIdx <= range.endColIdx
  );
};

export const findMinimalSelectedArea = (store: ReactGridStore, currentArea: NumericalRange): NumericalRange => {
  let didChange = false;
  const minimalArea: NumericalRange = { ...currentArea };

  for (let rowIndex = currentArea.startRowIdx; rowIndex < currentArea.endRowIdx; rowIndex++) {
    for (let colIndex = currentArea.startColIdx; colIndex < currentArea.endColIdx; colIndex++) {
      const cell = store.getCellByIndexes(rowIndex, colIndex);
      if (!cell) continue;

      const area = getCellArea(store, cell);

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
    return findMinimalSelectedArea(store, minimalArea);
  }

  return minimalArea;
};

export function getCellPane(store: ReactGridStore, cell: Cell): HTMLElement {
  const { rowId, colId } = cell;
  const cellContainer = store.reactGridRef?.getElementsByClassName(
    `rgCellContainer rgRowIdx-${rowId} rgColIdx-${colId}`
  );
  if (!cellContainer) throw new Error("No cellContainer found for this cell!");
  if (cellContainer.length !== 1)
    throw new Error("There should be no two cells occupying the same space (simultaneously occupying X and Y)!");
  const pane = cellContainer[0].closest(".rgPane") as HTMLDivElement;

  return pane;
}

/**
 * Retrieves the sticky pane direction from the given pane element.
 * @param pane - The pane element.
 * @returns The sticky pane direction, or undefined if not found.
 */
export function getStickyPaneDirection(pane: HTMLElement): PaneName | undefined {
  const direction = [...pane.classList].find((className) => className.includes("rgPane-"))?.replace("rgPane-", "");
  return direction as PaneName;
}

/**
 * Checks if a cell is sticky.
 * @param store - The ReactGridStore object.
 * @param cell - The cell object to check.
 * @returns True if the cell is on sticky pane, false otherwise.
 */
export function isCellSticky(store: ReactGridStore, cell: Cell): boolean {
  return !isCellInRange(store, cell, store.paneRanges.Center);
}

export const getContainerElementByIndexes = (rowIndex: number, colIndex: number): HTMLElement | null => {
  const cellContainer = document.getElementsByClassName(`rgCellContainer rgRowIdx-${rowIndex} rgColIdx-${colIndex}`)[0];
  if (!cellContainer) return null;

  return cellContainer as HTMLElement;
};
