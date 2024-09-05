import { PaneName } from "../types/InternalModel";

const nonStickyPaneName: PaneName = "Center";

/**
 * Retrieves the non-sticky cell container element based on the provided coordinates.
 * @param clientX - The x-coordinate of the mouse pointer.
 * @param clientY - The y-coordinate of the mouse pointer.
 * @returns The Element representing the non-sticky cell, or undefined if not found.
 */
export const getNonStickyCellContainer = (clientX: number, clientY: number): Element | undefined => {
  const elements = document.elementsFromPoint(clientX, clientY);

  const cellContainers = elements.filter((el) => el.classList.contains("rgCellContainer"));

  return cellContainers.find((container) =>
    container.closest(".rgPane")?.classList.contains(`rgPane-${nonStickyPaneName}`)
  );
};
