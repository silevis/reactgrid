import React from "react";
import { HandlerFn } from "../types/Behavior.ts";
import { StoreApi } from "zustand";
import { ReactGridStore } from "../utils/reactGridStore.ts";
import { updateStoreWithApiAndEventHandler } from "../utils/updateStoreWithApiAndEventHandler.ts";

export const handlePointerDown = (pointerDownEvent: React.PointerEvent<HTMLDivElement>, storeApi: StoreApi<ReactGridStore>) => {
  const withStoreApi = <TEvent extends React.SyntheticEvent<HTMLDivElement>>(
    event: TEvent,
    handler?: HandlerFn<TEvent>
  ) => updateStoreWithApiAndEventHandler(storeApi, event, handler);

  const store = storeApi.getState();

  const handlePointerMove = (pointerMoveEvent: PointerEvent) => {};

  const handlePointerUp = (pointerUpEvent: PointerEvent) => {
    // Remove listeners after pointerUp
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  // Remove listeners after pointerDown
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);

  // With specified order behavior in mind, handlePointerDown on each behavior.
  const behaviors = Object.entries(store.behaviors);
  behaviors.forEach(([_behaviorId, behavior]) => {
    withStoreApi(pointerDownEvent, behavior.handlePointerDown);

    if (pointerDownEvent.isPropagationStopped()) {
      return;
    }
  });

  return store;
};
