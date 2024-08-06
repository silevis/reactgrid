import React, { useState, useRef, useEffect } from 'react';
import { ReactGrid } from '@silevis/reactgrid'
import { CellChange, Row, Cell } from '@silevis/reactgrid';
import { ExtendedColumn, initialColumns, usePrevious, getHeaderCell, transformLogsToModel, getCellValue, getBlankRow } from './utils';
import { initialWorkhours, WorkLog } from '../../data/workhoursData/initialValues';
import { DropdownCellTemplate } from '../../cellTemplates/dropdownCellTemplate/dropdownCellTemplate';
import { ButtonCellTemplate } from '../../cellTemplates/buttonCellTemplate/buttonCellTemplate';

interface GridProps {
    rowHeight: number;
    color: string;
}

export const WorkhoursGrid: React.FC<GridProps> = ({ rowHeight, color }) => {
    const [workLogs, setWorkLogs] = useState<WorkLog[]>(() => initialWorkhours)
    const [columns, setColumns] = useState<ExtendedColumn[]>(() => initialColumns)

    const previousLogLength = usePrevious(workLogs.length)

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (previousLogLength !== workLogs.length && ref.current) {
            ref.current.scrollTo(0, ref.current.scrollHeight)
        }
    }, [workLogs, previousLogLength])

    const headerRow: Row = {
        rowId: 'header',
        height: rowHeight,
        cells: [
            getHeaderCell('Nr', color),
            getHeaderCell('Date', color),
            getHeaderCell('Employee', color),
            getHeaderCell('Hours', color),
            getHeaderCell('Project', color),
            getHeaderCell('Description', color)
        ]
    }

    const rows = transformLogsToModel(workLogs, rowHeight)

    const onCellsChanged = (changes: CellChange[]) => {
        changes.forEach(change => {
            const column = columns.find(col => col.columnId === change.columnId)
            if (change.rowId === workLogs.length && column) {
                setWorkLogs(oldLogs => column.key
                    ? [...oldLogs, { id: oldLogs.length, hours: 0, project: '', employee: '', description: '', [column.key]: getCellValue(change) }]
                    : oldLogs
                )
            }
            const logIdx = workLogs.findIndex(log => log.id === change.rowId);
            if (logIdx === -1 || !column) return
            setWorkLogs(oldLogs => {
                if (!column.key) return oldLogs
                oldLogs[logIdx] = { ...oldLogs[logIdx], [column.key]: getCellValue(change) }
                return [...oldLogs]
            })
        })
    }

    const addBlankLog = () => setWorkLogs(logs => [...logs, { id: logs.length, hours: 0, employee: '', description: '', project: '' }])

    return <div ref={ref}>
        <ReactGrid
            customCellTemplates={{
                'dropdown': DropdownCellTemplate,
                'button': ButtonCellTemplate,
            }}
            onCellsChanged={onCellsChanged}
            rows={[
                headerRow,
                ...rows.map((row, idx) => idx % 2 === 0 ?
                    { ...row, cells: row.cells.map<Cell>(cell => ({ ...cell, style: { background: 'rgba(0,0,0,0.02)' } })) }
                    : row
                ),
                getBlankRow(addBlankLog, rowHeight, workLogs.length)
            ]}
            stickyBottomRows={1}
            stickyTopRows={1}
            columns={columns}
            enableRangeSelection
            enableColumnSelection
            enableRowSelection
            onColumnResized={(id, width) => {
                setColumns(columns => columns.map(col => col.columnId === id ? { ...col, width } : col))
            }}
        />
    </div>

}
