import React from "react";
import { StoreApi } from "zustand";
import { HandlerFn } from "../types/Behavior";
import { ReactGridEventNames } from "../types/Events.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { emitEvent } from "./emitEvent.ts";
import { EventKeyPair, ChangeObservedKeys, RegisteredChanges } from "../types/Events.ts";

const eventsAndKey: EventKeyPair[] = [
  ["focuschange", "focusedLocation"],
  ["selectionchange", "selectedArea"],
];

const eventEmittingKeys: ChangeObservedKeys[] = ["focusedLocation", "selectedArea"];

export const updateStoreWithApiAndEventHandler = <TEvent extends React.SyntheticEvent<HTMLElement> | PointerEvent>(
  storeApi: StoreApi<ReactGridStore>,
  event: TEvent,
  handler?: HandlerFn<TEvent>
) => {
  const store = storeApi.getState();

  if (handler) {
    const newStore = handler(event, store);

    const updatedProperties = findChangesInStore(store, newStore, eventEmittingKeys);
    emitEventWithChanges(updatedProperties);

    // Save changes to store
    storeApi.setState(newStore);

    return newStore;
  }
};

function getEventNameFromKeyName(keyName: ChangeObservedKeys): ReactGridEventNames | null {
  const eventKeyPair = eventsAndKey.find(([_event, key]) => key === keyName);
  if (eventKeyPair) {
    const [event, _key] = eventKeyPair;
    return event;
  } else {
    return null;
  }
}

function findChangesInStore(oldStore: ReactGridStore, newStore: ReactGridStore, keysToCompare: ChangeObservedKeys[]) {
  const updatedKeys: RegisteredChanges = {};

  keysToCompare.forEach((key: ChangeObservedKeys) => {
    const oldValue = oldStore[key];
    const newValue = newStore[key];

    if (arePropertiesDifferent(oldValue, newValue)) {
      updatedKeys[key] = { after: newValue, before: oldValue };
    }
  });

  return updatedKeys;
}

function arePropertiesDifferent(oldObject: unknown, newObject: unknown): boolean {
  return JSON.stringify(oldObject) !== JSON.stringify(newObject);
}

function emitEventWithChanges(updatedProperties: RegisteredChanges): void {
  Object.entries(updatedProperties).forEach(([keyName, previousAndCurrentState]) => {
    const eventName = getEventNameFromKeyName(keyName as ChangeObservedKeys);
    if (!eventName) {
      return;
    } else {
      emitEvent(eventName, { [keyName]: previousAndCurrentState });
    }
  });
}
