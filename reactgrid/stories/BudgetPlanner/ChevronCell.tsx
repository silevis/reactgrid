import React, { FC, useEffect, useRef, useState } from "react";
import { CellWrapper, isValidKey, useCellContext } from "@silevis/reactgrid";

interface ChevronCellProps {
  value: string | number;
  isExpanded: boolean;
  onValueChanged: (newText: string) => void;
  onExpand?: (status: boolean) => void;
  hasChildren?: boolean;
}

export const ChevronCell: FC<ChevronCellProps> = ({
  value: initialValue,
  isExpanded = false,
  onValueChanged,
  onExpand,
  hasChildren,
}) => {
  const ctx = useCellContext();
  const targetInputRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue || "");

  useEffect(() => {
    setCurrentValue(initialValue);
  }, [initialValue]);

  return (
    <CellWrapper
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onStringValueRequested={() => initialValue?.toString() || ""}
      onStringValueReceived={() => {}}
      onDoubleClick={() => {
        if (ctx.isFocused) {
          setCurrentValue(initialValue || "");
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
          setCurrentValue(initialValue || "");
          setEditMode(true);
        }
      }}
    >
      {hasChildren && (
        <span
          style={{
            display: "inline-block",
            width: "1rem",
            height: "1rem",
            marginRight: ".5rem",
            transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.3s",
          }}
        >
          {!isEditMode && (
            <div
              style={{ cursor: "pointer" }}
              onDoubleClick={(e) => e.stopPropagation()}
              onClick={() => onExpand?.(isExpanded ? false : true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="1rem"
                height="1rem"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
            </div>
          )}
        </span>
      )}
      {isEditMode ? (
        <input
          className="rg-input"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.currentTarget.value)}
          onBlur={(e) => {
            onValueChanged?.(e.currentTarget.value);
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
              onValueChanged?.(e.currentTarget.value);
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
