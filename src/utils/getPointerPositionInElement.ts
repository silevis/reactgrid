export function getPointerPositionInElement(event: PointerEvent, element: Element) {
  const rect = element.getBoundingClientRect();
  const { clientX, clientY } = event;

  return { x: clientX - rect.left, y: clientY - rect.top };
}


