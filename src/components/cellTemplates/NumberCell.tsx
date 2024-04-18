import React, { FC, useRef, useState } from "react";
import { useCellContext } from "../CellContext";
import CellWrapper from "../CellWrapper";

interface NumberCellProps {
  value: number;
  onValueChanged: (newValue: number) => void;
  validator?: (value: number) => boolean;
  errorMessage?: string;
  hideZero?: boolean;
  format?: Intl.NumberFormat;
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
  const [isInEditMode, setIsInEditMode] = useState(false);

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
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => {
        setIsInEditMode(true);
        ctx.requestFocus(true);
      }}
      onKeyDown={(e) => {
        if (!isInEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          ctx.requestFocus(true);
          setIsInEditMode(true);
        }
      }}
      targetInputRef={targetInputRef}
    >
      {isInEditMode ? (
        <textarea
          defaultValue={initialValue.toString()}
          onBlur={(e) => {
            onValueChanged(Number(e.currentTarget.value));
            setIsInEditMode(false);
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
            if (e.key === "Escape") {
              setIsInEditMode(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              onValueChanged(Number(e.currentTarget.value));
              setIsInEditMode(false);
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
