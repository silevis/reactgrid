import React, { FC, PropsWithChildren, useEffect, useRef } from "react";
import { HandlerFn } from "../types/Behavior";
import { useReactGridStore, useReactGridStoreApi } from "../utils/reactGridStore";
import { updateStoreWithApiAndEventHandler } from "../utils/updateStoreWithApiAndEventHandler";
import { StyledRangesCSS } from "../types/PublicModel";

interface GridWrapperProps {
  reactGridId: string;
  style?: React.CSSProperties;
  styledRangesCSS: StyledRangesCSS;
}

const GridWrapper: FC<PropsWithChildren<GridWrapperProps>> = ({
  reactGridId,
  customBehaviors,
  style,
  children,
  styledRangesCSS,
}) => {
  const storeApi = useReactGridStoreApi(reactGridId);
  const currentBehavior = useReactGridStore(reactGridId, (store) => store.currentBehavior);

  const reactGridElement = useRef<HTMLDivElement>(null);
  const assignReactGridRef = useReactGridStore(reactGridId, (store) => store.assignReactGridRef);

  // ? Type-fix for Emotion.js.
  const styledRangesCSSAcceptableForEmotion = Object.assign({}, ...styledRangesCSS);

  useEffect(() => {
    if (reactGridElement.current) assignReactGridRef(reactGridElement.current);
  }, [reactGridElement]);

  const withStoreApi = <TEvent extends React.SyntheticEvent<HTMLDivElement>>(
    event: TEvent,
    handler?: HandlerFn<TEvent>
  ) => updateStoreWithApiAndEventHandler(storeApi, event, handler);

  return (
    <div
      css={styledRangesCSSAcceptableForEmotion}
      id={`ReactGrid-${reactGridId}`}
      className="ReactGrid"
      ref={reactGridElement}
      style={style}
      onPointerDown={(e) => withStoreApi(e, currentBehavior?.handlePointerDown)}
      onPointerEnter={(e) => withStoreApi(e, currentBehavior?.handlePointerEnter)}
      onPointerMove={(e) => withStoreApi(e, currentBehavior?.handlePointerMove)}
      onPointerLeave={(e) => withStoreApi(e, currentBehavior?.handlePointerLeave)}
      onPointerUp={(e) => withStoreApi(e, currentBehavior?.handlePointerUp)}
      onDoubleClick={(e) => withStoreApi(e, currentBehavior?.handleDoubleClick)}
      onKeyDown={(e) => withStoreApi(e, currentBehavior?.handleKeyDown)}
      onKeyUp={(e) => withStoreApi(e, currentBehavior?.handleKeyUp)}
      onCompositionStart={(e) => withStoreApi(e, currentBehavior?.handleCompositionStart)}
      onCompositionUpdate={(e) => withStoreApi(e, currentBehavior?.handleCompositionUpdate)}
      onCompositionEnd={(e) => withStoreApi(e, currentBehavior?.handleCompositionEnd)}
      onCut={(e) => withStoreApi(e, currentBehavior?.handleCut)}
      onCopy={(e) => withStoreApi(e, currentBehavior?.handleCopy)}
      onPaste={(e) => withStoreApi(e, currentBehavior?.handlePaste)}
      onContextMenu={(e) => withStoreApi(e, currentBehavior?.handleContextMenu)}
    >
      {children}
    </div>
  );
};

export default GridWrapper;
