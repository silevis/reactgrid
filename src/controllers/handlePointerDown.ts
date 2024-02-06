import React from "react";
import { HandlerFn } from "../types/Behavior.ts";
import { StoreApi } from "zustand";
import { ReactGridStore } from "../utils/reactGridStore.ts";
import { updateStoreWithApiAndEventHandler } from "../utils/updateStoreWithApiAndEventHandler.ts";

export const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, storeApi: StoreApi<ReactGridStore>) => {
  const withStoreApi = <TEvent extends React.SyntheticEvent<HTMLDivElement>>(
    event: TEvent,
    handler?: HandlerFn<TEvent>
  ) => updateStoreWithApiAndEventHandler(storeApi, event, handler);

  const store = storeApi.getState();

  const handlePointerMove = (event: PointerEvent) => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  const handlePointerUp = (event: PointerEvent) => {
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  };

  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);

  const behaviors = Object.entries(store.behaviors);

  behaviors.forEach(([_behaviorId, behavior]) => {
    withStoreApi(event, behavior.handlePointerDown);

    if (event.isPropagationStopped()) {
      return;
    }
  });

  return store;
};
