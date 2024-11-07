import React, { FC } from "react";
import { CellWrapper } from "@silevis/reactgrid";

interface ChevronCellProps {
  value: string | number;
  isExpanded: boolean;
  onExpand?: (status: boolean) => void;
  hasChildren?: boolean;
}

export const HorizontalChevronCell: FC<ChevronCellProps> = ({ value, isExpanded = false, onExpand, hasChildren }) => {
  return (
    <CellWrapper
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onStringValueRequested={() => value?.toString() || ""}
      onStringValueReceived={() => {}}
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
          <div style={{ cursor: "pointer" }} onClick={() => onExpand?.(isExpanded ? false : true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1rem" height="1rem">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </div>
        </span>
      )}
      {value}
    </CellWrapper>
  );
};
