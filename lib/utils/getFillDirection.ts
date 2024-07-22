import { ReactGridStore } from "../types/ReactGridStore";
import { getCellArea } from "./getCellArea";
import { getColumnIdxByPointerLocation } from "./getColumnIdxByPointerLocation";
import { getRowIdxByPointerLocation } from "./getRowIdxByPointerLocation";

type FillDirection = "" | "up" | "down" | "left" | "right";

type Difference = {
  direction: FillDirection;
  value: number | null;
};

export const getFillDirection = (
  store: ReactGridStore,
  pointerLocation: React.PointerEvent<HTMLDivElement> | PointerEvent
): Difference | undefined => {
  const pointerRowIdx = getRowIdxByPointerLocation(store, pointerLocation.clientX, pointerLocation.clientY);
  const pointerColIdx = getColumnIdxByPointerLocation(store, pointerLocation.clientX, pointerLocation.clientY);

  const currectFocusedCell = store.getCellByIndexes(store.focusedLocation.rowIndex, store.focusedLocation.colIndex);

  if (!currectFocusedCell || pointerColIdx === -1) return undefined;

  const selectedArea = store.selectedArea;

  const isSelectedArea = store.selectedArea.startRowIdx !== -1;

  const cellArea = isSelectedArea ? selectedArea : getCellArea(store, currectFocusedCell);

  const differences: { direction: FillDirection; value: number | null }[] = [];

  differences.push({ direction: "", value: null });

  differences.push({
    direction: "up",
    value: pointerRowIdx < cellArea.startRowIdx ? pointerRowIdx : null,
  });

  differences.push({
    direction: "down",
    value: pointerRowIdx >= cellArea.endRowIdx ? pointerRowIdx : null,
  });

  differences.push({
    direction: "left",
    value: pointerColIdx < cellArea.startColIdx ? pointerColIdx : null,
  });

  differences.push({
    direction: "right",
    value: pointerColIdx >= cellArea.endColIdx ? pointerColIdx : null,
  });

  if (differences.every((diff) => diff.value === null)) return differences[0];

  return differences.reduce((prev, current) => (current.value !== null ? current : prev));
};
