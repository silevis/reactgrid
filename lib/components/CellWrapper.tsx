import React, { FC } from "react";
import { useCellContext } from "./CellContext";
import HiddenFocusTarget from "./HiddenFocusTarget";
import { ColumnResize } from "./ColumnResize";
import { useReactGridStore } from "../utils/reactGridStore";
import { useReactGridId } from "./ReactGridIdProvider";

type CellWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  targetInputRef?: React.RefObject<HTMLInputElement | HTMLElement>;
  children: React.ReactNode;
};

const CellWrapper: FC<CellWrapperProps> = ({ children, targetInputRef, ...wrapperDivAttributes }) => {
  const { className: customClassName, style: customStyle } = wrapperDivAttributes;
  const ctx = useCellContext();
  const id = useReactGridId();

  const enableColumnSelectionOnFirstRow = useReactGridStore(id, (store) => store.enableColumnSelectionOnFirstRow);
  const enableRowSelectionOnFirstColumn = useReactGridStore(id, (store) => store.enableRowSelectionOnFirstColumn);

  const disableTouchAction =
    ctx.isFocused ||
    (ctx.realRowIndex === 0 && enableColumnSelectionOnFirstRow) || // if column selection is enabled on first row
    (ctx.realColumnIndex === 0 && enableRowSelectionOnFirstColumn); // if row selection is enabled on first column

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
        outline: "none",
        touchAction: disableTouchAction ? "none" : "auto",
        ...customStyle,
        ...ctx.containerStyle,
      }}
    >
      {ctx.realRowIndex === 0 && <ColumnResize />}
      {children}
      <HiddenFocusTarget colIdx={ctx.realColumnIndex} rowIdx={ctx.realRowIndex} />
    </div>
  );
};

export default CellWrapper;
