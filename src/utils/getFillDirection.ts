import { ReactGridStore } from "../types/ReactGridStore";
import { getCellArea } from "./getCellArea";
import { getCellIndexesFromPointerLocation } from "./getCellIndexesFromPointerLocation";

type FillDirection = "" | "up" | "down" | "left" | "right";

type Difference = {
  direction: FillDirection;
  value: number;
};

export const getFillDirection = (
  store: ReactGridStore,
  pointerLocation: React.PointerEvent<HTMLDivElement> | PointerEvent
): Difference | undefined => {
  const { rowIndex: pointerRowIdx, colIndex: pointerColIdx } = getCellIndexesFromPointerLocation(
    pointerLocation.clientX,
    pointerLocation.clientY
  );

  const currectFocusedCell = store.getCellByIndexes(store.focusedLocation.rowIndex, store.focusedLocation.colIndex);

  if (!currectFocusedCell) return undefined;

  const cellArea = getCellArea(store, currectFocusedCell);

  const differences: { direction: FillDirection; value: number }[] = [];

  differences.push({ direction: "", value: 0 });

  differences.push({
    direction: "up",
    value: pointerRowIdx < cellArea.startRowIdx ? pointerRowIdx : 0,
  });

  differences.push({
    direction: "down",
    value: pointerRowIdx >= cellArea.endRowIdx ? pointerRowIdx : 0,
  });

  differences.push({
    direction: "left",
    value: pointerColIdx < cellArea.startColIdx ? pointerColIdx : 0,
  });

  differences.push({
    direction: "right",
    value: pointerColIdx >= cellArea.endColIdx ? pointerColIdx : 0,
  });

  if (differences.every((diff) => diff.value === 0)) return differences[0];

  return differences.reduce((prev, current) => (prev.value > current.value ? prev : current));
};
