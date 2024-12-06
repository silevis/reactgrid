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
  const [currentValue, setCurrentValue] = useState(initialValueStr || "0");
  const { handleDoubleTouch } = useDoubleTouch(ctx, setEditMode);

  const isValid = validator ? validator(Number(initialValue)) : true;

  // display the formatted value or error message
  const getFormattedValue = (): string => {
    if (Number.isNaN(Number(initialValue)) || (hideZero && initialValue === 0)) return "";
    if (format) return format.format(initialValue);
    if (!isValid && errorMessage) return errorMessage;

    // show the value as a string without any formatting
    return initialValueStr;
  };

  useEffect(() => {
    setCurrentValue(initialValueStr);
  }, [initialValue]);

  const numberKeys = "0123456789";
  const numberSeparators = [".", ","];

  return (
    <CellWrapper
      onTouchEnd={handleDoubleTouch}
      onStringValueRequested={() => initialValueStr}
      onStringValueReceived={(v) => {
        const numValue = Number(v);
        onValueChanged?.(isNaN(numValue) ? 0 : numValue);
      }}
      style={style}
      onDoubleClick={() => {
        if (ctx.isFocused) {
          setCurrentValue(initialValueStr || "0");
          setEditMode(true);
        }
      }}
      onKeyDown={(e) => {
        if ((!isEditMode && numberKeys.includes(e.key)) || (allowSeparators && numberSeparators.includes(e.key))) {
          setCurrentValue("");
          setEditMode(true);
        } else if (!isEditMode && !ctx.isSelected && (e.key === "Enter" || e.key === "F2")) {
          e.stopPropagation();
          setCurrentValue(initialValueStr || "0");
          setEditMode(true);
        }
      }}
    >
      {isEditMode ? (
        <input
          className="rg-input"
          value={currentValue}
          onChange={(e) => {
            let newValue = e.currentTarget.value.replace(allowSeparators ? /[^0-9,.]/g : /[^0-9]/g, "");
            if (numberSeparators.includes(newValue)) {
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
          onKeyDown={(e) => {
            const controlKeys = ["Escape", "Enter", "Tab"];
            if (!controlKeys.includes(e.key)) {
              e.stopPropagation();
            }
            if (e.key === "Escape") {
              setEditMode(false);
            } else if (e.key === "Enter") {
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
