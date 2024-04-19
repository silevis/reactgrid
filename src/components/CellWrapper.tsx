import React, { FC } from "react";
import { useCellContext } from "./CellContext";
import HiddenFocusTarget from "./HiddenFocusTarget";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";

type CellWrapperProps = React.ClassAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLDivElement> & {
    targetInputRef?: React.RefObject<HTMLInputElement | HTMLElement>;
    children: React.ReactNode;
  };

const CellWrapper: FC<CellWrapperProps> = ({ children, targetInputRef, ...wrapperDivAttributes }) => {
  const { className: customClassName, style: customStyle } = wrapperDivAttributes;
  const ctx = useCellContext();

  const id = useReactGridId();
  const focusedCell = useReactGridStore(id, (store) => store.focusedLocation);
  const isFocused = focusedCell.rowIndex === ctx.realRowIndex && focusedCell.colIndex === ctx.realColumnIndex;

  return (
    <div
      {...wrapperDivAttributes}
      className={`rgCellContainer rgRowIdx-${ctx.realRowIndex} rgColIdx-${ctx.realColumnIndex} ${
        customClassName ?? ""
      }`}
      style={{
        ...customStyle,
        padding: ".2rem",
        textAlign: "center",
        touchAction: isFocused ? "none" : "auto",
        ...ctx.containerStyle,
      }}
    >
      {children}
      {isFocused && <HiddenFocusTarget />}
    </div>
  );
};

export default CellWrapper;
