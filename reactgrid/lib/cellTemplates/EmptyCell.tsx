import { FC } from "react";
import CellWrapper from "../components/CellWrapper";

interface EmptyCellProps {}

export const EmptyCell: FC<EmptyCellProps> = () => {
  return <CellWrapper style={{ padding: ".2rem", textAlign: "center", outline: "none" }}></CellWrapper>;
};
