import * as React from 'react';
import { ReactGrid, Column, Row, DefaultCellTypes } from '@silevis/reactgrid-3';
import { RateCellTemplate, RateCell } from '../../cellTemplates/rateCell/RateCellTemplate';
import { FlagCellTemplate, FlagCell } from '../../cellTemplates/flagCell/FlagCellTemplate';
import { columns as dataColumns } from '../../data/columns';
import { rows as dataRows } from '../../data/rows';


interface ColumnReorderGridState {
    columns: Column[]
    rows: Row<DefaultCellTypes | FlagCell | RateCell>[]
}

export const NotLimitedHeightByParentSample: React.FunctionComponent = () => {

    const [state] = React.useState<ColumnReorderGridState>(() => ({
        columns: dataColumns(true, false),
        rows: dataRows(true),
    }))

    return (
        <ReactGrid
            rows={state.rows}
            columns={state.columns}
            customCellTemplates={{
                'rate': new RateCellTemplate(),
                'flag': new FlagCellTemplate()
            }}
            stickyTopRows={1}
            enableFillHandle
            enableRangeSelection
        />
    )
}

export default function Def() {
    return null;
  }
  