import { isCollision } from "./collisionUtils";

export function isElementFullyVisible(element: HTMLElement, containerElement: Element): boolean {
  const elRect = element.getBoundingClientRect();
  const isInViewport =
    elRect.top >= 0 &&
    elRect.left >= 0 &&
    elRect.bottom <= (window.innerHeight || containerElement.clientHeight) &&
    elRect.right <= (window.innerWidth || containerElement.clientWidth);

  if (!isInViewport) {
    return false;
  }

  const stickyCellPanes = [...document.getElementsByClassName("rgPane")].filter(
    (pane) => !pane.classList.contains("rgPane-Center")
  );

  const rgPaneBackgrounds = stickyCellPanes.map((pane) => {
    const rgPaneBg = [...pane.getElementsByClassName("rgPaneBackground")];
    if (rgPaneBg.length > 1) throw new Error("There should be only one rgPaneBackground for each CellPane!");
    return rgPaneBg[0];
  });

  if (rgPaneBackgrounds.some((paneBg) => isCollision(element, paneBg as HTMLDivElement))) {
    return false;
  } else {
    return true;
  }
}

/**
 * Checks if an element is fully visible within a container element.
 * Note: === This function is not working as expected === .
 *
 * @param element - The element to check for visibility.
 * @param containerElement - The container element within which to check visibility.
 * @returns A boolean indicating whether the element is fully visible.
 */

// * Old version, that was checking if element is first or the second in the array of elements returned from elementsFromPoint.
// export function isElementFullyVisible(element: Element, containerElement: Element): boolean {
//   const rect = element.getBoundingClientRect();
//   const isVisible =
//     rect.top >= 0 &&
//     rect.left >= 0 &&
//     rect.bottom <= (window.innerHeight || containerElement.clientHeight) &&
//     rect.right <= (window.innerWidth || containerElement.clientWidth);

//   if (!isVisible) {
//     return false;
//   }

//   // ! MAKE IT WORK!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//   // TODO: check if document can be replaced with containerElement
//   const elementsAtPoint = document.elementsFromPoint(rect.left, rect.top);
//   console.log(elementsAtPoint);
//   console.log(window.getComputedStyle(element));

//   if (
//     elementsAtPoint[0].contains(element) ||
//     // * case for rgHiddenFocusTarget - the element that happens to be the first element in NodeList on sticky cells.
//     (elementsAtPoint[0].classList.contains("rgHiddenFocusTarget") && elementsAtPoint[1].contains(element))
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// }
