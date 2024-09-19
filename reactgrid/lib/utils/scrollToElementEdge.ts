import { Position } from "../types/InternalModel";

export function scrollToElementEdge(relativePosition: Position, scrollableElement: HTMLElement, threshold = 0.1) {
  if (threshold <= 0) throw new Error("Scrolling threshold has to be bigger than 0.");

  const scrollableElementDimensions = scrollableElement.getBoundingClientRect();

  const touchPositionInContainer = {
    x: relativePosition.x - scrollableElementDimensions.left,
    y: relativePosition.y - scrollableElementDimensions.top,
  };

  const scrollActivationThreshold = {
    vertical: {
      min: scrollableElementDimensions.height * threshold,
      max: scrollableElementDimensions.height - scrollableElementDimensions.height * threshold,
    },
    horizontal: {
      min: scrollableElementDimensions.width * threshold,
      max: scrollableElementDimensions.width - scrollableElementDimensions.width * threshold,
    },
  };

  const topEdgeTouched = touchPositionInContainer.y < scrollActivationThreshold.vertical.min;
  const bottomEdgeTouched = touchPositionInContainer.y > scrollActivationThreshold.vertical.max;
  const leftEdgeTouched = touchPositionInContainer.x < scrollActivationThreshold.horizontal.min;
  const rightEdgeTouched = touchPositionInContainer.x > scrollActivationThreshold.horizontal.max;

  if (topEdgeTouched) {
    scrollableElement.scrollBy({ top: -1 * scrollableElementDimensions.height * threshold });
  } else if (bottomEdgeTouched) {
    scrollableElement.scrollBy({ top: scrollableElementDimensions.height * threshold });
  }

  if (leftEdgeTouched) {
    scrollableElement.scrollBy({ left: -1 * scrollableElementDimensions.width * threshold });
  } else if (rightEdgeTouched) {
    scrollableElement.scrollBy({ left: scrollableElementDimensions.width * threshold });
  }
}
