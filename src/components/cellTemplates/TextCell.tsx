import { FC, useRef } from "react";
import CellWrapper from "../CellWrapper";
import { useCellContext } from "../CellContext";
import { useDoubleTouch } from "../../hooks/useDoubleTouch";
import { isAlphaNumericWithoutModifiers } from "../../utils/keyCodeCheckings";

interface TextCellProps {
  value?: string;
  onTextChanged: (newText: string) => void;
  reverse?: boolean;
  style?: React.CSSProperties;
}

const TextCell: FC<TextCellProps> = ({ value: initialValue, onTextChanged, reverse }) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLTextAreaElement>(null);
  const { handleDoubleTouch } = useDoubleTouch(ctx, ctx.setEditMode);

  return (
    <CellWrapper
      onTouchEnd={handleDoubleTouch}
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => {
        ctx.setEditMode(true);
        ctx.requestFocus();
        // targetInputRef.current?.setSelectionRange(initialValue?.length, initialValue?.length); // TODO
      }}
      onKeyDown={(e) => {
        if (isAlphaNumericWithoutModifiers(e) || e.key === "Enter") {
          ctx.setEditMode(true);
        }
        if (!ctx.isInEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          ctx.requestFocus();
        }
      }}
    >
      {ctx.isInEditMode ? (
        <textarea
          defaultValue={initialValue}
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
          onBlur={(e) => {
            onTextChanged(e.currentTarget.value);
            ctx.setEditMode(false);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") {
              ctx.setEditMode(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              // We don't stop propagation here, because we want to trigger the
              // focus move event
              onTextChanged(e.currentTarget.value);
              ctx.setEditMode(false);
              ctx.requestFocus({ rowIndex: ctx.realRowIndex + 1, colIndex: ctx.realColumnIndex });
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : reverse ? (
        initialValue?.split?.("").reverse().join("")
      ) : (
        initialValue
      )}
    </CellWrapper>
  );
};

export default TextCell;
