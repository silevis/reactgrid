import React, { FC, useEffect, useRef, useState } from "react";
import { useCellContext } from "../components/CellContext";
import CellWrapper from "../components/CellWrapper";
import { useDoubleTouch } from "../hooks/useDoubleTouch";

interface NumberCellProps {
  value: number;
  onValueChanged: (newValue: number) => void;
  validator?: (value: number) => boolean;
  errorMessage?: string;
  hideZero?: boolean;
  allowSeparators?: boolean;
  format?: Intl.NumberFormat;
  style?: React.CSSProperties;
}

export const NumberCell: FC<NumberCellProps> = ({
  value: initialValue,
  style,
  onValueChanged,
  validator,
  errorMessage,
  hideZero,
  allowSeparators = true,
  format,
}) => {
  const initialValueStr = initialValue?.toString();
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState({ value: initialValue, text: initialValueStr || "0" });
  const escapePressedRef = useRef(false);
  const { handleDoubleTouch } = useDoubleTouch(ctx, setEditMode);

  const isValid = validator ? validator(Number(initialValue)) : true;

  // display the formatted value or error message
  const getFormattedValue = (): string => {
    if (Number.isNaN(Number(currentValue.value)) || (hideZero && currentValue.value === 0)) return "";
    if (format) return format.format(currentValue.value);
    if (!isValid && errorMessage) return errorMessage;

    // show the value as a string without any formatting
    return currentValue.text;
  };

  useEffect(() => {
    setCurrentValue({ text: initialValueStr || "0", value: initialValue });
  }, [initialValue, initialValueStr]);

  const numberKeys = "0123456789";
  const numberSeparators = [".", ","];

  return (
    <CellWrapper
      onTouchEnd={handleDoubleTouch}
      onStringValueRequested={() => initialValueStr}
      onStringValueReceived={(v) => {
        const numValue = v === "" ? NaN : Number(v);
        onValueChanged?.(numValue);
      }}
      style={style}
      onDoubleClick={() => {
        if (ctx.isFocused) {
          setCurrentValue({ text: initialValueStr || "0", value: initialValue });
          setEditMode(true);
        }
      }}
      onKeyDown={(e) => {
        if ((!isEditMode && numberKeys.includes(e.key)) || (allowSeparators && numberSeparators.includes(e.key))) {
          setCurrentValue({ text: "", value: NaN });
          setEditMode(true);
        } else if (!isEditMode && !ctx.isSelected && (e.key === "Enter" || e.key === "F2")) {
          e.stopPropagation();
          setCurrentValue({ text: initialValueStr || "0", value: initialValue });
          setEditMode(true);
        }
      }}
    >
      {isEditMode ? (
        <input
          className="rg-input"
          value={currentValue.text}
          onChange={(e) => {
            let newValue = e.currentTarget.value.replace(allowSeparators ? /[^0-9,.]/g : /[^0-9]/g, "");
            if (numberSeparators.includes(newValue)) {
              newValue = "0" + newValue;
            }
            setCurrentValue({ text: newValue, value: Number(newValue) });
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onBlur={(e) => {
            if (!escapePressedRef.current) {
              const value = e.currentTarget.value.replace(/,/g, ".");
              onValueChanged?.(Number(value));
            }
            setEditMode(false);
            if (escapePressedRef.current) {
              escapePressedRef.current = false;
            }
          }}
          onCut={(e) => e.stopPropagation()}
          onCopy={(e) => e.stopPropagation()}
          onPaste={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            const controlKeys = ["Escape", "Enter", "Tab"];
            if (!controlKeys.includes(e.key)) {
              e.stopPropagation();
            }
            if (e.key === "Escape") {
              escapePressedRef.current = true;
              setEditMode(false);
            } else if (e.key === "Enter") {
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
