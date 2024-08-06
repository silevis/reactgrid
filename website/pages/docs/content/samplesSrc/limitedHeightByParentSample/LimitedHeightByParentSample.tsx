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

export const LimitedHeightByParentSample: React.FunctionComponent = () => {

    const [state] = React.useState<ColumnReorderGridState>(() => ({
        columns: dataColumns(true, false),
        rows: dataRows(true),
    }))

    return (
        <div className="test-grid-container" style={{
            height: 150,
            overflow: 'auto'
        }}>
            {/* <div className='position-sticky' style={{ top: '0' }}>hej</div> */}
            <h1>Scroll me</h1> Example Content
            <ReactGrid
                rows={state.rows}
                columns={state.columns}
                customCellTemplates={{
                    'rate': new RateCellTemplate(),
                    'flag': new FlagCellTemplate(),
                }}
                stickyTopRows={1}
                enableFillHandle
                enableRangeSelection
            />
        </div>
    )
}
