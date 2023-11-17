import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { useReactGridStoreApi } from "../utils/reactGridStore";
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

  useEffect(() => {
    if (!customBehaviors) {
      return setCurrentBehavior(DefaultBehavior(setCurrentBehavior));
    }

    setCurrentBehavior(customBehaviors["Default"](setCurrentBehavior));
  }, [customBehaviors]);

  return (
    <div
      id={`ReactGrid-${reactGridId}`}
      className="ReactGrid"
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
      // onPointerMove={(e) => currentBehavior?.handlePointerMove(e)}
      // onPointerUp={(e) => currentBehavior?.handlePointerUp(e)}
    >
      {children}
    </div>
  );
};

export default GridWrapper;
