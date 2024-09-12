import React, { FC, useEffect, useRef, useState } from "react";
import { useCellContext } from "../components/CellContext";
import CellWrapper from "../components/CellWrapper";
import { useDoubleTouch } from "../hooks/useDoubleTouch";
import { inNumericKey } from "../utils/keyCodeCheckings";

interface NumberCellProps {
  value: number;
  onValueChanged: (newValue: number) => void;
  validator?: (value: number) => boolean;
  errorMessage?: string;
  hideZero?: boolean;
  format?: Intl.NumberFormat;
  style?: React.CSSProperties;
}

export const NumberCell: FC<NumberCellProps> = ({
  value: initialValue,
  onValueChanged,
  validator,
  errorMessage,
  hideZero,
  format,
}) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue || 0);
  const { handleDoubleTouch } = useDoubleTouch(ctx, setEditMode);

  const isValid = validator ? validator(Number(initialValue)) : true;

  let textToDisplay = initialValue?.toString();

  if (hideZero && initialValue === 0) {
    textToDisplay = "";
  } else if (format) {
    textToDisplay = format.format(initialValue);
  } else if (!isValid && errorMessage) {
    textToDisplay = errorMessage;
  }

  useEffect(() => {
    setCurrentValue(initialValue);
  }, [initialValue]);

  return (
    <CellWrapper
      onTouchEnd={handleDoubleTouch}
      onStringValueRequsted={() => initialValue.toString()}
      onStringValueReceived={(v) => onValueChanged?.(Number(v))}
      onDoubleClick={() => {
        if (ctx.isFocused) {
          setEditMode(true);
        }
      }}
      onKeyDown={(e) => {
        if (!isEditMode && inNumericKey(e.keyCode)) {
          setCurrentValue(0);
          setEditMode(true);
        } else if (!isEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          setCurrentValue(initialValue || 0);
          setEditMode(true);
        } else if (!isEditMode && e.key === "Backspace") {
          onValueChanged?.(0);
        }
      }}
    >
      {isEditMode ? (
        <input
          value={currentValue}
          onChange={(e) => {
            const value = Number(e.currentTarget.value);
            if (!isNaN(value)) {
              setCurrentValue(value);
            } else {
              setCurrentValue(0);
            }
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onBlur={(e) => {
            onValueChanged?.(Number(e.currentTarget.value));
            setEditMode(false);
          }}
          style={inputStyle}
          onKeyDown={(e) => {
            const controlKeys = ["Escape", "Enter", "Tab"];
            if (!controlKeys.includes(e.key)) {
              e.stopPropagation();
            }
            if (e.key === "Escape") {
              setEditMode(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              onValueChanged?.(Number(e.currentTarget.value));
              setEditMode(false);
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

const inputStyle: React.CSSProperties = {
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
};
