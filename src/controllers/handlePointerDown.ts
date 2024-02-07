import React from "react";
import { StoreApi } from "zustand";
import { HandlerFn } from "../types/Behavior.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { isTheSameCell } from "../utils/isTheSameCell.ts";
import { updateStoreWithApiAndEventHandler } from "../utils/updateStoreWithApiAndEventHandler.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";

export const handlePointerDown = (
  pointerDownEvent: React.PointerEvent<HTMLDivElement>,
  storeApi: StoreApi<ReactGridStore>
) => {
  function getNewestState() {
    return storeApi.getState();
  }

  const updateWithStoreApi = <TEvent extends React.SyntheticEvent<HTMLElement> | PointerEvent>(
    event: TEvent,
    handler?: HandlerFn<TEvent>
  ) => updateStoreWithApiAndEventHandler(storeApi, event, handler);

  const store = storeApi.getState();

  let previousCellContainer: HTMLElement | null = null;

  const handlePointerMove = (pointerMoveEvent: PointerEvent) => {
    updateWithStoreApi(pointerMoveEvent, getNewestState().currentBehavior.handlePointerMove);

    const hoveredCellContainer = getCellContainerFromPoint(pointerMoveEvent.clientX, pointerMoveEvent.clientY);

    if (hoveredCellContainer) {
      if (previousCellContainer && !isTheSameCell(hoveredCellContainer, previousCellContainer)) {
        handlePointerEnter(pointerMoveEvent);
      }
      previousCellContainer = hoveredCellContainer;
    }
  };

  const handlePointerEnter = (pointerEnterEvent: PointerEvent) => {
    updateWithStoreApi(pointerEnterEvent, getNewestState().currentBehavior.handlePointerEnter);
  };

  const handlePointerUp = (pointerUpEvent: PointerEvent) => {
    // Remove listeners after pointerUp
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    updateWithStoreApi(pointerUpEvent, getNewestState().currentBehavior.handlePointerUp);
  };

  // Remove listeners after pointerDown
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);

  updateWithStoreApi(pointerDownEvent, store.currentBehavior.handlePointerDown);
};
