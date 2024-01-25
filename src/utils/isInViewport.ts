export function isInViewport(element: HTMLElement, containerElement: Element) {
  const { top, bottom, left, right } = element.getBoundingClientRect();

  const isInViewport =
    top >= 0 &&
    left >= 0 &&
    bottom <= (window.innerHeight || containerElement.clientHeight) &&
    right <= (window.innerWidth || containerElement.clientWidth);

  if (!isInViewport) {
    return false;
  } else {
    return true;
  }
}
