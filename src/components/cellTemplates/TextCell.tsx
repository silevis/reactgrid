import { FC, useRef } from "react";
import { useCellContext } from "../CellWrapper";

interface TextCellProps {
  text: string;
  onTextChanged: (newText: string) => void;
  reverse?: boolean;
}

const TextCell: FC<TextCellProps> = ({ text, onTextChanged, reverse }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);
  const ctx = useCellContext({ containerRef, targetInputRef });

  return (
    <div
      style={{ padding: ".1rem .2rem", textAlign: "center" }}
      onDoubleClick={() => ctx.requestFocus(true)}
      ref={containerRef}
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
              onTextChanged(e.currentTarget.value);
              ctx.disableEditMode();
            }
          }}
          autoFocus
        />
      ) : (
        reverse ? text.split("").reverse().join("") : text
      )}
    </div>
  );
};

export default TextCell;
