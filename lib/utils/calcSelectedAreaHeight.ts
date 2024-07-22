import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";

export const calcSelectedAreaHeight = (store: ReactGridStore): number => {
  const { selectedArea, getCellByIndexes } = store;
  let height = 0;

  for (let rowIndex = selectedArea.startRowIdx; rowIndex < selectedArea.endRowIdx; rowIndex++) {
    const cell = getCellByIndexes(rowIndex, 0); // get the first cell of the row
    if (cell) {
      const cellContainer = getCellContainer(store, cell);
      if (cellContainer) {
        height += cellContainer.offsetHeight;
      }
    }
  }

  return height;
};
