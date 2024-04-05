import { FC, useRef, useState } from "react";
import CellWrapper from "../CellWrapper";
import { useCellContext } from "../CellContext";

interface TextCellProps {
  value: string;
  onTextChanged: (newText: string) => void;
  reverse?: boolean;
}

const TextCell: FC<TextCellProps> = ({ value: initialValue, onTextChanged, reverse }) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLTextAreaElement>(null);
  const [isInEditMode, setIsInEditMode] = useState(false);

  return (
    <CellWrapper
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => {
        setIsInEditMode(true);
        ctx.requestFocus(true);
      }}
      onKeyDown={(e) => {
        if (isInEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          ctx.requestFocus(true);
        }
      }}
      targetInputRef={targetInputRef}
    >
      {isInEditMode ? (
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
            setIsInEditMode(false);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsInEditMode(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              // We don't stop propagation here, because we want to trigger the
              // focus move event
              onTextChanged(e.currentTarget.value);
              setIsInEditMode(false);
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : reverse ? (
        initialValue.split("").reverse().join("")
      ) : (
        initialValue
      )}
    </CellWrapper>
  );
};

export default TextCell;
