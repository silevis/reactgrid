import { CellWrapper, useCellContext } from "@silevis/reactgrid";
import { FC, useRef, useState } from "react";
import { useDoubleTouch } from "../hooks/useDoubleTouch";
import { IoIosArrowDown } from "react-icons/io";
import { isAlphaNumericWithoutModifiers } from "../utils/isAlphaNumericWithoutModifiers";

interface ChevronCellProps {
  text: string;
  onTextChanged: (newText: string) => void;
  style?: React.CSSProperties;
}

export const ChevronCell: FC<ChevronCellProps> = ({
  text: initialText,
  onTextChanged,
}) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialText || "");
  const { handleDoubleTouch } = useDoubleTouch(ctx, setEditMode);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <CellWrapper
      onStringValueRequsted={() => initialText}
      onStringValueReceived={(v) => onTextChanged?.(v)}
      onTouchEnd={handleDoubleTouch}
      style={{
        padding: ".2rem",
        outline: "none",
        minHeight: 0,
        display: "flex",
        columnGap: 5,
        alignItems: "center",
      }}
      onDoubleClick={() => {
        if (ctx.isFocused) {
          setCurrentValue(initialText || "");
          setEditMode(true);
        }
      }}
      onKeyDown={(e) => {
        if (!isEditMode && isAlphaNumericWithoutModifiers(e)) {
          setCurrentValue("");
          setEditMode(true);
        } else if (!isEditMode && e.key === "Enter") {
          e.stopPropagation();
          setCurrentValue(initialText || "");
          setEditMode(true);
        }
      }}
    >
      {isEditMode ? (
        <input
          value={currentValue}
          style={inputStyle}
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
        <>
          <IoIosArrowDown
            onDoubleClick={(e) => e.stopPropagation()}
            onClick={(e) => {
              toggleExpand();
            }}
            className={`chevron-icon ${isExpanded ? "expanded" : ""}`}
          />
          <span>{currentValue}</span>
        </>
      )}
    </CellWrapper>
  );
};

const inputStyle: React.CSSProperties = {
  resize: "none",
  overflowY: "hidden",
  boxSizing: "border-box",
  width: "100%",
  height: "100%",
  background: "transparent",
  border: "none",
  padding: 0,
  paddingLeft: 2,
  outline: "none",
  color: "inherit",
  fontSize: "inherit",
  fontFamily: "inherit",
};
