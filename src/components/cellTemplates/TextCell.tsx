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
  const [lastTouchEnd, setLastTouchEnd] = useState(0);

  const handleTouchEnd = () => {
    const now = new Date().getTime();
    const timesince = now - lastTouchEnd;
    if (timesince < 300 && timesince > 0) {
      // double touch detected
      ctx.setEditMode(true);
      ctx.requestFocus();
    }
    setLastTouchEnd(now);
  };

  return (
    <CellWrapper
      onTouchEnd={handleTouchEnd}
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
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : reverse ? (
        initialValue.split?.("").reverse().join("")
      ) : (
        initialValue
      )}
    </CellWrapper>
  );
};

export default TextCell;
