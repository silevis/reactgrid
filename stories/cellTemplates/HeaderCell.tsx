import React, { FC } from "react";
import CellWrapper from "../../lib/components/CellWrapper";

interface HeaderCellProps {
  text?: string;
  style?: React.CSSProperties;
}

export const HeaderCell: FC<HeaderCellProps> = ({ text }) => {
  return <CellWrapper style={{ padding: ".2rem", textAlign: "center", outline: "none" }}>{text}</CellWrapper>;
};
