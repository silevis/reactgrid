import { ReactGridStore } from "../types/ReactGridStore.ts";

export const calcSelectedAreaWidth = (store: ReactGridStore): number => {
  const { selectedArea, columns } = store;
  let width = 0;

  for (let colIndex = selectedArea.startColIdx; colIndex < selectedArea.endColIdx; colIndex++) {
    const column = columns[colIndex];
    if (column && typeof column.width === "string") {
      const parsedWidth = parseInt(column.width.replace("px", ""), 10);
      if (!isNaN(parsedWidth)) {
        width += parsedWidth;
      }
    } else if (column && typeof column.width === "number") {
      width += column.width;
    }
  }

  return width;
};
