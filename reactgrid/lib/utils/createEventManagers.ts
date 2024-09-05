import { ReactGridEvent, ReactGridEventNames } from "../types/Events";

export function createEventManagers(
  eventName: ReactGridEventNames,
  handler: (e: ReactGridEvent) => unknown,
  eventOptions: AddEventListenerOptions = {},
  subscriber: Element | Window = window
) {
  return {
    subscribeToEvent: (): void => subscribeEvent(eventName, handler, eventOptions, subscriber),
    unsubscribeToEvent: (): void => unsubscribeEvent(eventName, handler, eventOptions, subscriber),
  };
}

export function subscribeEvent(
  eventName: ReactGridEventNames,
  handler: (e: ReactGridEvent) => unknown,
  eventOptions: AddEventListenerOptions = {},
  subscriber: Element | Window = window
): void {
  // Wrap the handler to conform to EventListener
  const wrappedHandler = (event: Event) => {
    if (isReactGridEvent(event)) {
      handler(event);
    }
  };
  subscriber.addEventListener(eventName, wrappedHandler as EventListener, eventOptions);
}

export function unsubscribeEvent(
  eventName: ReactGridEventNames,
  handler: (e: ReactGridEvent) => unknown,
  eventOptions: AddEventListenerOptions = {},
  subscriber: Element | Window = window
): void {
  // Wrap the handler to conform to EventListener
  const wrappedHandler = (event: Event) => {
    if (isReactGridEvent(event)) {
      handler(event);
    }
  };
  subscriber.removeEventListener(eventName, wrappedHandler as EventListener, eventOptions);
}

// Helper type guard to check if the event is a ReactGridEvent
function isReactGridEvent(event: Event): event is ReactGridEvent {
  return "reactgrid" in event;
}
