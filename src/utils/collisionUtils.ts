export function isCollision(firstEl: HTMLElement, secondEl: HTMLElement) {
  const firstRect = firstEl.getBoundingClientRect();
  const secondRect = secondEl.getBoundingClientRect();

  if (
    firstRect.left < secondRect.right &&
    firstRect.right > secondRect.left &&
    firstRect.top < secondRect.bottom &&
    firstRect.bottom > secondRect.top
  ) {
    return true;
  } else {
    return false;
  }
}

export function detectCollision(firstEl: HTMLElement, secondEl: HTMLElement, negativeValues?: boolean) {
  const firstRect = firstEl.getBoundingClientRect();
  const secondRect = secondEl.getBoundingClientRect();

  let overlapX;
  let overlapY;

  if (negativeValues) {
    overlapX = Math.min(firstRect.right, secondRect.right) - Math.max(firstRect.left, secondRect.left);
    overlapY = Math.min(firstRect.bottom, secondRect.bottom) - Math.max(firstRect.top, secondRect.top);
  } else {
    overlapX = Math.max(
      0,
      Math.min(firstRect.right, secondRect.right) - Math.max(firstRect.left, secondRect.left)
    );
    overlapY = Math.max(
      0,
      Math.min(firstRect.bottom, secondRect.bottom) - Math.max(firstRect.top, secondRect.top)
    );
  }

  return {
    overlapX: overlapX,
    overlapY: overlapY,
  };
}