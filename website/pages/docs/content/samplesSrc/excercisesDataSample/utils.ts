import { BorderProps, CellStyle, Row } from "@silevis/reactgrid";
import { SampleCellTypes } from "./ExcercisesDataSample";

export const noBorder: BorderProps = {
    color: 'rgba(0,0,0,0)',
}
export const noBorderCellStyle: CellStyle = {
    border: {
        left: noBorder,
        top: noBorder,
        right: noBorder,
    },
};

export const excersisesStyle: CellStyle = {
    border: {
        left: noBorder,
        top: noBorder,
        right: noBorder,
    },
    paddingLeft: "20px"
};

export const addColorToEvenColumns = (row: Row<SampleCellTypes>) => ({
    ...row,
    cells: row.cells.map((cell, idx) => idx % 2 === 0 && idx > 1
        ? { ...cell, style: { ...cell.style, background: 'rgba(0,0,0,0.05)' } }
        : cell
    )
})