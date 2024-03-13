import { NumericalRange } from "../types/CellMatrix";
import { getCellArea } from "./getCellArea";
import { areAreasEqual } from "./areAreasEqual";
import { findMinimalSelectedArea } from "./findMinimalSelectedArea";
import { EMPTY_AREA } from "../types/InternalModel";
import { moveFocusDown, moveFocusInsideSelectedRange, moveFocusLeft, moveFocusRight, moveFocusUp } from "./focus";
import { resizeSelectionInDirection } from "./resizeSelectionInDirection";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import React from "react";
import { getNumberOfVisibleRows } from "./getNumberOfVisibleRows.ts";
import { isCellSticky } from "./isCellSticky.ts";
import { isCellInRange } from "./isCellInRange.ts";
import { getStickyCellAdjacentToCenterPane } from "./getStickyCellAdjacentToCenterPane.ts";
import { Cell } from "../types/PublicModel.ts";

type HandleKeyDownConfig = {
  moveHorizontallyOnEnter: boolean;
};

const CONFIG_DEFAULTS: HandleKeyDownConfig = {
  moveHorizontallyOnEnter: false,
} as const;

// ? Problem: The more complicated is the key-combination (the more keys are included), the higher-in-code it has to be.
// * By that I mean it has to be executed earlier.
export const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  store: ReactGridStore,
  config: HandleKeyDownConfig = CONFIG_DEFAULTS
): ReactGridStore => {
  if (event.altKey || store.currentlyEditedCell.rowIndex !== -1 || store.currentlyEditedCell.colIndex !== -1)
    return store;

  // Check if there is focusedCell
  let focusedCell = store.getFocusedCell();
  if (!focusedCell) {
    const firstCell = store.getCellByIndexes(0, 0);
    if (!firstCell) return store;

    // If there is no focused cell, set it to the first cell in the grid.
    focusedCell = {
      rowIndex: 0,
      colIndex: 0,
      ...firstCell,
    };
  }

  const isAnyAreaSelected = !areAreasEqual(store.selectedArea, EMPTY_AREA);

  // * SHIFT + CTRL/COMMAND (⌘) + <Key>
  if (event.shiftKey && (event.ctrlKey || event.metaKey)) {
    switch (event.key) {
      // Select all rows according to columns in currently selected area OR focused cell area.
      case "ArrowUp": {
        event.preventDefault();
        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);
        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        // Get the area occupied by cells in the selected columns.
        // Expand the obtained area by the area of cells that are spanned-cells, in selected direction (up).
        const areaWithSpannedCells = findMinimalSelectedArea(store, {
          ...area,
          startRowIdx: Number(store.rows[0].id),
        });

        // Select all cells in obtained area, including spanned cells.
        return { ...store, selectedArea: { ...areaWithSpannedCells } };
      }

      // Select all rows according to columns in currently selected area OR focused cell area.
      case "ArrowDown": {
        event.preventDefault();
        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);
        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        // Get the area occupied by cells in the selected columns.
        // Expand the obtained area by the area of cells that are spanned-cells, in selected direction (down).
        const areaWithSpannedCells = findMinimalSelectedArea(store, {
          ...area,
          endRowIdx: store.rows.length,
        });

        // Select all cells in obtained area, including spanned cells.
        return { ...store, selectedArea: { ...areaWithSpannedCells } };
      }

      // Select all columns according to rows in currently selected area OR focused cell area.
      case "ArrowLeft": {
        event.preventDefault();
        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);
        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        // Get the area occupied by cells in the selected rows.
        // Expand the obtained area by the area of cells that are spanned-cells, in selected direction (to left).
        const areaWithSpannedCells = findMinimalSelectedArea(store, {
          ...area,
          startColIdx: Number(store.columns[0].id),
        });

        // Select all cells in obtained area, including spanned cells.
        return { ...store, selectedArea: { ...areaWithSpannedCells } };
      }

      // Select all columns according to rows in currently selected area OR focused cell area.
      case "ArrowRight": {
        event.preventDefault();
        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);
        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        // Get the area occupied by cells in the selected rows.
        // Expand the obtained area by the area of cells that are spanned-cells, in selected direction (to right).
        const areaWithSpannedCells = findMinimalSelectedArea(store, {
          ...area,
          endColIdx: store.columns.length,
        });

        // Select all cells in obtained area, including spanned cells.
        return { ...store, selectedArea: { ...areaWithSpannedCells } };
      }
      default:
        return store;
    }
  }

  // * CTRL/COMMAND (⌘) + <Key>
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      // Select all cells in the grid.
      case "a": {
        event.preventDefault();

        const wholeGridArea: NumericalRange = {
          startRowIdx: 0,
          endRowIdx: store.rows.length,
          startColIdx: 0,
          endColIdx: store.columns.length,
        };
        // If the whole grid is already selected, deselect it.
        if (areAreasEqual(store.selectedArea, wholeGridArea)) {
          return {
            ...store,
            selectedArea: {
              startRowIdx: -1,
              endRowIdx: -1,
              startColIdx: -1,
              endColIdx: -1,
            },
          };
        }

        return {
          ...store,
          selectedArea: wholeGridArea,
        };
      }

      case "Home": {
        event.preventDefault();

        return {
          ...store,
          focusedLocation: {
            rowIndex: 0,
            colIndex: 0,
          },
        };
      }

      case "End": {
        event.preventDefault();

        return {
          ...store,
          focusedLocation: {
            rowIndex: store.rows.length - 1,
            colIndex: store.columns.length - 1,
          },
        };
      }

      // Jump to the cell that is in the first row, but in the same column as the focused cell.
      case "ArrowUp": {
        event.preventDefault();
        if (!focusedCell) return store;
        return { ...store, focusedLocation: { ...store.focusedLocation, rowIndex: 0 }, selectedArea: EMPTY_AREA };
      }
      // Jump to the cell that is in the last row, but in the same column as the focused cell.
      case "ArrowDown": {
        event.preventDefault();
        if (!focusedCell) return store;
        return {
          ...store,
          focusedLocation: { ...store.focusedLocation, rowIndex: store.rows.length - 1 },
          selectedArea: EMPTY_AREA,
        };
      }
      // Jump to the cell that is in the first column, but in the same row as the focused cell.
      case "ArrowLeft": {
        event.preventDefault();
        if (!focusedCell) return store;
        return { ...store, focusedLocation: { ...store.focusedLocation, colIndex: 0 }, selectedArea: EMPTY_AREA };
      }
      // Jump to the cell that is in the last column, but in the same row as the focused cell.
      case "ArrowRight": {
        event.preventDefault();
        if (!focusedCell) return store;
        return {
          ...store,
          focusedLocation: { ...store.focusedLocation, colIndex: store.columns.length - 1 },
          selectedArea: EMPTY_AREA,
        };
      }

      // Select all rows according to columns in currently selected area OR focused cell area.
      case " ": {
        event.preventDefault();
        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);
        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        // Get the area occupied by cells in the selected columns.
        // Expand the obtained area by the area of cells that are spanned-cells.
        const areaWithSpannedCells = findMinimalSelectedArea(store, {
          ...area,
          startRowIdx: Number(store.rows[0].id),
          endRowIdx: store.rows.length,
        });

        // Select all cells in obtained area, including spanned cells.
        return { ...store, selectedArea: { ...areaWithSpannedCells } };
      }

      // If nothing has changed, return the store as it is.
      default:
        return store;
    }
  }

  // * SHIFT + <Key>
  if (event.shiftKey) {
    switch (event.key) {
      // Manage selection by expanding/shrinking it towards the direction of the arrow key.
      case "ArrowUp":
        event.preventDefault();
        return resizeSelectionInDirection(store, focusedCell, "Up");
      case "ArrowDown":
        event.preventDefault();
        return resizeSelectionInDirection(store, focusedCell, "Down");
      case "ArrowLeft":
        event.preventDefault();
        return resizeSelectionInDirection(store, focusedCell, "Left");
      case "ArrowRight":
        event.preventDefault();
        return resizeSelectionInDirection(store, focusedCell, "Right");

      case "PageUp": {
        event.preventDefault();

        const scrollableParent = store.reactGridRef!;

        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        const currentCell = store.getFocusedCell();

        const numberOfVisibleRows: number = getNumberOfVisibleRows(store, scrollableParent, currentCell?.colId);

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);
        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        let newRowId = Math.max(0, currentCell ? currentCell?.rowIndex - numberOfVisibleRows : 0);

        const isStickyCell = isCellSticky(store, focusedCell);

        let targetCell: Cell | null = focusedCell;

        if (isStickyCell) {
          let hasMoved = false;
          while (
            isCellInRange(store, targetCell, store.paneRanges.TopLeft) ||
            isCellInRange(store, targetCell, store.paneRanges.TopCenter) ||
            isCellInRange(store, targetCell, store.paneRanges.TopRight)
          ) {
            targetCell = store.getCellByIndexes(+targetCell.rowId + (targetCell.rowSpan ?? 1), +targetCell?.colId)!;
            hasMoved = true;
          }

          if (hasMoved) {
            const minimalSelectedArea = findMinimalSelectedArea(store, {
              ...area,
              startRowIdx: focusedCell.rowIndex,
              endRowIdx: targetCell ? +targetCell?.rowId + 1 : 0,
            });

            return {
              ...store,
              selectedArea: { ...minimalSelectedArea },
              focusedLocation: {
                rowIndex: minimalSelectedArea.endRowIdx - (targetCell.rowSpan ?? 1),
                colIndex: minimalSelectedArea.startColIdx,
              },
            };
          }
        }

        do {
          const cell = currentCell && store.getCellByIndexes(newRowId, +currentCell?.colId);
          if (
            cell &&
            (isCellInRange(store, cell, store.paneRanges.Left) ||
              isCellInRange(store, cell, store.paneRanges.Center) ||
              isCellInRange(store, cell, store.paneRanges.Right))
          ) {
            break;
          }
          newRowId++;
        } while (newRowId <= store.rows.length);

        const minimalSelectedArea = findMinimalSelectedArea(store, {
          ...area,
          startRowIdx: newRowId,
        });

        return {
          ...store,
          selectedArea: { ...minimalSelectedArea },
          focusedLocation: {
            rowIndex: minimalSelectedArea.startRowIdx,
            colIndex: minimalSelectedArea.startColIdx,
          },
        };
      }

      case "PageDown": {
        event.preventDefault();

        const scrollableParent = store.reactGridRef!;

        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        const currentCell = store.getFocusedCell();

        const numberOfVisibleRows: number = getNumberOfVisibleRows(store, scrollableParent, currentCell?.colId);

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);
        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        let newRowId = Math.max(0, currentCell ? currentCell?.rowIndex + numberOfVisibleRows : 0);

        const isStickyCell = isCellSticky(store, focusedCell);

        if (isStickyCell) {
          if (
            focusedCell &&
            (isCellInRange(store, focusedCell, store.paneRanges.BottomLeft) ||
              isCellInRange(store, focusedCell, store.paneRanges.BottomCenter) ||
              isCellInRange(store, focusedCell, store.paneRanges.BottomRight))
          ) {
            const nearestBottomStickyCell = getStickyCellAdjacentToCenterPane(store, focusedCell, "Bottom");

            if (!nearestBottomStickyCell) return store;
            const minimalSelectedArea = findMinimalSelectedArea(store, {
              ...area,
              startRowIdx: +nearestBottomStickyCell?.rowId - 1,
              endRowIdx: focusedCell.rowIndex + 1,
            });

            return {
              ...store,
              selectedArea: { ...minimalSelectedArea },
              focusedLocation: {
                rowIndex: +nearestBottomStickyCell?.rowId - 1,
                colIndex: +nearestBottomStickyCell?.colId,
              },
            };
          }
        }

        do {
          const cell = currentCell && store.getCellByIndexes(newRowId, +currentCell?.colId);
          if (
            cell &&
            (isCellInRange(store, cell, store.paneRanges.Left) ||
              isCellInRange(store, cell, store.paneRanges.Center) ||
              isCellInRange(store, cell, store.paneRanges.Right))
          ) {
            break;
          }
          newRowId--;
        } while (newRowId >= 0);

        const minimalSelectedArea = findMinimalSelectedArea(store, {
          ...area,
          endRowIdx: newRowId + 1,
        });

        return {
          ...store,
          selectedArea: { ...minimalSelectedArea },
          focusedLocation: {
            rowIndex: minimalSelectedArea.endRowIdx - 1,
            colIndex: minimalSelectedArea.startColIdx,
          },
        };
      }

      case "Home": {
        event.preventDefault();

        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);

        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        const isStickyCell = isCellSticky(store, focusedCell);

        if (isStickyCell) {
          const minimalSelectedArea = findMinimalSelectedArea(store, {
            ...area,
            startColIdx: 0,
          });

          return {
            ...store,
            selectedArea: { ...minimalSelectedArea },
            focusedLocation: {
              rowIndex: minimalSelectedArea.startRowIdx,
              colIndex: 0,
            },
          };
        } else {
          const nearestLeftStickyCell = getStickyCellAdjacentToCenterPane(store, focusedCell, "Left");

          const minimalSelectedArea = findMinimalSelectedArea(store, {
            ...area,
            startColIdx: nearestLeftStickyCell ? +nearestLeftStickyCell.colId + 1 : 0,
          });

          return {
            ...store,
            selectedArea: { ...minimalSelectedArea },
            focusedLocation: {
              rowIndex: focusedCell.rowIndex,
              colIndex: nearestLeftStickyCell ? +nearestLeftStickyCell.colId + 1 : 0,
            },
          };
        }
      }

      case "End": {
        event.preventDefault();

        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);

        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        const isStickyCell = isCellSticky(store, focusedCell);

        if (isStickyCell) {
          const lastColumn = store.columns.at(-1);
          const minimalSelectedArea = findMinimalSelectedArea(store, {
            ...area,
            endColIdx: lastColumn ? +lastColumn.id + 1 : -1,
          });

          return {
            ...store,
            selectedArea: { ...minimalSelectedArea },
            focusedLocation: {
              rowIndex: focusedCell.rowIndex,
              colIndex: lastColumn ? +lastColumn.id : -1,
            },
          };
        } else {
          const rightStickyCell = getStickyCellAdjacentToCenterPane(store, focusedCell, "Right");

          const minimalSelectedArea = findMinimalSelectedArea(store, {
            ...area,
            endColIdx: rightStickyCell ? +rightStickyCell.colId : 0,
          });

          return {
            ...store,
            selectedArea: { ...minimalSelectedArea },
            focusedLocation: {
              rowIndex: focusedCell.rowIndex,
              colIndex: rightStickyCell ? +rightStickyCell.colId - 1 : 0,
            },
          };
        }
      }

      // Select all columns according to rows in currently selected area OR focused cell area.
      // SPACE BAR
      case " ": {
        event.preventDefault();
        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);
        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        // Get the area occupied by cells in the selected rows.
        // Expand the obtained area by the area of cells that are spanned-cells.
        const areaWithSpannedCells = findMinimalSelectedArea(store, {
          ...area,
          startColIdx: Number(store.columns[0].id),
          endColIdx: store.columns.length,
        });

        // Select all cells in obtained area, including spanned cells.
        return { ...store, selectedArea: { ...areaWithSpannedCells } };
      }
      case "Enter": {
        event.preventDefault();

        if (config.moveHorizontallyOnEnter) {
          if (event.shiftKey) return moveFocusInsideSelectedRange(store, focusedCell, "left");
          return moveFocusInsideSelectedRange(store, focusedCell, "right");
        } else {
          if (event.shiftKey) return moveFocusInsideSelectedRange(store, focusedCell, "up");
          else return moveFocusInsideSelectedRange(store, focusedCell, "down");
        }
      }
    }
  }

  // * Other key-downs (non-combinations)

  switch (event.key) {
    // Move focus to next cell.
    case "Tab": {
      event.preventDefault();

      if (event.shiftKey) {
        // If shift is pressed, move focus to the left...
        if (isAnyAreaSelected) {
          // ...inside selected range if any range is selected, or...
          return moveFocusInsideSelectedRange(store, focusedCell, "left");
        }

        // ...to the left if no range is selected.
        return moveFocusLeft(store, focusedCell);
      } else {
        // If shift is not pressed, move focus to the right...
        if (isAnyAreaSelected) {
          // ...inside selected range if any range is selected, or...
          return moveFocusInsideSelectedRange(store, focusedCell, "right");
        }

        // ...to the right if no range is selected.
        return moveFocusRight(store, focusedCell);
      }
    }

    // ! May create conflict with other Edit-mode.
    case "Enter": {
      event.preventDefault();

      if (config.moveHorizontallyOnEnter) {
        if (event.shiftKey) return moveFocusInsideSelectedRange(store, focusedCell, "left");
        return moveFocusInsideSelectedRange(store, focusedCell, "right");
      } else {
        if (event.shiftKey) {
          return moveFocusUp(store, focusedCell); // If shift is pressed, move focus up (row up).
        } else {
          return moveFocusDown(store, focusedCell); // Otherwise, move focus down (row down).
        }
      }
    }

    // Move focus to adjacent cell, according to the direction that arrow key points to.
    case "ArrowUp":
      event.preventDefault();
      return moveFocusUp(store, focusedCell);
    case "ArrowDown":
      event.preventDefault();
      return moveFocusDown(store, focusedCell);
    case "ArrowLeft":
      event.preventDefault();
      return moveFocusLeft(store, focusedCell);
    case "ArrowRight":
      event.preventDefault();
      return moveFocusRight(store, focusedCell);

    // Move focus to the first/last cell in the row.
    case "Home": {
      event.preventDefault();
      return {
        ...store,
        focusedLocation: {
          rowIndex: focusedCell.rowIndex,
          colIndex: 0,
        },
        // If any area is selected, remove it.
        selectedArea: EMPTY_AREA,
      };
    }
    case "End": {
      event.preventDefault();

      return {
        ...store,
        focusedLocation: {
          rowIndex: focusedCell.rowIndex,
          colIndex: store.columns.length - 1,
        },
        // If any area is selected, remove it.
        selectedArea: EMPTY_AREA,
      };
    }

    // TODO: Implement PageUp and PageDown
    case "PageUp":
      event.preventDefault();
      return store;
    default:
      return store;
  }
};
