import React, { FC } from "react";
import CellWrapper from "../../lib/components/CellWrapper";

interface HeaderCellProps {
  value?: string;
  style?: React.CSSProperties;
}

export const HeaderCell: FC<HeaderCellProps> = ({ value }) => {
  return <CellWrapper style={{ padding: ".2rem", textAlign: "center", outline: "none" }}>{value}</CellWrapper>;
};
