import { moveFocusDown, moveFocusLeft, moveFocusRight, moveFocusUp } from "./focus";
import { ReactGridStore } from "./reactGridStore";

export const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, store: ReactGridStore): ReactGridStore => {
  if (event.altKey || store.currentlyEditedCell.rowIndex !== -1 || store.currentlyEditedCell.colIndex !== -1) return store;

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

  switch (event.key) {
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
    
    case "PageUp":
      event.preventDefault();
      return store;
    default:
      return store;
  }
  // if (event.shiftKey) {
  // }

  return store;
};
