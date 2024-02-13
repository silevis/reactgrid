import { StoreApi } from "zustand";
import { HandlerFn } from "../types/Behavior";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import React from "react";

export const updateStoreWithApiAndEventHandler = <TEvent extends React.SyntheticEvent<HTMLElement> | PointerEvent>(
  storeApi: StoreApi<ReactGridStore>,
  event: TEvent,
  handler?: HandlerFn<TEvent>
) => {
  const store = storeApi.getState();

  if (handler) {
    const newStore = handler(event, store);
    storeApi.setState(newStore);

    return newStore;
  }

  return store;
};
