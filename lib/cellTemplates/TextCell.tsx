import { FC, useEffect, useRef, useState } from "react";
import CellWrapper from "../components/CellWrapper";
import { useCellContext } from "../components/CellContext";
import { useDoubleTouch } from "../hooks/useDoubleTouch";
import { isAlphaNumericWithoutModifiers } from "../utils/keyCodeCheckings";

interface TextCellProps {
  value?: string;
  onValueChanged: (newText: string) => void;
  style?: React.CSSProperties;
}

export const TextCell: FC<TextCellProps> = ({ value: initialValue, onValueChanged }) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue || "");
  const { handleDoubleTouch } = useDoubleTouch(ctx, setEditMode);

  useEffect(() => {
    if (initialValue !== currentValue) {
      setCurrentValue(initialValue || "");
    }

    if (isEditMode && targetInputRef.current) {
      targetInputRef.current.setSelectionRange(currentValue.length, currentValue.length);
    }
  }, [isEditMode, currentValue, initialValue]);

  return (
    <CellWrapper
      onTouchEnd={handleDoubleTouch}
      onDoubleClick={() => {
        if (ctx.isFocused) {
          setEditMode(true);
        }
      }}
      onKeyDown={(e) => {
        if (!isEditMode) {
          if (isAlphaNumericWithoutModifiers(e)) {
            setCurrentValue("");
            onValueChanged("");
            setEditMode(true);
          }
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            setEditMode(true);
          }
          if (e.key === "Backspace") {
            setCurrentValue("");
            onValueChanged("");
          }
        }
      }}
    >
      {isEditMode ? (
        <textarea
          value={currentValue}
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
          onChange={(e) => setCurrentValue(e.currentTarget.value)}
          onBlur={(e) => {
            onValueChanged(e.currentTarget.value);
            setEditMode(false);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            const controlKeys = ["Escape", "Enter", "Tab"];
            if (!controlKeys.includes(e.key)) {
              e.stopPropagation();
            }

            if (e.key === "Escape") {
              setEditMode(false);
            } else if (e.key === "Enter") {
              e.preventDefault();
              // We don't stop propagation here, because we want to trigger the
              // focus move event
              onValueChanged(e.currentTarget.value);
              setEditMode(false);
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : (
        currentValue
      )}
    </CellWrapper>
  );
};
