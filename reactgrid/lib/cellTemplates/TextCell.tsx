import { FC, useEffect, useRef, useState } from "react";
import CellWrapper from "../components/CellWrapper";
import { useCellContext } from "../components/CellContext";
import { useDoubleTouch } from "../hooks/useDoubleTouch";
import { isValidKey } from "../utils/keyCodeCheckings";

interface TextCellProps {
  text: string;
  onTextChanged: (newText: string) => void;
  style?: React.CSSProperties;
}

export const TextCell: FC<TextCellProps> = ({ text: initialText, onTextChanged, style }) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialText || "");
  const { handleDoubleTouch } = useDoubleTouch(ctx, setEditMode);

  useEffect(() => {
    setCurrentValue(initialText);
  }, [initialText]);

  return (
    <CellWrapper
      onStringValueRequested={() => initialText}
      onStringValueReceived={(v) => onTextChanged?.(v)}
      onTouchEnd={handleDoubleTouch}
      style={style}
      onDoubleClick={() => {
        if (ctx.isFocused) {
          setCurrentValue(initialText || "");
          setEditMode(true);
        }
      }}
      onKeyDown={(e) => {
        if (!isEditMode && isValidKey(e, [])) {
          e.stopPropagation();
          setCurrentValue("");
          setEditMode(true);
        } else if (!isEditMode && !ctx.isSelected && (e.key === "Enter" || e.key === "F2")) {
          e.stopPropagation();
          setCurrentValue(initialText || "");
          setEditMode(true);
        }
      }}
    >
      {isEditMode ? (
        <input
          className="rg-input"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.currentTarget.value)}
          onBlur={(e) => {
            onTextChanged?.(e.currentTarget.value);
            setEditMode(false);
          }}
          onCut={(e) => e.stopPropagation()}
          onCopy={(e) => e.stopPropagation()}
          onPaste={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            const controlKeys = ["Escape", "Enter", "Tab"];
            if (!controlKeys.includes(e.key)) {
              e.stopPropagation();
            }
            if (e.key === "Escape") {
              setEditMode(false);
            } else if (e.key === "Enter") {
              onTextChanged?.(e.currentTarget.value);
              setEditMode(false);
            }
          }}
          autoFocus
          ref={targetInputRef}
        />
      ) : (
        initialText
      )}
    </CellWrapper>
  );
};
