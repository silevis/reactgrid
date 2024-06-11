import { FC } from "react";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";
import { useTheme } from "../hooks/useTheme";

export const Line: FC = () => {
  const id = useReactGridId();
  const lineOrientation = useReactGridStore(id, (store) => store.lineOrientation);
  const linePosition = useReactGridStore(id, (store) => store.linePosition);
  const reactGridRef = useReactGridStore(id, (store) => store.reactGridRef);
  const theme = useTheme();

  const isVertical = lineOrientation === "vertical";

  return (
    <div
      className={`rg-line ${isVertical ? "rg-line-vertical" : "rg-line-horizontal"}`}
      style={{
        position: "absolute",
        height: isVertical ? reactGridRef?.clientHeight : theme.line.size,
        top: isVertical ? 0 : linePosition,
        left: isVertical ? linePosition : 0,
        width: isVertical ? theme.line.size : reactGridRef?.scrollWidth,
        backgroundColor: theme.line.backgroundColor,
        pointerEvents: "none",
      }}
    ></div>
  );
};
