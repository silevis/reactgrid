import React, { FC, useEffect, useRef, useState } from "react";
import { useCellContext } from "../components/CellContext";
import CellWrapper from "../components/CellWrapper";
import { useDoubleTouch } from "../hooks/useDoubleTouch";
import { inNumericKey, isNumberSeparator } from "../utils/keyCodeCheckings";

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
  const [currentValue, setCurrentValue] = useState(initialValue.toString() || "0");
  const { handleDoubleTouch } = useDoubleTouch(ctx, setEditMode);

  const isValid = validator ? validator(Number(initialValue)) : true;

  const getFormattedValue = () => {
    if (hideZero && initialValue === 0) return "";
    if (format) return format.format(initialValue);
    if (!isValid && errorMessage) return errorMessage;
    return initialValue?.toString();
  };

  useEffect(() => {
    setCurrentValue(initialValue.toString());
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
        if ((!isEditMode && inNumericKey(e.keyCode)) || isNumberSeparator(e.keyCode)) {
          setCurrentValue("");
          setEditMode(true);
        } else if (!isEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          setCurrentValue(initialValue.toString() || "0");
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
            let newValue = e.currentTarget.value.replace(/[^0-9,.]/g, "");
            if (isNumberSeparator(newValue.charCodeAt(0))) {
              newValue = "0" + newValue;
            }
            setCurrentValue(newValue);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onBlur={(e) => {
            const value = e.currentTarget.value.replace(/,/g, ".");
            onValueChanged?.(Number(value));
            setEditMode(false);
          }}
          onCut={(e) => e.stopPropagation()}
          onCopy={(e) => e.stopPropagation()}
          onPaste={(e) => e.stopPropagation()}
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
              const value = e.currentTarget.value.replace(/,/g, ".");
              onValueChanged?.(Number(value));
              setEditMode(false);
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : (
        getFormattedValue()
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
