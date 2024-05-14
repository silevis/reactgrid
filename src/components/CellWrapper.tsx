import React, { FC } from "react";
import { useCellContext } from "./CellContext";
import HiddenFocusTarget from "./HiddenFocusTarget";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";
import { useTheme } from "../hooks/useTheme";

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
  const focusedCell = useReactGridStore(id, (store) => store.focusedLocation);
  const onResizeColumn = useReactGridStore(id, (store) => store.onResizeColumn);
  const isFocused = focusedCell.rowIndex === ctx.realRowIndex && focusedCell.colIndex === ctx.realColumnIndex;

  return (
    <div
      {...wrapperDivAttributes}
      className={`rgCellContainer rgRowIdx-${ctx.realRowIndex} rgColIdx-${ctx.realColumnIndex} ${
        customClassName ?? ""
      }`}
      css={{
        ...customStyle,
        paddingTop: theme.cellContainer.padding.top,
        paddingLeft: theme.cellContainer.padding.left,
        paddingBottom: theme.cellContainer.padding.bottom,
        paddingRight: theme.cellContainer.padding.right,
        backgroundColor: theme.cellContainer.background,
        padding: ".2rem",
        textAlign: "center",
        position: "relative",
        touchAction: isFocused ? "none" : "auto",
        ...ctx.containerStyle,
      }}
    >
      {ctx.realRowIndex === 0 && (
        <div
          className="rg-resize-column"
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
      {isFocused && <HiddenFocusTarget />}
    </div>
  );
};

export default CellWrapper;
