export function getOffset(element: Element): { top: number; left: number; } | null {
  if (!element.getClientRects().length) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  const win = element.ownerDocument.defaultView;
  if (!win) return null;
  return {
    top: rect.top + win?.scrollY,
    left: rect.left + win?.scrollY,
  };
}
export function getDistanceBetweenOffsets(firstEl: HTMLElement, secondEl: HTMLElement) {
  const firstOffset = getOffset(firstEl);
  if (!firstOffset) return null;

  const secondOffset = getOffset(secondEl);
  if (!secondOffset) return null;
  return { left: secondOffset.left - firstOffset.left, top: secondOffset.top - firstOffset.top };
}

// export function getDistanceBetweenHTMLElements(firstEl: HTMLElement, secondEl: HTMLElement) {
//       const firstRect = firstEl.getBoundingClientRect();
//   const secondRect = secondEl.getBoundingClientRect();
  
//     firstRect.x < secondRect.x + secondRect.width && // firstX < second_
//     firstRect.x + firstRect.width > secondRect.x && // first_ > secondX
//     firstRect.y < secondRect.y + secondRect.height && // firstY < second|
//     firstRect.y + firstRect.height > secondRect.y // first| > secondY



// }

