export function isInViewport(element: HTMLElement, containerElement: Element) {
  const { top, bottom, left, right } = element.getBoundingClientRect();

  return top >= 0 &&
    left >= 0 &&
    bottom <= (window.innerHeight || containerElement.clientHeight) &&
    right <= (window.innerWidth || containerElement.clientWidth);
}
