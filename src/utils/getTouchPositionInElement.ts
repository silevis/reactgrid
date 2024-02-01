export function getTouchPositionInElement(event: TouchEvent, element: Element) {
  const rect = element.getBoundingClientRect();
  const touchedElement = event.touches[0]; //  * This might be not a good idea to do it that way...

  const { clientX, clientY } = touchedElement;

  return { x: clientX - rect.left, y: clientY - rect.top };
}
