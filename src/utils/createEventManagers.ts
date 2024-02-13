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
};

export function subscribeEvent(
  eventName: ReactGridEventNames,
  handler: (e: ReactGridEvent) => unknown,
  eventOptions: AddEventListenerOptions = {},
  subscriber: Element | Window = window
): void {
  subscriber.addEventListener(eventName, handler, eventOptions);
}

export function unsubscribeEvent(
  eventName: ReactGridEventNames,
  handler: (e: ReactGridEvent) => unknown,
  eventOptions: AddEventListenerOptions = {},
  subscriber: Element | Window = window
): void {
  subscriber.removeEventListener(eventName, handler, eventOptions);
}

// TODO: create CustomEvent<> ReactGridEvent, so the handlers won't be highlighted as "not assignable to parameter"