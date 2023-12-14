import { FC, useEffect, useRef } from "react";
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
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          ctx.requestFocus(true);
        }
      }}
      targetInputRef={targetInputRef}
    >
      {ctx.realRowIndex === 5 && <div className="siemano">hijacker</div>}
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
              e.stopPropagation();
              onTextChanged(e.currentTarget.value);
              ctx.disableEditMode();
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : // <input
      //   type="text"
      //   style={{
      //     display: "block",
      //     textAlign: "center",
      //     border: "none",
      //     background: "none",
      //     // width: "100%",
      //     // height: "100%",
      //   }}
      //   value={reverse ? text.split("").reverse().join("") : text}
      //   readOnly
      // />
      reverse ? (
        text.split("").reverse().join("")
      ) : (
        text
      )}
    </CellWrapper>
  );
};

export default TextCell;
