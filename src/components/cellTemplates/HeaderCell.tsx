import { FC } from "react";
import { useCellContext } from "../CellContext";
import CellWrapper from "../CellWrapper";

interface HeaderCellProps {
  text?: string;
  style?: React.CSSProperties;
}

export const HeaderCell: FC<HeaderCellProps> = ({ text }) => {
  const ctx = useCellContext();

  return (
    <CellWrapper
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => {
        ctx.setEditMode(true);
        ctx.requestFocus();
      }}
      onKeyDown={(e) => {}}
    >
      {text}
    </CellWrapper>
  );
};
