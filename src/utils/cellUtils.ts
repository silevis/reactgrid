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
      endRowIdx: rowIndex + (originCell?.rowSpan ?? 1),
      startColIdx: colIndex,
      endColIdx: colIndex + (originCell?.colSpan ?? 1),
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

export function getCellContainer(store: ReactGridStore, cell: Cell) {
  if (!store.reactGridRef) throw new Error("ReactGridRef is not defined!");

  const cellContainers = store.reactGridRef?.getElementsByClassName(`rgRowIdx-${cell.rowId} rgColIdx-${cell.colId}`);

  if (!cellContainers || cellContainers?.length === 0) return;
  if (cellContainers?.length !== 1) throw new Error("Cell container is not unique!");

  const cellElement = cellContainers[0];

  return cellElement;
}

export const getCellParentPaneName = (store: ReactGridStore, cell: Cell): PaneName => {
  const PANE_NAME_IDX = 0;
  const PANE_RANGE_IDX = 1;
  const PaneNamesAndRanges = Object.entries(store.paneRanges) as [PaneName, NumericalRange][];

  const parentPane = PaneNamesAndRanges.find((paneNameAndRange) => {
    const paneRange = paneNameAndRange[PANE_RANGE_IDX];
    return isCellInRange(store, cell, paneRange);
  });

  if (!parentPane) throw new Error(`Could not find cell's [rowId: ${cell.rowId}, colId: ${cell.colId}] parent pane!`);

  return parentPane[PANE_NAME_IDX] as PaneName;
};

/**
 * Returns the indexes of a cell in the ReactGrid store.
 * @param store - The ReactGrid store.
 * @param cell - The cell to find the indexes for.
 * @returns An object containing the row index and column index of the cell.
 */
export function getCellIndexes(store: ReactGridStore, cell: Cell): { rowIndex: number; colIndex: number } {
  const rowIndex = store.rows.findIndex((row) => row.id === cell.rowId);
  const colIndex = store.columns.findIndex((col) => col.id === cell.colId);

  return {
    rowIndex,
    colIndex,
  };
}

/**
 * Retrieves the sticky cell adjacent to the "Center" pane in the specified direction.
 * @param store The ReactGridStore object.
 * @param cell The position of the sticky cell in the selected direction is counted from this cell.
 * @param direction The direction to search for the sticky cell ("Top", "Bottom", "Right", "Left").
 * @returns The sticky cell adjacent to the center pane, or null if not found.
 */
export function getStickyCellAdjacentToCenterPane(
  store: ReactGridStore,
  cell: Cell,
  direction: "Top" | "Bottom" | "Right" | "Left"
) {
  let stickyCell: Cell | null = null;
  const originIndexes = getCellIndexes(store, cell);

  if (originIndexes.colIndex === -1 || originIndexes.rowIndex === -1) return null;

  let stickyPaneName;
  const cellParentPaneName = getCellParentPaneName(store, cell);
  if (direction === "Top" || direction === "Bottom") {
    stickyPaneName = (direction + cellParentPaneName.replace(/(Top|Bottom)/, "")) as PaneName;
  } else {
    stickyPaneName = direction;
  }

  const paneRange = store.paneRanges[stickyPaneName];
  const startOrEnd = direction === "Bottom" || direction === "Right" ? "start" : "end";

  const isExclusiveRangeIndex = startOrEnd === "end";

  const stickyIndexes = {
    rowIndex: paneRange?.[`${startOrEnd}RowIdx`] - (isExclusiveRangeIndex ? 1 : 0),
    colIndex: paneRange?.[`${startOrEnd}ColIdx`] - (isExclusiveRangeIndex ? 1 : 0),
  };

  if (direction === "Bottom" || direction === "Top") {
    stickyCell = store.getCellByIndexes(stickyIndexes.rowIndex, originIndexes.colIndex) ?? null;
  } else {
    stickyCell = store.getCellByIndexes(originIndexes.rowIndex, stickyIndexes.colIndex) ?? null;
  }

  return stickyCell;
}
