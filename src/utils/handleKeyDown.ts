import { NumericalRange } from "../types/CellMatrix";
import { EMPTY_AREA, areAreasEqual } from "./cellUtils";
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
      default:
        return store;
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
