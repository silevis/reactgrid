import { PointerEvent } from './domEventsTypes';
import { getLocationFromClient } from '../Functions/getLocationFromClient';
import { AbstractPointerEventsController, isReadyToHandleEvent } from './AbstractPointerEventsController';
import { State } from './State';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
import { Behavior } from './Behavior';
import { ResizeColumnBehavior } from '../Behaviors/ResizeColumnBehavior';
import { ColumnReorderBehavior } from '../Behaviors/ColumnReorderBehavior';
import { isOnClickableArea } from '../Functions/isOnClickableArea';
import { scrollCalculator } from '../Functions/componentDidUpdate';
import { scrollIntoView } from '../Functions/scrollIntoView';
import { areLocationsEqual } from '../Functions/areLocationsEqual';


export class PointerEventsController extends AbstractPointerEventsController {
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
    // TODO use State, make generic AbstractPointerEventsController
    public handlePointerDown = (event: PointerEvent, state: State): State => {
      this.isInLeftSticky = false;
      this.isInRightSticky = false;
      this.isInTopSticky = false;
      this.isInBottomSticky = false;
      const onClickableAreaOnPro = isOnClickableArea(
        event,
        state as State
      );
      if (state.props?.onContextMenu && onClickableAreaOnPro) {
        window.addEventListener("contextmenu", this.handleContextMenu, true);
      }
      if (!onClickableAreaOnPro) {
        return {
          ...state,
          contextMenuPosition: { top: -1, left: -1 },
        } as State;
      }
      if (!isReadyToHandleEvent(event)) {
        return state;
      }
  
      window.addEventListener("pointermove", this.handlePointerMove);
      window.addEventListener("pointerup", this.handlePointerUp);
      const currentLocation = getLocationFromClient(
        state as State,
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
        } as State;
      });
    };
  
    private isContainElement = (event: PointerEvent | MouseEvent, state: State) =>
      state.reactGridElement?.contains(event.target as Element);
  
    private handleContextMenu = (event: PointerEvent | MouseEvent): void => {
      window.removeEventListener("pointerup", this.handlePointerUp);
      window.removeEventListener("pointermove", this.handlePointerMove);
      window.removeEventListener("contextmenu", this.handleContextMenu, true);
      window.addEventListener("pointerdown", this.handleHideContextMenu);
      this.updateState((state) => {
        if (this.isContainElement(event, state)) {
          const currentLocation = getLocationFromClient(
            state as State,
            event.clientX,
            event.clientY
          );
          if (currentLocation.row?.rowId === 'header') {
            return state;
          }
          state = (state.currentBehavior as Behavior).handlePointerUp(
            event,
            currentLocation,
            state
          );
          state = (state.currentBehavior as Behavior).handleContextMenu(
            event,
            state as State
          );
          state.hiddenFocusElement?.focus();
        }
        return state;
      });
    };
  
    private handlePointerMove = (event: PointerEvent): void => {
      this.updateState((state) => {
        const autoScrollDirection = (state.currentBehavior as Behavior)
          .autoScrollDirection;
        const stickyLocation = getLocationFromClient(
          state as State,
          event.clientX,
          event.clientY,
          undefined
        );
        const underStickyLocation = getLocationFromClient(
          state as State,
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
            state as State,
            currentLocation
          );
          scrollIntoView(state, top, left); // TODO Make PRO
        }
        state = (state.currentBehavior as Behavior).handlePointerMove(
          event,
          currentLocation,
          state as State
        );
        const previousLocation = this.eventLocations[this.currentIndex];
        this.eventLocations[this.currentIndex] = currentLocation;
        if (!areLocationsEqual(currentLocation, previousLocation)) {
          state = (state.currentBehavior as Behavior).handlePointerEnter(
            event,
            currentLocation,
            state as State
          );
        }
        return state;
      });
    };
  
    private handlePointerUp = (event: PointerEvent): void => {
      if (event.button !== 0 && event.button !== undefined) return;
      window.removeEventListener("pointerup", this.handlePointerUp);
      window.removeEventListener("pointermove", this.handlePointerMove);
      window.removeEventListener("contextmenu", this.handleContextMenu, true);
      this.updateState((state) => {
        const currentLocation = getLocationFromClient(
          state as State,
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
        state = { ...state, currentBehavior: new DefaultBehavior() };
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