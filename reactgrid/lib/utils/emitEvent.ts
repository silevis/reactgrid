import { ReactGridEventNames } from "../types/Events";

export function emitEvent(
  eventName: ReactGridEventNames,
  additionalEventProperties: object = {},
  eventInit: EventInit = { bubbles: false, cancelable: false, composed: false }
) {
  let event: Event = new Event(eventName, eventInit);
  if (additionalEventProperties) event = Object.assign(event, { reactgrid: additionalEventProperties });
  return dispatchEvent(event);
}
