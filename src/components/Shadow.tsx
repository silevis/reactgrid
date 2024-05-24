import { FC } from "react";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";
import { useTheme } from "../hooks/useTheme";

export const Shadow: FC = () => {
  const id = useReactGridId();
  const lineOrientation = useReactGridStore(id, (store) => store.lineOrientation);
  const shadowPosition = useReactGridStore(id, (store) => store.shadowPosition);
  const shadowSize = useReactGridStore(id, (store) => store.shadowSize);
  const reactGridRef = useReactGridStore(id, (store) => store.reactGridRef);
  const theme = useTheme();

  const isVertical = lineOrientation === "vertical";

  return (
    <div
      className={`rg-line ${isVertical ? "rg-shadow-vertical" : "rg-shadow-horizontal"}`}
      style={{
        position: "absolute",
        height: isVertical ? reactGridRef?.clientHeight : theme.line.size,
        top: isVertical ? 0 : shadowPosition,
        left: isVertical ? shadowPosition : reactGridRef?.getBoundingClientRect().left,
        width: isVertical ? shadowSize : 0,
        backgroundColor: "rgba(229, 229, 229, 0.69)" || theme.line.backgroundColor,
        pointerEvents: "none",
      }}
    ></div>
  );
};
