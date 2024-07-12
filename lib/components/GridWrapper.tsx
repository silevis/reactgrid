import React, { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import { HandlerFn } from "../types/Behavior";
import { getStyledRangesCSS } from "../utils/getStyledRangesCSS";
import { reactGridStores, useReactGridStore } from "../utils/reactGridStore";
import { updateStoreWithApiAndEventHandler } from "../utils/updateStoreWithApiAndEventHandler";
import { handlePointerDown } from "../controllers/handlePointerDown";
import { Interpolation, Theme } from "@emotion/react";
import { css as emotionCss } from "@emotion/react";

interface GridWrapperProps {
  reactGridId: string;
  style?: React.CSSProperties;
}

const GridWrapper: FC<PropsWithChildren<GridWrapperProps>> = ({ reactGridId, style, children }) => {
  const store = reactGridStores()[reactGridId];
  const currentBehavior = useReactGridStore(reactGridId, (store) => store.currentBehavior);

  const reactGridElement = useRef<HTMLDivElement>(null);
  const assignReactGridRef = useReactGridStore(reactGridId, (store) => store.assignReactGridRef);

  const styledRanges = useReactGridStore(reactGridId, (store) => store.styledRanges);
  const [css, setCSS] = useState<Interpolation<Theme>>(emotionCss({}));

  useEffect(() => {
    if (reactGridElement.current) assignReactGridRef(reactGridElement.current);
  }, [reactGridElement]);

  const withStoreApi = <TEvent extends React.SyntheticEvent<HTMLDivElement>>(
    event: TEvent,
    handler?: HandlerFn<TEvent>
  ) => updateStoreWithApiAndEventHandler(store, event, handler);

  useEffect(() => {
    const styledRangesCSS = getStyledRangesCSS(store.getState(), styledRanges);
    if (styledRangesCSS) {
      setCSS(styledRangesCSS);
    }
  }, [styledRanges.length]); // DO NOT USE ANYTHING RELATED TO STORE IN DEPENDENCY ARRAY!

  return (
    <div
      css={css}
      id={`ReactGrid-${reactGridId}`}
      className="ReactGrid"
      ref={reactGridElement}
      style={style}
      onPointerDown={(e) => {
        handlePointerDown(e, store);
      }}
      onFocus={(e) => {
        // console.log("focus event triggered! --> ", currentBehavior?.id);
        withStoreApi(e, currentBehavior?.handleFocus);
      }}
      onKeyDown={(e) => {
        // console.log("key down event triggered! --> ", currentBehavior?.id);

        withStoreApi(e, currentBehavior?.handleKeyDown);
      }}
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
