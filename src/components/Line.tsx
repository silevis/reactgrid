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
        position: "fixed",
        height: isVertical ? reactGridRef?.clientHeight : theme.resizeColumn.default.height,
        top: isVertical ? reactGridRef?.getBoundingClientRect().top : linePosition,
        left: isVertical ? linePosition : reactGridRef?.getBoundingClientRect().left,
        width: isVertical ? theme.resizeColumn.line.width : reactGridRef?.clientWidth,
        backgroundColor: theme.resizeColumn.line.backgroundColor,
        pointerEvents: "none",
      }}
    ></div>
  );
};
