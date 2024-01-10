import { NumericalRange } from "../types/CellMatrix";
import { EMPTY_AREA, areAreasEqual, findMinimalSelectedArea, getCellArea } from "./cellUtils";
import { moveFocusDown, moveFocusInsideSelectedRange, moveFocusLeft, moveFocusRight, moveFocusUp } from "./focus";
import { ReactGridStore } from "./reactGridStore";
import { tryExpandingTowardsDirection } from "./tryExpandingTowardsDirection";

export const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, store: ReactGridStore): ReactGridStore => {
  if (event.altKey || store.currentlyEditedCell.rowIndex !== -1 || store.currentlyEditedCell.colIndex !== -1)
    return store;

  let focusedCell = store.getFocusedCell();
  if (!focusedCell) {
    const firstCell = store.getCellByIndexes(0, 0);
    if (!firstCell) return store;

    focusedCell = {
      rowIndex: 0,
      colIndex: 0,
      ...firstCell,
    };
  }

  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case "a": {
        event.preventDefault();

        const wholeGridArea: NumericalRange = {
          startRowIdx: 0,
          endRowIdx: store.rows.length,
          startColIdx: 0,
          endColIdx: store.columns.length,
        };

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

      // Select all rows according to columns in currently selected area OR focused cell area.
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

      case "ArrowUp": {
        if (!event.shiftKey) {
          return store;
        }

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
      case "ArrowDown": {
        if (!event.shiftKey) {
          return store;
        }

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

      case "ArrowLeft": {
        if (!event.shiftKey) {
          return store;
        }

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

      case "ArrowRight": {
        if (!event.shiftKey) {
          return store;
        }

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

  if (event.shiftKey) {
    switch (event.key) {
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
    }
  }

  const isAnyAreaSelected = !areAreasEqual(store.selectedArea, EMPTY_AREA);

  if (isAnyAreaSelected) {
    switch (event.key) {
      case "Tab": {
        event.preventDefault();

        if (event.shiftKey) return moveFocusInsideSelectedRange(store, focusedCell, "left");
        else return moveFocusInsideSelectedRange(store, focusedCell, "right");
      }
    }
  }

  switch (event.key) {
    case "Tab": {
      event.preventDefault();

      if (event.shiftKey) {
        return moveFocusLeft(store, focusedCell);
      } else {
        return moveFocusRight(store, focusedCell);
      }
    }
    case "Enter": {
      event.preventDefault();

      if (event.shiftKey) {
        return moveFocusUp(store, focusedCell);
      } else {
        return moveFocusDown(store, focusedCell);
      }
    }

    case "ArrowUp":
      event.preventDefault();
      if (event.shiftKey) return tryExpandingTowardsDirection(store, focusedCell, "Up");
      return moveFocusUp(store, focusedCell);
    case "ArrowDown":
      event.preventDefault();
      if (event.shiftKey) return tryExpandingTowardsDirection(store, focusedCell, "Down");
      return moveFocusDown(store, focusedCell);
    case "ArrowLeft":
      event.preventDefault();
      if (event.shiftKey) return tryExpandingTowardsDirection(store, focusedCell, "Left");
      return moveFocusLeft(store, focusedCell);
    case "ArrowRight":
      event.preventDefault();
      if (event.shiftKey) return tryExpandingTowardsDirection(store, focusedCell, "Right");
      return moveFocusRight(store, focusedCell);

    case "Home":
      event.preventDefault();
      return {
        ...store,
        focusedLocation: {
          rowIndex: focusedCell.rowIndex,
          colIndex: 0,
        },
      };
    case "End":
      event.preventDefault();
      return {
        ...store,
        focusedLocation: {
          rowIndex: focusedCell.rowIndex,
          colIndex: store.columns.length - 1,
        },
      };

    case "PageUp":
      event.preventDefault();
      return store;
    default:
      return store;
  }
};
