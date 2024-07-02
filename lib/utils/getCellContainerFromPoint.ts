export const getCellContainerFromPoint = (x: number, y: number): HTMLElement | null => {
  // Use elementsFromPoint to get all elements at the specified coordinates
  const elements = document.elementsFromPoint(x, y);

  // Iterate through the elements to find the first one that is either
  // a) an rgCellContainer itself, or
  // b) can find an rgCellContainer in its ancestor chain.
  for (const element of elements) {
    const targetElement = element as HTMLElement;
    if (targetElement.classList.contains("rgCellContainer")) {
      return targetElement;
    } else if (targetElement.closest(".rgCellContainer")) {
      return targetElement.closest(".rgCellContainer") as HTMLElement;
    }
  }

  return null;
};
