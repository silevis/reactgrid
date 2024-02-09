import { ReactGridEvents } from "../types/Events";


export function createEventManagers(
  eventName: ReactGridEvents,
  handler: (e: Event) => unknown,
  eventOptions: AddEventListenerOptions = {},
  subscriber: Element | Window = window
) {
  return {
    subscribeToEvent: (): void => subscribeEvent(eventName, handler, eventOptions, subscriber),
    unsubscribeToEvent: (): void => unsubscribeEvent(eventName, handler, eventOptions, subscriber),
  };
}

export function subscribeEvent(
  eventName: ReactGridEvents,
  handler: (e: Event) => unknown,
  eventOptions: AddEventListenerOptions = {},
  subscriber: Element | Window = window
): void {
  subscriber.addEventListener(eventName, handler, eventOptions);
}

export function unsubscribeEvent(
  eventName: ReactGridEvents,
  handler: (e: Event) => unknown,
  eventOptions: AddEventListenerOptions = {},
  subscriber: Element | Window = window
): void {
  subscriber.removeEventListener(eventName, handler, eventOptions);
}