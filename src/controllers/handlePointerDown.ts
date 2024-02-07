import React from "react";
import { StoreApi } from "zustand";
import { HandlerFn } from "../types/Behavior.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { isTheSameCell } from "../utils/isTheSameCell.ts";
import { updateStoreWithApiAndEventHandler } from "../utils/updateStoreWithApiAndEventHandler.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";

export const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, storeApi: StoreApi<ReactGridStore>) => {
  function getNewestState() {
    return storeApi.getState();
  }

  const usedTouch = event.pointerType !== "mouse"; // * keep in mind there is also "pen" pointerType

  const updateWithStoreApi = <TEvent extends React.SyntheticEvent<HTMLElement> | PointerEvent>(
    event: TEvent,
    handler?: HandlerFn<TEvent>
  ) => updateStoreWithApiAndEventHandler(storeApi, event, handler);

  const store = storeApi.getState();

  let previousCellContainer: HTMLElement | null = null;

  const handlePointerMove = (event: PointerEvent) => {
    const handler = usedTouch
      ? getNewestState().currentBehavior.handlePointerMoveTouch
      : getNewestState().currentBehavior.handlePointerMove;

    updateWithStoreApi(event, handler);

    const hoveredCellContainer = getCellContainerFromPoint(event.clientX, event.clientY);

    if (hoveredCellContainer) {
      if (previousCellContainer && !isTheSameCell(hoveredCellContainer, previousCellContainer)) {
        handlePointerEnter(event);
      }
      previousCellContainer = hoveredCellContainer;
    }
  };

  const handlePointerEnter = (event: PointerEvent) => {
    const handler = usedTouch
      ? getNewestState().currentBehavior.handlePointerEnterTouch
      : getNewestState().currentBehavior.handlePointerEnter;

    updateWithStoreApi(event, handler);
  };

  const handlePointerUp = (event: PointerEvent) => {
    // Remove listeners after pointerUp
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);

    const handler = usedTouch
      ? getNewestState().currentBehavior.handlePointerUpTouch
      : getNewestState().currentBehavior.handlePointerUp;

    updateWithStoreApi(event, handler);
  };

  // Remove listeners after pointerDown
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);

  const handler = usedTouch ? store.currentBehavior.handlePointerDownTouch : store.currentBehavior.handlePointerDown;

  updateWithStoreApi(event, handler);
};
