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

  function detectHold(event: React.PointerEvent<HTMLDivElement>, usedTouch: boolean) {
    return new Promise((resolve) => {
      let startTime: number = 0;
      let isCheckingHold: boolean = false;
      let intervalId: NodeJS.Timeout;

      function handleHold() {
        console.log("Hold detected");
        isCheckingHold = false;
      }

      function checkHoldDuration() {
        if (!isCheckingHold) return;
        if (Date.now() - startTime >= 500) {
          handleHold();
          clearInterval(intervalId);
        }
      }

      function pointerDownHandler(e: React.PointerEvent<HTMLDivElement>) {
        if ((e.button === 2 || usedTouch) && !isCheckingHold) {
          // right mouse button or touch
          startTime = Date.now();
          isCheckingHold = true;
          intervalId = setInterval(checkHoldDuration, 50); // check every 50ms
          window.addEventListener("pointerup", pointerUpHandler);
        }
      }

      function pointerUpHandler(e: PointerEvent) {
        if (e.button === 2 || usedTouch) {
          isCheckingHold = false;
          clearInterval(intervalId);
          window.removeEventListener("pointerup", pointerUpHandler);
          if (Date.now() - startTime >= 200) {
            resolve(true); // resolve if the button was held down for 200ms or more
          }
        }
      }

      pointerDownHandler(event);
    });
  }

  detectHold(event, usedTouch).then(() => {
    console.log("Hold action completed");
  });

  // Remove listeners after pointerDown
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);

  const handler = usedTouch ? store.currentBehavior.handlePointerDownTouch : store.currentBehavior.handlePointerDown;

  updateWithStoreApi(event, handler);
};
