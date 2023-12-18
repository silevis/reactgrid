import React from "react";
import { ReactGridStore } from "../utils/reactGridStore";

export type BehaviorId = "Default" | "CellSelection" | string;

export interface Behavior {
  readonly id: BehaviorId;

  handlePointerDown: (event: React.PointerEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
  handlePointerEnter: (event: React.PointerEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
  handlePointerMove: (event: React.PointerEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
  handlePointerLeave: (event: React.PointerEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
  handlePointerUp: (event: React.PointerEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;

  handleDoubleClick: (event: React.MouseEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;

  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
  handleKeyDownCapture: (event: React.KeyboardEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
  handleKeyUp: (event: React.KeyboardEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;

  handleCompositionStart: (event: React.CompositionEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
  handleCompositionUpdate: (event: React.CompositionEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
  handleCompositionEnd: (event: React.CompositionEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;

  handleCut: (event: React.ClipboardEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
  handleCopy: (event: React.ClipboardEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
  handlePaste: (event: React.ClipboardEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;

  handleContextMenu: (event: React.MouseEvent<HTMLDivElement>, store: ReactGridStore) => ReactGridStore;
}

export type BehaviorConstructor = (setCurrentBehavior: (behavior: Behavior) => void) => Behavior;
