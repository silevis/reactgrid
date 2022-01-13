import {
  AbstractPointerEventsController,
  State,
  areLocationsEqual,
  scrollIntoView,
  isReadyToHandleEvent,
} from "../../core";
import { PointerEvent } from "../Model/domEventsTypes";
import { getProLocationFromClient } from "../Functions/getProLocationFromClient";
import { ProDefaultBehavior } from "../Behaviors/ProDefaultBehavior";
import { ProBehavior } from "./ProBehavior";
import { ProState } from "./ProState";
import { scrollCalculator } from "../Functions/proComponentDidUpdate";
import { isOnClickableAreaOnPro } from "../Functions/isOnClickableArea";
import { ResizeColumnBehavior } from "../Behaviors/ResizeColumnBehavior";
import { ColumnReorderBehavior } from "../Behaviors/ColumnReorderBehavior";

export class ProPointerEventsController extends AbstractPointerEventsController {
  // private isPointerDown?: boolean;
  private isFromLeftToRightScroll?: boolean;
  private isFromRightToLeftScroll?: boolean;
  private isInLeftSticky?: boolean;
  private isInRightSticky?: boolean;
  private isFromTopToBottomScroll?: boolean;
  private isInTopSticky?: boolean;
  private isFromBottomToTopScroll?: boolean;
  private isInBottomSticky?: boolean;

  // TODO Handle PointerCancel
  // TODO use ProState, make generic AbstractPointerEventsController
  public handlePointerDown = (event: PointerEvent, state: State): State => {
    this.isInLeftSticky = false;
    this.isInRightSticky = false;
    this.isInTopSticky = false;
    this.isInBottomSticky = false;
    const onClickableAreaOnPro = isOnClickableAreaOnPro(
      event,
      state as ProState
    );
    if (state.props?.onContextMenu && onClickableAreaOnPro) {
      window.addEventListener("contextmenu", this.handleContextMenu);
    }
    if (!onClickableAreaOnPro) {
      return {
        ...state,
        contextMenuPosition: { top: -1, left: -1 },
      } as ProState;
    }
    if (!isReadyToHandleEvent(event)) {
      return state;
    }

    window.addEventListener("pointermove", this.handlePointerMove);
    window.addEventListener("pointerup", this.handlePointerUp);
    const currentLocation = getProLocationFromClient(
      state as ProState,
      event.clientX,
      event.clientY
    );
    return this.handlePointerDownInternal(event, currentLocation, state);
  };

  private handleHideContextMenu = (event: PointerEvent): void => {
    window.removeEventListener("pointerdown", this.handleHideContextMenu);
    this.updateState((state) => {
      if (event instanceof MouseEvent && this.isContainElement(event, state)) {
        return state;
      }
      return {
        ...state,
        contextMenuPosition: { top: -1, left: -1 },
      } as ProState;
    });
  };

  private isContainElement = (event: PointerEvent | MouseEvent, state: State) =>
    state.reactGridElement?.contains(event.target as Element);

  private handleContextMenu = (event: PointerEvent | MouseEvent): void => {
    window.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("contextmenu", this.handleContextMenu);
    window.addEventListener("pointerdown", this.handleHideContextMenu);
    this.updateState((state) => {
      if (this.isContainElement(event, state)) {
        const currentLocation = getProLocationFromClient(
          state as ProState,
          event.clientX,
          event.clientY
        );
        state = (state.currentBehavior as ProBehavior).handlePointerUp(
          event,
          currentLocation,
          state
        );
        state = (state.currentBehavior as ProBehavior).handleContextMenu(
          event,
          state as ProState
        );
        state.hiddenFocusElement?.focus();
      }
      return state;
    });
  };

  private handlePointerMove = (event: PointerEvent): void => {
    this.updateState((state) => {
      const autoScrollDirection = (state.currentBehavior as ProBehavior)
        .autoScrollDirection;
      const stickyLocation = getProLocationFromClient(
        state as ProState,
        event.clientX,
        event.clientY,
        undefined
      );
      const underStickyLocation = getProLocationFromClient(
        state as ProState,
        event.clientX,
        event.clientY,
        autoScrollDirection
      );
      let currentLocation = underStickyLocation;
      if (
        stickyLocation.column.idx < currentLocation.column.idx &&
        !this.isFromLeftToRightScroll &&
        !this.isInLeftSticky
      ) {
        currentLocation = stickyLocation;
      } else if (
        stickyLocation.column.idx > currentLocation.column.idx &&
        !this.isFromRightToLeftScroll &&
        !this.isInRightSticky
      ) {
        this.isFromRightToLeftScroll = false;
        currentLocation = stickyLocation;
      } else if (
        stickyLocation.row.idx < currentLocation.row.idx &&
        !this.isFromTopToBottomScroll &&
        !this.isInTopSticky
      ) {
        this.isFromTopToBottomScroll = false;
        currentLocation = stickyLocation;
      } else if (
        stickyLocation.row.idx > currentLocation.row.idx &&
        !this.isFromBottomToTopScroll &&
        !this.isInBottomSticky
      ) {
        this.isFromBottomToTopScroll = false;
        currentLocation = stickyLocation;
      } else {
        this.isInLeftSticky = true;
        this.isInRightSticky = true;
        this.isInTopSticky = true;
        this.isInBottomSticky = true;
      }
      if (
        ((event.target as HTMLDivElement).className !== "reactgrid-content" &&
          !(state.currentBehavior instanceof ResizeColumnBehavior) &&
          state.props?.enableRangeSelection) ||
        state.currentBehavior instanceof ColumnReorderBehavior
      ) {
        const { left, top } = scrollCalculator(
          state as ProState,
          currentLocation
        );
        scrollIntoView(state, top, left); // TODO Make PRO
      }
      state = (state.currentBehavior as ProBehavior).handlePointerMove(
        event,
        currentLocation,
        state as ProState
      );
      const previousLocation = this.eventLocations[this.currentIndex];
      this.eventLocations[this.currentIndex] = currentLocation;
      if (!areLocationsEqual(currentLocation, previousLocation)) {
        state = (state.currentBehavior as ProBehavior).handlePointerEnter(
          event,
          currentLocation,
          state as ProState
        );
      }
      return state;
    });
  };

  private handlePointerUp = (event: PointerEvent): void => {
    if (event.button !== 0 && event.button !== undefined) return;
    window.removeEventListener("pointerup", this.handlePointerUp);
    window.removeEventListener("pointermove", this.handlePointerMove);
    window.removeEventListener("contextmenu", this.handleContextMenu);
    this.updateState((state) => {
      const currentLocation = getProLocationFromClient(
        state as ProState,
        event.clientX,
        event.clientY
      );
      const currentTimestamp = new Date().valueOf();
      const secondLastTimestamp = this.eventTimestamps[1 - this.currentIndex];
      state = state.currentBehavior.handlePointerUp(
        event,
        currentLocation,
        state
      );
      if (
        this.shouldHandleCellSelectionOnMobile(
          event,
          currentLocation,
          currentTimestamp
        )
      ) {
        state = state.currentBehavior.handlePointerDown(
          event,
          currentLocation,
          state
        );
      }
      state = { ...state, currentBehavior: new ProDefaultBehavior() };
      if (
        this.shouldHandleDoubleClick(
          currentLocation,
          currentTimestamp,
          secondLastTimestamp
        )
      ) {
        state = state.currentBehavior.handleDoubleClick(
          event,
          currentLocation,
          state
        );
      }
      state.hiddenFocusElement?.focus();
      return state;
    });
  };
}
