import { ReactGridStore } from "../types/ReactGridStore";
import { getCellContainer } from "./getCellContainer";

export const calcSelectedAreaWidth = (store: ReactGridStore): number => {
  const { selectedArea, getCellByIndexes } = store;
  let width = 0;

  for (let colIndex = selectedArea.startColIdx; colIndex < selectedArea.endColIdx; ) {
    const cell = getCellByIndexes(0, colIndex); // get the first cell of the column

    if (cell) {
      const cellContainer = getCellContainer(store, cell) as HTMLElement | null;
      if (cellContainer) {
        width += cellContainer.offsetWidth;
      }

      // if cell has colSpan, increment colIndex by colSpan, else increment by 1
      colIndex += cell.colSpan ? cell.colSpan : 1;
    } else {
      colIndex++;
    }
  }

  return width;
};
