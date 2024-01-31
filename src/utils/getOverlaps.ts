export function getOverlaps(
  element: { offsetTop: number; offsetLeft: number; height: number; width: number },
  container: { height: number; width: number; scrollTop: number; scrollLeft: number }
) {
  const overlapX = element.offsetLeft + element.width - container.width + container.scrollLeft;
  const overlapY = element.offsetTop + element.height - container.height + container.scrollTop;

  const NO_OVERLAP_VALUE = 0;

  const isOverlapX = overlapX > 0;
  const isOverlapY = overlapY > 0;

  return { overlapX: isOverlapX ? overlapX : NO_OVERLAP_VALUE, overlapY: isOverlapY ? overlapY : NO_OVERLAP_VALUE };
}
