import React, { FC } from "react";
import { useCellContext } from "./CellContext";
import HiddenFocusTarget from "./HiddenFocusTarget";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";
import { useTheme } from "../hooks/useTheme";
import { ResizeColumnBehavior } from "../behaviors/ResizeColumnBehavior";

type CellWrapperProps = React.ClassAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLDivElement> & {
    targetInputRef?: React.RefObject<HTMLInputElement | HTMLElement>;
    children: React.ReactNode;
  };

const CellWrapper: FC<CellWrapperProps> = ({ children, targetInputRef, ...wrapperDivAttributes }) => {
  const { className: customClassName, style: customStyle } = wrapperDivAttributes;
  const ctx = useCellContext();
  const theme = useTheme();

  const id = useReactGridId();

  const resizingColId = useReactGridStore(id, (store) => store.resizingColId);
  const columns = useReactGridStore(id, (store) => store.columns);

  const onResizeColumn = useReactGridStore(id, (store) => store.onResizeColumn);
  const setCurrentBehavior = useReactGridStore(id, (store) => store.setCurrentBehavior);
  const setResizingColId = useReactGridStore(id, (store) => store.setResizingColId);

  let shouldEnableColumnResize;

  if (ctx.realRowIndex === 0) {
    const cellColumn = columns.find((col) => col.id === ctx.colId);

    (shouldEnableColumnResize = resizingColId === undefined || resizingColId === ctx.colId) &&
      onResizeColumn &&
      cellColumn?.resizable;
  }

  return (
    <div
      {...wrapperDivAttributes}
      className={`rgCellContainer rgRowIdx-${ctx.realRowIndex} rgColIdx-${ctx.realColumnIndex} ${
        customClassName ?? ""
      }`}
      style={{
        padding: ".2rem",
        textAlign: "center",
        position: "relative",
        touchAction: "none",
        ...customStyle,
        ...ctx.containerStyle,
      }}
    >
      {shouldEnableColumnResize && (
        <div
          className="rg-resize-column"
          onPointerDown={() => {
            setResizingColId(ctx.colId);
            setCurrentBehavior(ResizeColumnBehavior);
          }}
          css={{
            cursor: "col-resize",
            ...theme.resizeColumn.default,
            "&:hover": {
              ...theme.resizeColumn.hover,
            },
          }}
        />
      )}
      {children}
      {ctx.isFocused && <HiddenFocusTarget />}
    </div>
  );
};

export default CellWrapper;
