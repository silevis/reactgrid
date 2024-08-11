import { FC, useEffect, useRef, useState } from "react";
import CellWrapper from "../components/CellWrapper";
import { useCellContext } from "../components/CellContext";
import { useDoubleTouch } from "../hooks/useDoubleTouch";
import { isAlphaNumericWithoutModifiers } from "../utils/keyCodeCheckings";

interface TextCellProps {
  value?: string;
  style?: React.CSSProperties;
}

export const TextCell: FC<TextCellProps> = ({ value: initialValue }) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue || "");
  const { handleDoubleTouch } = useDoubleTouch(ctx, setEditMode);

  const cellIndexes = { rowIndex: ctx.realRowIndex, colIndex: ctx.realColumnIndex };

  useEffect(() => {
    if (targetInputRef.current) {
      targetInputRef.current.setSelectionRange(currentValue.length, currentValue.length);
    }
  }, [isEditMode, currentValue]);

  return (
    <CellWrapper
      onTouchEnd={handleDoubleTouch}
      style={{ padding: ".2rem", textAlign: "center", outline: "none", minHeight: 0 }}
      onDoubleClick={() => {
        if (ctx.isFocused) {
          setEditMode(true);
        }
      }}
      onKeyDown={(e) => {
        if (!isEditMode && isAlphaNumericWithoutModifiers(e)) {
          setCurrentValue("");
          setEditMode(true);
        } else if (!isEditMode && e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          setCurrentValue(initialValue || "");
          setEditMode(true);
        } else if (!isEditMode && e.key === "Backspace") {
          ctx.onCellChanged(cellIndexes, "");
        }
      }}
    >
      {isEditMode ? (
        <input
          value={currentValue}
          style={inputStyle}
          onChange={(e) => setCurrentValue(e.currentTarget.value)}
          onBlur={(e) => {
            ctx.onCellChanged(cellIndexes, e.currentTarget.value);
            setEditMode(false);
          }}
          onKeyDown={(e) => {
            const controlKeys = ["Escape", "Enter", "Tab"];
            if (!controlKeys.includes(e.key)) {
              e.stopPropagation();
            }
            if (e.key === "Escape") {
              setEditMode(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              ctx.onCellChanged(cellIndexes, e.currentTarget.value);
              setEditMode(false);
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : (
        initialValue
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
