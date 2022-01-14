import {
  PointerLocation,
  Location,
  handleKeyUp,
  handleDoubleClick,
  getScrollOfScrollableElement,
  isSelectionKey,
} from "../../core";
import {
  KeyboardEvent,
  ClipboardEvent,
  PointerEvent,
} from "../Model/domEventsTypes";
import { ProCellSelectionBehavior } from "./CellSelectionBehavior";
import { Behavior } from "../Model/Behavior";
import { proHandleKeyDown } from "../Functions/proHandleKeyDown";
import { State } from "../Model/State";
import { ColumnSelectionBehavior } from "./ColumnSelectionBehavior";
import { RowSelectionBehavior } from "./RowSelectionBehavior";
import { FillHandleBehavior } from "./FillHandleBehavior";
import { handleContextMenu } from "../Functions/handleContextMenu";
import { ResizeColumnBehavior } from "./ResizeColumnBehavior";
import { ColumnReorderBehavior } from "./ColumnReorderBehavior";
import { RowReorderBehavior } from "./RowReorderBehavior";
import { proHandleCopy } from "../Functions/proHandleCopy";
import { proHandlePaste } from "../Functions/proHandlePaste";

export class ProDefaultBehavior extends Behavior {
  handlePointerDown(
    event: PointerEvent,
    location: PointerLocation,
    state: State
  ): State {
    state = {
      ...state,
      currentBehavior: this.getNewBehavior(event, location, state),
      contextMenuPosition: { top: -1, left: -1 },
    };
    return state.currentBehavior.handlePointerDown(
      event,
      location,
      state
    ) as State;
  }

  private getNewBehavior(
    event: PointerEvent,
    location: PointerLocation,
    state: State
  ): Behavior {
    // changing behavior will disable all keyboard event handlers
    const target = event.target as HTMLDivElement;
    if (
      ((event.pointerType === "mouse" &&
        target.className === "rg-resize-handle") ||
        (event.pointerType === "touch" &&
          (target.className === "rg-touch-resize-handle" ||
            target.className === "rg-resize-handle"))) &&
      location.row.idx === 0 &&
      location.column.resizable &&
      location.cellX >
        location.column.width -
          (state.reactGridElement?.querySelector(".rg-resize-handle")
            ?.clientWidth || 0) -
          getScrollOfScrollableElement(state.scrollableElement).scrollLeft
    ) {
      return new ResizeColumnBehavior();
    } else if (
      state.enableColumnSelection &&
      location.row.idx === 0 &&
      state.selectedIds.includes(location.column.columnId) &&
      !isSelectionKey(event) &&
      state.selectionMode === "column" &&
      location.column.reorderable
    ) {
      return new ColumnReorderBehavior();
    } else if (
      state.enableColumnSelection &&
      location.row.idx === 0 &&
      target.className !== "rg-fill-handle" &&
      target.className !== "rg-touch-fill-handle"
    ) {
      return new ColumnSelectionBehavior();
    } else if (
      state.enableRowSelection &&
      location.column.idx === 0 &&
      state.selectedIds.includes(location.row.rowId) &&
      !isSelectionKey(event) &&
      state.selectionMode === "row" &&
      location.row.reorderable
    ) {
      return new RowReorderBehavior();
    } else if (
      state.enableRowSelection &&
      location.column.idx === 0 &&
      target.className !== "rg-fill-handle" &&
      target.className !== "rg-touch-fill-handle"
    ) {
      return new RowSelectionBehavior();
    } else if (
      ((event.pointerType === "mouse" &&
        target.className === "rg-fill-handle") ||
        (event.pointerType === "touch" &&
          (target.className === "rg-touch-fill-handle" ||
            target.className === "rg-fill-handle"))) &&
      state.enableFillHandle
    ) {
      return new FillHandleBehavior();
    } else {
      return new ProCellSelectionBehavior();
    }
  }

  handleContextMenu(event: PointerEvent, state: State): State {
    return handleContextMenu(event, state);
  }

  handleDoubleClick(
    event: PointerEvent,
    location: Location,
    state: State
  ): State {
    return handleDoubleClick(event, location, state) as State;
  }

  handleKeyDown(event: KeyboardEvent, state: State): State {
    return proHandleKeyDown(state as State, event);
  }

  handleKeyUp(event: KeyboardEvent, state: State): State {
    return handleKeyUp(event, state) as State;
  }

  handleCopy(event: ClipboardEvent, state: State): State {
    return proHandleCopy(event, state);
  }

  handlePaste(event: ClipboardEvent, state: State): State {
    return proHandlePaste(event, state);
  }

  handleCut(event: ClipboardEvent, state: State): State {
    return proHandleCopy(event, state, true);
  }
}
