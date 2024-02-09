import { ReactGridEvents } from "../types/Events";

export function emitEvent(
  eventName: ReactGridEvents,
  additionalEventProperties: object = {},
  eventInit: EventInit = { bubbles: false, cancelable: false, composed: false }
) {
  let event: Event = new Event(eventName, eventInit);
  if (additionalEventProperties) event = Object.assign(event, { reactgrid: additionalEventProperties });
  return dispatchEvent(event);
}
