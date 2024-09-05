import React, { FC } from "react";
import CellWrapper from "../components/CellWrapper";

interface NonEditableCellProps {
  value?: string;
  style?: React.CSSProperties;
}

export const NonEditableCell: FC<NonEditableCellProps> = ({ value }) => {
  return (
    <CellWrapper
      onStringValueRequsted={() => value?.toString() || ""}
      onStringValueReceived={() => {}}
      style={{ padding: ".5rem", textAlign: "center", outline: "none" }}
    >
      {value}
    </CellWrapper>
  );
};
