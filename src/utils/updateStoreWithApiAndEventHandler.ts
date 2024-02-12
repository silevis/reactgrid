import React from "react";
import { StoreApi } from "zustand";
import { HandlerFn } from "../types/Behavior";
import { ReactGridEvents } from "../types/Events.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { emitEvent } from "./emitEvent.ts";

type ChangesObservedKeys = keyof Pick<
  ReactGridStore,
  | "cells"
  | "rows"
  | "columns"
  | "styledRanges"
  | "currentBehavior"
  | "focusedLocation"
  | "selectedArea"
  | "colMeasurements"
  | "hiddenFocusTargetRef"
>;

type EventKeyPair = [ReactGridEvents, ChangesObservedKeys];

const eventsAndKey: EventKeyPair[] = [
  ["focuschange", "focusedLocation"],
  ["selectionchange", "selectedArea"],
];

const eventEmittingKeys: ChangesObservedKeys[] = ["focusedLocation", "selectedArea"];

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
  }
};

function getEventNameFromKeyName(keyName: ChangesObservedKeys): ReactGridEvents | null {
  const eventKeyPair = eventsAndKey.find(([_event, key]) => key === keyName);
  if (eventKeyPair) {
    const [event, _key] = eventKeyPair;
    return event;
  } else {
    return null;
  }
}

function findChangesInStore(oldStore: ReactGridStore, newStore: ReactGridStore, keysToCompare: ChangesObservedKeys[]) {
  const updatedKeys: { [key in ChangesObservedKeys]?: { before: unknown; after: unknown } } = {};

  keysToCompare.forEach((key: ChangesObservedKeys) => {
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

function emitEventWithChanges(updatedProperties): void {
  Object.entries(updatedProperties).forEach(([keyName, previousAndCurrentState]) => {
    const eventName = getEventNameFromKeyName(keyName as ChangesObservedKeys);
    if (!eventName) {
      return;
    } else {
      emitEvent(eventName, { [keyName]: previousAndCurrentState });
    }
  });
}
