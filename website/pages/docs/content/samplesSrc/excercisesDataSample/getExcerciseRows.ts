import { Row, NumberCell, CellStyle } from "@silevis/reactgrid";
import { Excercise, Athlete, Result } from "./model";
import { SampleCellTypes } from "./ExcercisesDataSample";
import { excersisesStyle, noBorderCellStyle } from "./utils";
import { DisabledCell, getDisabledCell } from "../../cellTemplates/disabledCellTemplate/DisabledCellTemplate";
import { parameters } from "../../data/excercisesData/initialValues";


export const getExcerciseRows = (excercise: Excercise, athletes: Athlete[], results: Result[]): Row<SampleCellTypes>[] => {
    const style = noBorderCellStyle;
    const headerBorder = { color: 'rgba(0,0,0,0.4)', width: '1px' }
    const lastRowStyle: CellStyle = { ...style, border: { ...style.border, bottom: headerBorder }, paddingLeft: "20px" }
    const headerStyle: CellStyle = { ...style, border: { ...style.border, bottom: headerBorder } }
    const headerRowStyle = { ...excercise.hidden ? headerStyle : style, color: '#404040' };
    const headerRow: Row<SampleCellTypes> = {
        rowId: excercise.id,
        height: 30,
        cells: [
            { type: 'chevron', text: excercise.name, isExpanded: !excercise.hidden, className: 'bold-text', style: headerRowStyle, hasChildren: true },
            ...athletes.map((athlete): DisabledCell => {
                const athleteResults = results.filter(result => result.athleteId === athlete.id && result.excerciseId === excercise.id);
                const summedUpPoints = athleteResults.reduce((prev, curr) => {
                    const param = parameters.find(param => param.id === curr.parameterId);
                    if (!param) return prev;
                    return prev + param.multiplier(curr.value || 0);
                }, 0)
                return getDisabledCell(summedUpPoints.toFixed(2), headerRowStyle, "bold-text gray align-right")
            })
        ]
    }
    const excerciseParams = parameters.filter(param => param.excerciseId === excercise.id);
    const styleExcersises = excersisesStyle;
    const rows: Row<SampleCellTypes>[] = excerciseParams.map((param, idx) => {
        const rowStyle = idx === excerciseParams.length - 1 ? lastRowStyle : styleExcersises;
        return ({
            rowId: param.id,
            height: 30,
            cells: [
                getDisabledCell(param.name, rowStyle),
                ...athletes.map((athlete): NumberCell => {
                    const result = results.find(result => result.athleteId === athlete.id && result.parameterId === param.id);
                    return { type: 'number', value: result?.value || 0, style: rowStyle }
                })]
        })
    })

    return excercise.hidden ? [headerRow] : [headerRow, ...rows]
}