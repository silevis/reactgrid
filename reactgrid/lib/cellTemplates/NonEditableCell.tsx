import React, { FC } from "react";
import CellWrapper from "../components/CellWrapper";

interface NonEditableCellProps {
  value?: string | number;
  style?: React.CSSProperties;
}

export const NonEditableCell: FC<NonEditableCellProps> = ({ value }) => {
  return (
    <CellWrapper onStringValueRequsted={() => value?.toString() || ""} onStringValueReceived={() => {}}>
      {value}
    </CellWrapper>
  );
};
