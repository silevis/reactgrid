import React, { FC } from "react";
import { useCellContext } from "./CellContext";
import HiddenFocusTarget from "./HiddenFocusTarget";
import { getCellArea, isCellInRange } from "../utils/cellUtils";

type CellWrapperProps = React.ClassAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLDivElement> & {
    targetInputRef?: React.RefObject<HTMLInputElement | HTMLElement>;
    children: React.ReactNode;
  };

const CellWrapper: FC<CellWrapperProps> = ({ children, targetInputRef, ...wrapperDivAttributes }) => {
  const { className: customClassName, style: customStyle } = wrapperDivAttributes;
  const ctx = useCellContext();

  // const containerStyle = ctx.getContainerStyle();
  const isFocused = ctx.isFocused;

  return (
    <div
      {...wrapperDivAttributes}
      className={`rgCellContainer rgRowIdx-${ctx.realRowIndex} rgColIdx-${ctx.realColumnIndex} ${
        customClassName ?? ""
      }`}
      style={{
        ...customStyle,
        padding: ".1rem .2rem",
        textAlign: "center",
        ...ctx.containerStyle,
      }}
    >
      {children}
      {isFocused && <HiddenFocusTarget />}
    </div>
  );
};

export default CellWrapper;
