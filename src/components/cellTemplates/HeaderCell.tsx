import { FC } from "react";
import CellWrapper from "../CellWrapper";

interface HeaderCellProps {
  text?: string;
  style?: React.CSSProperties;
}

export const HeaderCell: FC<HeaderCellProps> = ({ text }) => {
  return (
    <CellWrapper
      style={{ padding: ".2rem", textAlign: "center", outline: "none" }}
      onDoubleClick={() => {}}
      onKeyDown={(e) => {}}
    >
      {text}
    </CellWrapper>
  );
};
