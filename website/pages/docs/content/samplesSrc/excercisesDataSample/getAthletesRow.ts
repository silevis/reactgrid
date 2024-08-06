import { Row } from "@silevis/reactgrid";
import { noBorderCellStyle } from "./utils";
import { Athlete } from "./model";
import { SampleCellTypes } from "./ExcercisesDataSample";
import { getDisabledCell, DisabledCell } from "../../cellTemplates/disabledCellTemplate/DisabledCellTemplate";


const style = noBorderCellStyle;

export const getAthletesRow = (athletes: Athlete[]): Row<SampleCellTypes> => ({
    rowId: 'athletes',
    height: 35,
    cells: [
        getDisabledCell('', style),
        ...athletes.map((athlete): DisabledCell => getDisabledCell(`${athlete.surname}, ${athlete.name}`, {}, 'bold-text align-right'))
    ]
})