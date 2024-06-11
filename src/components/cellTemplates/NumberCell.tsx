import React, { FC, useRef } from "react";
import { useCellContext } from "../CellContext";
import CellWrapper from "../CellWrapper";
import { useDoubleTouch } from "../../hooks/useDoubleTouch";

interface NumberCellProps {
  value: number;
  onValueChanged: (newValue: number) => void;
  validator?: (value: number) => boolean;
  errorMessage?: string;
  hideZero?: boolean;
  format?: Intl.NumberFormat;
  style?: React.CSSProperties;
}

const NumberCell: FC<NumberCellProps> = ({
  value: initialValue,
  onValueChanged,
  validator,
  errorMessage,
  hideZero,
  format,
}) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLTextAreaElement>(null);
  const { handleDoubleTouch } = useDoubleTouch(ctx, ctx.setEditMode);

  const isValid = validator ? validator(Number(initialValue)) : true;

  const textToDisplay =
    hideZero && initialValue === 0
      ? ""
      : format
      ? format.format(initialValue)
      : !isValid && errorMessage
      ? errorMessage
      : initialValue.toString();

  return (
    <CellWrapper
      onTouchEnd={handleDoubleTouch}
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => {
        ctx.setEditMode(true);
        ctx.requestFocus();
      }}
      onKeyDown={(e) => {
        if (!ctx.isInEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          ctx.requestFocus();
          ctx.setEditMode(true);
        }
      }}
      targetInputRef={targetInputRef}
    >
      {ctx.isInEditMode ? (
        <textarea
          defaultValue={initialValue.toString()}
          onBlur={(e) => {
            onValueChanged(Number(e.currentTarget.value));
            ctx.setEditMode(false);
          }}
          style={{
            resize: "none",
            overflowY: "hidden",
            boxSizing: "border-box",
            textAlign: "center",
            width: "100%",
            height: "100%",
            background: "transparent",
            border: "none",
            padding: 0,
            outline: "none",
            color: "inherit",
            fontSize: "inherit",
            fontFamily: "inherit",
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") {
              ctx.setEditMode(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              onValueChanged(Number(e.currentTarget.value));
              ctx.setEditMode(false);
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : (
        textToDisplay
      )}
    </CellWrapper>
  );
};

export default NumberCell;
