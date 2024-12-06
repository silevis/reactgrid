import { IndexedLocation } from "../types/InternalModel";

/**
 * Extracts row and column indexes from an element's class name.
 * Assumes the element's class name contains `rgFocusRowIdx-{rowIndex}` and `rgFocusColIdx-{colIndex}`.
 * @param targetElement The element from which to extract row and column indexes.
 * @returns An object containing the row and column indexes, or null if they cannot be extracted.
 */
export const getHiddenFocusTargetLocation = (storeId: string, targetElement: Element): IndexedLocation => {
  const container = document.getElementById(`ReactGrid-${storeId}`);

  if (!container || !container.contains(targetElement)) {
    return { rowIndex: -1, colIndex: -1 };
  }

  const classList = targetElement.className.split(" ");
  let rowIndex: number | null = null;
  let colIndex: number | null = null;

  classList.forEach((className) => {
    if (className.startsWith("rgFocusRowIdx-")) {
      rowIndex = parseInt(className.split("-")[1], 10);
    } else if (className.startsWith("rgFocusColIdx-")) {
      colIndex = parseInt(className.split("-")[1], 10);
    }
  });

  if (rowIndex !== null && colIndex !== null) {
    return { rowIndex, colIndex };
  }

  return { rowIndex: -1, colIndex: -1 };
};
