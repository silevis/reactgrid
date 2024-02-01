const preventAll = function (e: TouchEvent) {
  if (e.cancelable) {
    e.preventDefault();
    e.stopPropagation();
  }
};

export function disableTouchMove(element: HTMLElement) {
  element.addEventListener("touchmove", preventAll, { passive: false });
}

export function enableTouchMove(element: HTMLElement) {
  element.removeEventListener("touchmove", preventAll);
}

export function disableTouchAction(element: HTMLElement) {
  element.style.touchAction = "none";
}

export function enableTouchAction(element: HTMLElement) {
  element.style.touchAction = "initial";
}
