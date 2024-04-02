import { FC, useRef } from "react";
import CellWrapper from "../CellWrapper";
import { useCellContext } from "../CellContext";

interface TextCellProps {
  value: string;
  onTextChanged: (newText: string) => void;
  reverse?: boolean;
}

const TextCell: FC<TextCellProps> = ({ value, onTextChanged, reverse }) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <CellWrapper
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => ctx.requestFocus(true)}
      onKeyDown={(e) => {
        if (!ctx.isInEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          ctx.requestFocus(true);
        }
      }}
      targetInputRef={targetInputRef}
    >
      {ctx.isInEditMode ? (
        <textarea
          defaultValue={value}
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
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              ctx.disableEditMode();
            } else if (e.key === "Enter") {
              e.preventDefault();
              // We don't stop propagation here, because we want to trigger the
              // focus move event
              onTextChanged(e.currentTarget.value);
              ctx.disableEditMode();
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : reverse ? (
        value.split("").reverse().join("")
      ) : (
        value
      )}
    </CellWrapper>
  );
};

export default TextCell;
