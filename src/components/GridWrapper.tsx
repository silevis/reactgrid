import React, { FC, PropsWithChildren, useEffect, useRef, useState } from "react";
import { useReactGridStore, useReactGridStoreApi } from "../utils/reactGridStore";
import { Behavior, BehaviorConstructor } from "../types/Behavior";
import { DefaultBehavior } from "../behaviors/DefaultBehavior";

interface GridWrapperProps {
  reactGridId: string;
  customBehaviors?: Record<string, BehaviorConstructor>;
  style?: React.CSSProperties;
}

const GridWrapper: FC<PropsWithChildren<GridWrapperProps>> = ({ reactGridId, customBehaviors, style, children }) => {
  const storeApi = useReactGridStoreApi(reactGridId);
  const [currentBehavior, setCurrentBehavior] = useState<Behavior>();

  const reactGridElement = useRef<HTMLDivElement>(null);
  const assignReactGridRef = useReactGridStore(reactGridId, store => store.assignReactGridRef);

  useEffect(() => {
    if (!customBehaviors) {
      return setCurrentBehavior(DefaultBehavior(setCurrentBehavior));
    }

    setCurrentBehavior(customBehaviors["Default"](setCurrentBehavior));
  }, [customBehaviors]);

  useEffect(() => {
    if (reactGridElement.current) assignReactGridRef(reactGridElement.current);
  }, [reactGridElement.current]);

  return (
    <div
      id={`ReactGrid-${reactGridId}`}
      className="ReactGrid"
      ref={reactGridElement}
      style={style}
      onPointerDown={(e) =>
        storeApi.setState(
          (currentBehavior ?? DefaultBehavior(setCurrentBehavior)).handlePointerDown(e, storeApi.getState())
        )
      }
      onPointerMove={(e) =>
        storeApi.setState(
          (currentBehavior ?? DefaultBehavior(setCurrentBehavior)).handlePointerMove(e, storeApi.getState())
        )
      }
      onPointerUp={(e) =>
        storeApi.setState(
          (currentBehavior ?? DefaultBehavior(setCurrentBehavior)).handlePointerUp(e, storeApi.getState())
        )
      }
      onKeyDown={e => 
        storeApi.setState(
          (currentBehavior ?? DefaultBehavior(setCurrentBehavior)).handleKeyDown(e, storeApi.getState())
        )
      }
      onKeyDownCapture={e => 
        storeApi.setState(
          (currentBehavior ?? DefaultBehavior(setCurrentBehavior)).handleKeyDownCapture(e, storeApi.getState())
        )
      }
      // onPointerMove={(e) => currentBehavior?.handlePointerMove(e)}
      // onPointerUp={(e) => currentBehavior?.handlePointerUp(e)}
    >
      {children}
    </div>
  );
};

export default GridWrapper;
