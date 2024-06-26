import { NumericalRange } from "../types/CellMatrix";
import { getCellArea } from "./getCellArea";
import { areAreasEqual } from "./areAreasEqual";
import { findMinimalSelectedArea } from "./findMinimalSelectedArea";
import { EMPTY_AREA, FocusedCell } from "../types/InternalModel";
import { moveFocusDown, moveFocusInsideSelectedRange, moveFocusLeft, moveFocusRight, moveFocusUp } from "./focus";
import { resizeSelectionInDirection } from "./resizeSelectionInDirection";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import React from "react";
import { getNumberOfVisibleRows } from "./getNumberOfVisibleRows.ts";
import { isCellSticky } from "./isCellSticky.ts";
import { isCellInRange } from "./isCellInRange.ts";
import { getStickyCellAdjacentToCenterPane } from "./getStickyCellAdjacentToCenterPane.ts";
import { Cell } from "../types/PublicModel.ts";
import { getCellIndexes } from "./getCellIndexes.1.ts";
import { isCellInPane } from "./isCellInPane.ts";

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

        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        const numberOfVisibleRows: number = getNumberOfVisibleRows(store, `${focusedCell.colIndex}`);

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);

        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        const nearestTopStickyCell = getStickyCellAdjacentToCenterPane(store, focusedCell, "Top");

        const nearestTopStickyCellRowIdx = nearestTopStickyCell
          ? getCellIndexes(store, nearestTopStickyCell).rowIndex +
            (nearestTopStickyCell && nearestTopStickyCell.rowSpan ? nearestTopStickyCell.rowSpan - 1 : 0)
          : null;

        let newRowIdx = 0;

        if (
          nearestTopStickyCellRowIdx !== null &&
          nearestTopStickyCellRowIdx >= focusedCell.rowIndex - numberOfVisibleRows &&
          nearestTopStickyCellRowIdx !== focusedCell.rowIndex - 1
        ) {
          newRowIdx = nearestTopStickyCellRowIdx + 1;
        } else {
          newRowIdx = Math.max(0, focusedCell.rowIndex - numberOfVisibleRows);
        }

        const isStickyCell = isCellSticky(store, focusedCell);

        if (isStickyCell) {
          if (isCellInPane(store, focusedCell, "Top")) {
            const minimalSelectedArea = findMinimalSelectedArea(store, {
              ...area,
              startRowIdx: 0,
              endRowIdx: focusedCell ? focusedCell?.rowIndex + 1 : 0,
            });

            return {
              ...store,
              selectedArea: { ...minimalSelectedArea },
              focusedLocation: {
                rowIndex: 0,
                colIndex: minimalSelectedArea.startColIdx,
              },
            };
          }
          if (isCellInPane(store, focusedCell, "Bottom")) {
            const nearestBottomStickyCell = getStickyCellAdjacentToCenterPane(store, focusedCell, "Bottom");
            if (!nearestBottomStickyCell) return store;
            const nearestBottomStickyCellIdx = getCellIndexes(store, nearestBottomStickyCell);

            if (focusedCell.rowIndex === nearestBottomStickyCellIdx.rowIndex) {
              const minimalSelectedArea = findMinimalSelectedArea(store, {
                ...area,
                startRowIdx: newRowIdx,
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

            const minimalSelectedArea = findMinimalSelectedArea(store, {
              ...area,
              startRowIdx: nearestBottomStickyCell ? nearestBottomStickyCellIdx.rowIndex : -1,
              endRowIdx: +focusedCell.rowIndex + 1,
            });

            return {
              ...store,
              selectedArea: { ...minimalSelectedArea },
              focusedLocation: {
                rowIndex: nearestBottomStickyCell ? nearestBottomStickyCellIdx.rowIndex : -1,
                colIndex: minimalSelectedArea.startColIdx,
              },
            };
          }
        }

        const minimalSelectedArea = findMinimalSelectedArea(store, {
          ...area,
          startRowIdx: newRowIdx,
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

        // Get currently selected area
        let area: NumericalRange = { ...store.selectedArea };

        const numberOfVisibleRows: number = getNumberOfVisibleRows(store, `${focusedCell.colIndex}`);

        // If there is no selected area, get focused cell area
        const isAnyAreaSelected = !areAreasEqual(area, EMPTY_AREA);

        if (!isAnyAreaSelected) {
          area = getCellArea(store, focusedCell);
        }

        const nearestBottomStickyCell = getStickyCellAdjacentToCenterPane(store, focusedCell, "Bottom");
        const nearestBottomStickyCellRowIdx = nearestBottomStickyCell
          ? getCellIndexes(store, nearestBottomStickyCell).rowIndex
          : null;

        let newRowIdx = 0;

        if (
          nearestBottomStickyCellRowIdx &&
          nearestBottomStickyCellRowIdx <= focusedCell.rowIndex + numberOfVisibleRows &&
          nearestBottomStickyCellRowIdx !== focusedCell.rowIndex + 1
        ) {
          newRowIdx = nearestBottomStickyCellRowIdx - 1;
        } else {
          newRowIdx = Math.max(0, focusedCell.rowIndex + numberOfVisibleRows);
        }

        const lastGridRowIdx = store.rows.length - 1;

        const isStickyCell = isCellSticky(store, focusedCell);

        if (isStickyCell) {
          if (isCellInPane(store, focusedCell, "Bottom")) {
            const lastRowCellSpan = store.getCellByIds(`${lastGridRowIdx}`, `${focusedCell.colIndex}`)?.rowSpan;
            const minimalSelectedArea = findMinimalSelectedArea(store, {
              ...area,
              startRowIdx: focusedCell ? focusedCell.rowIndex : 0,
              endRowIdx: store.rows.length,
            });

            return {
              ...store,
              selectedArea: { ...minimalSelectedArea },
              focusedLocation: {
                rowIndex: lastGridRowIdx - (lastRowCellSpan ? lastRowCellSpan - 1 : 0),
                colIndex: minimalSelectedArea.startColIdx,
              },
            };
          }
          if (isCellInPane(store, focusedCell, "Top")) {
            let targetCell: FocusedCell | Cell = focusedCell;
            let targetCellIdx = getCellIndexes(store, targetCell);

            while (isCellInPane(store, targetCell, "Top")) {
              targetCell = store.getCellByIndexes(
                targetCellIdx.rowIndex + (targetCell.rowSpan ?? 1),
                targetCellIdx.colIndex
              )!;
              targetCellIdx = getCellIndexes(store, targetCell);
            }

            const isTargetCellInFocusSpan =
              targetCellIdx.rowIndex === focusedCell.rowIndex + (focusedCell.rowSpan ? +focusedCell.rowSpan : 0);

            if (focusedCell.rowIndex !== targetCellIdx.rowIndex - 1 && !isTargetCellInFocusSpan) {
              const minimalSelectedArea = findMinimalSelectedArea(store, {
                ...area,
                startRowIdx:
                  store.selectedArea.startRowIdx !== -1 ? store.selectedArea.startRowIdx : focusedCell.rowIndex,
                endRowIdx: targetCellIdx.rowIndex,
              });

              return {
                ...store,
                selectedArea: { ...minimalSelectedArea },
                focusedLocation: {
                  rowIndex: targetCellIdx.rowIndex - 1,
                  colIndex: minimalSelectedArea.startColIdx,
                },
              };
            }

            const minimalSelectedArea = findMinimalSelectedArea(store, {
              ...area,
              endRowIdx: newRowIdx + 1,
            });

            return {
              ...store,
              selectedArea: { ...minimalSelectedArea },
              focusedLocation: {
                rowIndex: newRowIdx,
                colIndex: minimalSelectedArea.startColIdx,
              },
            };
          }
        }

        if (newRowIdx >= lastGridRowIdx) {
          const lastRowCellSpan = store.getCellByIds(`${lastGridRowIdx}`, `${focusedCell.colIndex}`)?.rowSpan;
          newRowIdx = lastGridRowIdx - (lastRowCellSpan ? lastRowCellSpan - 1 : 0);
        }

        const minimalSelectedArea = findMinimalSelectedArea(store, {
          ...area,
          endRowIdx: newRowIdx + 1,
        });

        return {
          ...store,
          selectedArea: { ...minimalSelectedArea },
          focusedLocation: {
            rowIndex: newRowIdx,
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
          if (focusedCell.colIndex === 0) return store;

          const nearestRightStickyCell = getStickyCellAdjacentToCenterPane(store, focusedCell, "Right");
          const nearestRightStickyCellIdx = nearestRightStickyCell
            ? getCellIndexes(store, nearestRightStickyCell)
            : { rowIndex: -1, colIndex: -1 };

          if (isCellInRange(store, focusedCell, store.paneRanges.Left)) {
            const minimalSelectedArea = findMinimalSelectedArea(store, {
              ...area,
              startColIdx: 0,
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
          if (isCellInRange(store, focusedCell, store.paneRanges.Right)) {
            if (nearestRightStickyCell && nearestRightStickyCellIdx.colIndex !== focusedCell.colIndex) {
              const minimalSelectedArea = findMinimalSelectedArea(store, {
                ...area,
                startColIdx: nearestRightStickyCellIdx.colIndex,
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
          }
        }

        const nearestLeftStickyCell = getStickyCellAdjacentToCenterPane(store, focusedCell, "Left");
        const nearestLeftStickyCellIdx = nearestLeftStickyCell
          ? getCellIndexes(store, nearestLeftStickyCell)
          : { rowIndex: -1, colIndex: -1 };

        if (nearestLeftStickyCell && focusedCell.colIndex === nearestLeftStickyCellIdx.colIndex + 1) {
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
        }

        const minimalSelectedArea = findMinimalSelectedArea(store, {
          ...area,
          startColIdx: nearestLeftStickyCell ? nearestLeftStickyCellIdx.colIndex + 1 : 0,
        });

        return {
          ...store,
          selectedArea: { ...minimalSelectedArea },
          focusedLocation: {
            rowIndex: focusedCell.rowIndex,

            colIndex: nearestLeftStickyCell ? nearestLeftStickyCellIdx.colIndex + 1 : 0,
          },
        };
      }

      // TODO: change to indexes
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

        const lastColumnIdx = store.columns.length - 1;

        if (!lastColumnIdx) return store;

        const lastColumnCellSpan = store.getCellByIndexes(focusedCell.rowIndex, lastColumnIdx)?.colSpan;

        const nearestLeftStickyCell = getStickyCellAdjacentToCenterPane(store, focusedCell, "Left");
        const nearestLeftStickyCellIdx = nearestLeftStickyCell
          ? getCellIndexes(store, nearestLeftStickyCell)
          : { rowIndex: -1, colIndex: -1 };

        if (isStickyCell) {
          if (focusedCell.colIndex === lastColumnIdx) return store;

          if (isCellInRange(store, focusedCell, store.paneRanges.Left)) {
            if (nearestLeftStickyCell && nearestLeftStickyCellIdx.colIndex !== focusedCell.colIndex) {
              const minimalSelectedArea = findMinimalSelectedArea(store, {
                ...area,
                endColIdx: nearestLeftStickyCellIdx.colIndex + 1,
              });

              return {
                ...store,
                selectedArea: { ...minimalSelectedArea },
                focusedLocation: {
                  rowIndex: nearestLeftStickyCellIdx.rowIndex,
                  colIndex: nearestLeftStickyCellIdx.colIndex,
                },
              };
            }
          }
          if (isCellInRange(store, focusedCell, store.paneRanges.Right)) {
            const minimalSelectedArea = findMinimalSelectedArea(store, {
              ...area,
              endColIdx: lastColumnIdx + 1,
            });

            return {
              ...store,
              selectedArea: { ...minimalSelectedArea },
              focusedLocation: {
                rowIndex: minimalSelectedArea.startRowIdx,
                colIndex: lastColumnCellSpan ? lastColumnIdx - lastColumnCellSpan + 1 : lastColumnIdx,
              },
            };
          }
        }

        const nearestRightStickyCell = getStickyCellAdjacentToCenterPane(store, focusedCell, "Right");
        const nearestRightStickyCellIdx = nearestRightStickyCell
          ? getCellIndexes(store, nearestRightStickyCell)
          : { rowIndex: -1, colIndex: -1 };

        if (nearestRightStickyCell && +nearestRightStickyCellIdx.colIndex === focusedCell.colIndex + 1) {
          const minimalSelectedArea = findMinimalSelectedArea(store, {
            ...area,
            endColIdx: lastColumnIdx + 1,
          });

          return {
            ...store,
            selectedArea: { ...minimalSelectedArea },
            focusedLocation: {
              rowIndex: minimalSelectedArea.startRowIdx,
              colIndex: lastColumnCellSpan ? lastColumnIdx - lastColumnCellSpan + 1 : lastColumnIdx,
            },
          };
        }

        const minimalSelectedArea = findMinimalSelectedArea(store, {
          ...area,
          endColIdx: nearestRightStickyCell ? nearestRightStickyCellIdx.colIndex : lastColumnIdx + 1,
        });

        return {
          ...store,
          selectedArea: { ...minimalSelectedArea },
          focusedLocation: {
            rowIndex: focusedCell.rowIndex,
            colIndex: nearestRightStickyCell
              ? nearestRightStickyCellIdx.colIndex - 1
              : lastColumnCellSpan
              ? lastColumnIdx - lastColumnCellSpan + 1
              : lastColumnIdx,
          },
        };
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
