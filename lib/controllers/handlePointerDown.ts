import React from "react";
import { StoreApi } from "zustand";
import { HandlerFn } from "../types/Behavior.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { isTheSameCell } from "../utils/isTheSameCell.ts";
import { updateStoreWithApiAndEventHandler } from "../utils/updateStoreWithApiAndEventHandler.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { getPaneNameByCell } from "../utils/getPaneNameByCell.ts";
import { getCellIndexesFromPointerLocation } from "../utils/getCellIndexesFromPointerLocation.ts";
import { scrollTowardsSticky } from "../utils/scrollTowardsSticky.ts";

export const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>, storeApi: StoreApi<ReactGridStore>) => {
  const usedTouch = event.pointerType !== "mouse"; // * keep in mind there is also "pen" pointerType

  let holdTimeoutId: NodeJS.Timeout;

  const isRightClick = event.button === 2;

  if (isRightClick || usedTouch) {
    // invoke the setTimeout callback if handlePointerUp is not called within 500ms (hold event)
    holdTimeoutId = setTimeout(() => {
      const handler = usedTouch
        ? getNewestState().currentBehavior.handlePointerHoldTouch
        : getNewestState().currentBehavior.handlePointerHold;
      updateWithStoreApi(event, handler);
    }, 500);
  }

  function getNewestState() {
    return storeApi.getState();
  }

  const updateWithStoreApi = <TEvent extends React.SyntheticEvent<HTMLElement> | PointerEvent>(
    event: TEvent,
    handler?: HandlerFn<TEvent>
  ) => updateStoreWithApiAndEventHandler(storeApi, event, handler);

  const store = storeApi.getState();

  let previousCellContainer: HTMLElement | null = null;

  const { clientX, clientY } = event;
  const { rowIndex, colIndex } = getCellIndexesFromPointerLocation(clientX, clientY);
  const cell = store.getCellByIndexes(rowIndex, colIndex);

  const PreviousPane = getPaneNameByCell(store, cell);

  const handlePointerMove = (event: PointerEvent) => {
    const handler = usedTouch
      ? getNewestState().currentBehavior.handlePointerMoveTouch
      : getNewestState().currentBehavior.handlePointerMove;

    updateWithStoreApi(event, handler);

    const { clientX, clientY } = event;
    const { rowIndex, colIndex } = getCellIndexesFromPointerLocation(clientX, clientY);
    const currentDragOverCell = store.getCellByIndexes(rowIndex, colIndex);

    if (currentDragOverCell && PreviousPane === "Center")
      scrollTowardsSticky(store, currentDragOverCell, { rowIndex, colIndex });

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

    if (holdTimeoutId) clearTimeout(holdTimeoutId);

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
