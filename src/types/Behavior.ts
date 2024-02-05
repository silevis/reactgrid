import React from "react";

import { ReactGridStore } from "./ReactGridStore.ts";

export type BehaviorId = "Default" | "CellSelection" | string;

export type HandlerFn<TEvent extends React.SyntheticEvent> = (event: TEvent, store: ReactGridStore) => ReactGridStore;

export type PointerEventHandler = HandlerFn<React.PointerEvent<HTMLDivElement>>;
export type TouchEventHandler = HandlerFn<React.TouchEvent<HTMLDivElement>>;
export type MouseEventHandler = HandlerFn<React.MouseEvent<HTMLDivElement>>;
export type KeyboardEventHandler = HandlerFn<React.KeyboardEvent<HTMLDivElement>>;
export type CompositionEventHandler = HandlerFn<React.CompositionEvent<HTMLDivElement>>;
export type ClipboardEventHandler = HandlerFn<React.ClipboardEvent<HTMLDivElement>>;


export type Behavior = {
  

  // TODO: change to handleMouse
  handlePointerDown?: PointerEventHandler;
  handlePointerEnter?: PointerEventHandler;
  handlePointerMove?: PointerEventHandler;
  handlePointerLeave?: PointerEventHandler;
  handlePointerUp?: PointerEventHandler;


  handleTouchStart?: TouchEventHandler;
  handleTouchMove?: TouchEventHandler;
  handleTouchEnd?: TouchEventHandler;
  handleTouchCancel?: TouchEventHandler;

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
