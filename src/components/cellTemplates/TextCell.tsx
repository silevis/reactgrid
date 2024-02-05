import { FC, useRef } from "react";
import CellWrapper from "../CellWrapper";
import { useCellContext } from "../CellContext";

interface TextCellProps {
  text: string;
  onTextChanged: (newText: string) => void;
  reverse?: boolean;
}

const TextCell: FC<TextCellProps> = ({ text, onTextChanged, reverse }) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);

  return (
    <CellWrapper
      style={{ padding: ".1rem .2rem", textAlign: "center", outline: "none" }}
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
        <input
          type="text"
          style={{ maxWidth: "100%" }}
          defaultValue={text}
          onBlur={(e) => onTextChanged(e.currentTarget.value)}
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
        text.split("").reverse().join("")
      ) : (
        text
      )}
    </CellWrapper>
  );
};

export default TextCell;
