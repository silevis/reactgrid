import { PaneName } from "../types/InternalModel";

const nonStickyPaneName: PaneName = "Center";

/**
 * Retrieves the non-sticky cell container element based on the provided coordinates.
 * @param clientX - The x-coordinate of the mouse pointer.
 * @param clientY - The y-coordinate of the mouse pointer.
 * @returns The Element representing the non-sticky cell, or undefined if not found.
 */
export const getNonStickyCellContainer = (x: number, y: number): Element | undefined => {
  const elements = document.elementsFromPoint(x, y);

  const cellContainers = elements.filter((el) => el.classList.contains("rgCellContainer"));

  const nonStickyCellContainer = cellContainers.find((container) =>
    container.closest(".rgPane")?.classList.contains(`rgPane-${nonStickyPaneName}`)
  );

  return nonStickyCellContainer;
};
