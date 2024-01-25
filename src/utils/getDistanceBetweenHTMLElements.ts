export function getOffset(element: Element): { top: number; left: number; } | null {
  const rect = element.getBoundingClientRect();
  
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollY,
  };
}

export function getDistanceBetweenOffsets(firstEl: HTMLElement, secondEl: HTMLElement) {
  const firstOffset = getOffset(firstEl);
  if (!firstOffset) return null;

  const secondOffset = getOffset(secondEl);
  if (!secondOffset) return null;
  
  return { left: secondOffset.left - firstOffset.left, top: secondOffset.top - firstOffset.top };
}

