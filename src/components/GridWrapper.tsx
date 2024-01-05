import React, { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import { Behavior } from "../types/Behavior";
import { useReactGridStore, useReactGridStoreApi } from "../utils/reactGridStore";

interface GridWrapperProps {
  reactGridId: string;
  style?: React.CSSProperties;
}

const GridWrapper: FC<PropsWithChildren<GridWrapperProps>> = ({ reactGridId, style, children }) => {
  const storeApi = useReactGridStoreApi(reactGridId);
  const DefaultBehavior = useReactGridStore(reactGridId, (store) => store.behaviors.Default);
  const [currentBehavior, setCurrentBehavior] = useState<Behavior>(DefaultBehavior);

  const reactGridElement = useRef<HTMLDivElement>(null);
  const assignReactGridRef = useReactGridStore(reactGridId, (store) => store.assignReactGridRef);

  useEffect(() => {
    if (reactGridElement.current) assignReactGridRef(reactGridElement.current);
  }, [reactGridElement]);

  const handlePointerDown = currentBehavior?.handlePointerDown || ((_, store) => store);
  const handlePointerEnter = currentBehavior?.handlePointerEnter || ((_, store) => store);
  const handlePointerMove = currentBehavior?.handlePointerMove || ((_, store) => store);
  const handlePointerLeave = currentBehavior?.handlePointerLeave || ((_, store) => store);
  const handlePointerUp = currentBehavior?.handlePointerUp || ((_, store) => store);

  const handleDoubleClick = currentBehavior?.handleDoubleClick || ((_, store) => store);

  const handleKeyDown = currentBehavior?.handleKeyDown || ((_, store) => store);
  const handleKeyUp = currentBehavior?.handleKeyUp || ((_, store) => store);

  const handleCompositionStart = currentBehavior?.handleCompositionStart || ((_, store) => store);
  const handleCompositionUpdate = currentBehavior?.handleCompositionUpdate || ((_, store) => store);
  const handleCompositionEnd = currentBehavior?.handleCompositionEnd || ((_, store) => store);

  const handleCut = currentBehavior?.handleCut || ((_, store) => store);
  const handleCopy = currentBehavior?.handleCopy || ((_, store) => store);
  const handlePaste = currentBehavior?.handlePaste || ((_, store) => store);

  const handleContextMenu = currentBehavior?.handleContextMenu || ((_, store) => store);

  return (
    <div
      id={`ReactGrid-${reactGridId}`}
      className="ReactGrid"
      ref={reactGridElement}
      style={style}
      onPointerDown={(e) => storeApi.setState(handlePointerDown(e, storeApi.getState(), setCurrentBehavior))}
      onPointerEnter={(e) => storeApi.setState(handlePointerEnter(e, storeApi.getState(), setCurrentBehavior))}
      onPointerMove={(e) => storeApi.setState(handlePointerMove(e, storeApi.getState(), setCurrentBehavior))}
      onPointerLeave={(e) => storeApi.setState(handlePointerLeave(e, storeApi.getState(), setCurrentBehavior))}
      onPointerUp={(e) => storeApi.setState(handlePointerUp(e, storeApi.getState(), setCurrentBehavior))}
      onDoubleClick={(e) => storeApi.setState(handleDoubleClick(e, storeApi.getState(), setCurrentBehavior))}
      onKeyDown={(e) => storeApi.setState(handleKeyDown(e, storeApi.getState(), setCurrentBehavior))}
      onKeyUp={(e) => storeApi.setState(handleKeyUp(e, storeApi.getState(), setCurrentBehavior))}
      onCompositionStart={(e) => storeApi.setState(handleCompositionStart(e, storeApi.getState(), setCurrentBehavior))}
      onCompositionUpdate={(e) => storeApi.setState(handleCompositionUpdate(e, storeApi.getState(), setCurrentBehavior))}
      onCompositionEnd={(e) => storeApi.setState(handleCompositionEnd(e, storeApi.getState(), setCurrentBehavior))}
      onCut={(e) => storeApi.setState(handleCut(e, storeApi.getState(), setCurrentBehavior))}
      onCopy={(e) => storeApi.setState(handleCopy(e, storeApi.getState(), setCurrentBehavior))}
      onPaste={(e) => storeApi.setState(handlePaste(e, storeApi.getState(), setCurrentBehavior))}
      onContextMenu={(e) => storeApi.setState(handleContextMenu(e, storeApi.getState(), setCurrentBehavior))}
    >
      {children}
    </div>
  );
};

export default GridWrapper;
