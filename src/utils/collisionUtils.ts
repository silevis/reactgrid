export function isCollision(firstEl: HTMLElement, secondEl: HTMLElement) {
  const firstRect = firstEl.getBoundingClientRect();
  const secondRect = secondEl.getBoundingClientRect();

  if (
    firstRect.x < secondRect.x + secondRect.width && // firstX < second_
    firstRect.x + firstRect.width > secondRect.x && // first_ > secondX
    firstRect.y < secondRect.y + secondRect.height && // firstY < second|
    firstRect.y + firstRect.height > secondRect.y // first| > secondY
  ) {
    return true;
  } else {
    return false;
  }
}

export function detectCollision(firstEl: HTMLElement, secondEl: HTMLElement) {
  const firstRect = firstEl.getBoundingClientRect();
  const secondRect = secondEl.getBoundingClientRect();

  const overlapX = Math.max(
    0,
    Math.min(firstRect.x + firstRect.width, secondRect.x + secondRect.width) - Math.max(firstRect.x, secondRect.x)
  );
  const overlapY = Math.max(
    0,
    Math.min(firstRect.y + firstRect.height, secondRect.y + secondRect.height) - Math.max(firstRect.y, secondRect.y)
  );

  return {
    overlapX: overlapX,
    overlapY: overlapY,
  };
}
