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


