
export const getCellContainerFromPoint = (x: number, y: number): HTMLElement | null => {
  const element = document.elementFromPoint(x, y) as HTMLElement;

  if (element && element.classList.contains("rgCellContainer")) {
    return element;
  } else if (element?.closest(".rgCellContainer")) {
    return element?.closest(".rgCellContainer");
  }

  return null;
};
