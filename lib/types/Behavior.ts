import React from "react";

import { ReactGridStore } from "./ReactGridStore.ts";

export type BehaviorId = "Default" | "CellSelection" | string;

export type HandlerFn<TEvent extends React.SyntheticEvent | Event> = (
  event: TEvent,
  store: ReactGridStore
) => Partial<ReactGridStore>;

export type PointerEventHandler = HandlerFn<React.PointerEvent<HTMLDivElement> | PointerEvent>;
export type PointerHoldEventHandler = HandlerFn<React.PointerEvent<HTMLDivElement> | PointerEvent>;
export type MouseEventHandler = HandlerFn<React.MouseEvent<HTMLDivElement>>;
export type KeyboardEventHandler = HandlerFn<React.KeyboardEvent<HTMLDivElement>>;
export type FocusEventHandler = HandlerFn<React.FocusEvent<HTMLDivElement>>;
export type CompositionEventHandler = HandlerFn<React.CompositionEvent<HTMLDivElement>>;
export type ClipboardEventHandler = HandlerFn<React.ClipboardEvent<HTMLDivElement>>;

export type Behavior = {
  id: BehaviorId;

  handlePointerDown?: PointerEventHandler;
  handlePointerEnter?: PointerEventHandler;
  handlePointerMove?: PointerEventHandler;
  handlePointerLeave?: PointerEventHandler;
  handlePointerUp?: PointerEventHandler;
  handlePointerHold?: PointerHoldEventHandler;

  handlePointerDownTouch?: PointerEventHandler;
  handlePointerMoveTouch?: PointerEventHandler;
  handlePointerEnterTouch?: PointerEventHandler;
  handlePointerUpTouch?: PointerEventHandler;
  handlePointerHoldTouch?: PointerHoldEventHandler;

  handleFocus?: FocusEventHandler;

  handleDoubleClick?: MouseEventHandler;

  handleKeyDown?: KeyboardEventHandler;
  handleKeyUp?: KeyboardEventHandler;

  handleCompositionStart?: CompositionEventHandler;
  handleCompositionUpdate?: CompositionEventHandler;
  handleCompositionEnd?: CompositionEventHandler;

  handleCut?: ClipboardEventHandler;
  handleCopy?: ClipboardEventHandler;
  handlePaste?: ClipboardEventHandler;

  handleContextMenu?: MouseEventHandler;
};
