import React, { useState } from 'react';
import {
    ReactGrid, Column, Row, CellChange, Id, MenuOption, SelectionMode, DropPosition, Cell, CellLocation,
    NumberCell, GroupCell,
} from './lib';
import { config } from './testEnvConfig';
import './theming-test.scss';
import './lib/assets/core.scss';
import { FlagCellTemplate } from './flagCell/FlagCellTemplate';

const columnCount = config.columns;
const rowCount = config.rows;

interface TestGridState {
    columns: Column[]
    rows: Row[]
}

interface TestGridProps {
    containerHeight?: number;
    containerWidth?: number;
    containerMargin?: number;
    enableSticky?: boolean;
    enableColumnAndRowSelection?: boolean;
    disableFloatingCellEditor?: boolean;
}

const emailValidator = (email: string): boolean => {
    const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email_regex.test(email.replace(/\s+/g, '')))
        return true;
    return false;
}

export const TestGrid: React.FunctionComponent<TestGridProps> = (props) => {

    const myNumberFormat = new Intl.NumberFormat('pl', { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'PLN' });
    const myDateFormat = new Intl.DateTimeFormat('pl', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
    const myTimeFormat = new Intl.DateTimeFormat('pl', { hour: '2-digit', minute: '2-digit' })

    const [state, setState] = useState<TestGridState>(() => {
        const columns = new Array(columnCount).fill(0).map((_, ci) => ({
            columnId: `col-${ci}`, resizable: true, reorderable: true, width: config.cellWidth,
        } as Column));

        const rows = new Array(rowCount).fill(0).map((_, ri) => {
            return {
                rowId: `row-${ri}`, reorderable: true, height: config.cellHeight, cells: columns.map((_, ci) => {
                    if (ri === 0) return { type: config.firstRowType, text: `${ri} - ${ci}` }
                    const now = new Date();
                    switch (ci) {
                        case 0:
                            return { type: 'group', text: `${ri} - ${ci}`, parentId: ri, isExpanded: ri % 4 && undefined, hasChildrens: true } as GroupCell
                        case 1:
                            return { type: 'text', text: `${ri} - ${ci}` }
                        case 2:
                            return { type: 'email', text: `${ri}.${ci}@bing.pl`, validator: emailValidator }
                        case 3:
                            return { type: 'number', format: myNumberFormat, value: parseFloat(`${ri}.${ci}`), nanToZero: false, hideZero: true } as NumberCell
                        case 4:
                            return { type: 'date', format: myDateFormat, date: new Date(now.setHours((ri * 24), 0, 0, 0)) }
                        case 5:
                            return { type: 'time', format: myTimeFormat, time: new Date(now.setHours(now.getHours() + ri)) }
                        case 6:
                            return { type: 'checkbox', checked: false, checkedText: 'Zaznaczono', uncheckedText: false }
                        case 7:
                            return { type: 'flag', text: 'pol' }
                        default:
                            return { type: 'text', text: `${ri} - ${ci}`, validator: () => { } }
                    }
                })
            } as Row
        });

        return { rows, columns }
    })

    const handleColumnResize = (ci: Id, width: number) => {
        let newState = { ...state };
        const columnIndex = newState.columns.findIndex(el => el.columnId === ci);
        const resizedColumn: Column = newState.columns[columnIndex];
        const updateColumn: Column = { ...resizedColumn, width };
        newState.columns[columnIndex] = updateColumn;
        setState(newState);
    }

    const handleChanges = (changes: CellChange[]) => {
        let newState = { ...state };
        changes.forEach((change: CellChange) => {
            const changeRowIdx = newState.rows.findIndex(el => el.rowId === change.rowId);
            const changeColumnIdx = newState.columns.findIndex(el => el.columnId === change.columnId);
            newState.rows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        })
        setState(newState);
        return true;
    }

    const reorderArray = <T extends {}>(arr: T[], idxs: number[], to: number) => {
        const movedElements: T[] = arr.filter((_: T, idx: number) => idxs.includes(idx));
        to = Math.min(...idxs) < to ? to += 1 : to -= idxs.filter(idx => idx < to).length;
        const leftSide: T[] = arr.filter((_: T, idx: number) => idx < to && !idxs.includes(idx));
        const rightSide: T[] = arr.filter((_: T, idx: number) => idx >= to && !idxs.includes(idx));
        return [...leftSide, ...movedElements, ...rightSide];
    }

    const handleCanReorderColumns = (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition): boolean => {
        return true;
    }

    const handleCanReorderRows = (targetColumnId: Id, rowIds: Id[], dropPosition: DropPosition): boolean => {
        // const rowIndex = state.rows.findIndex((row: Row) => row.rowId === targetColumnId);
        // if (rowIndex === 0) return false;
        return true;
    }

    const handleColumnsReordered = (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => {
        const to = state.columns.findIndex((column: Column) => column.columnId === targetColumnId);
        const columnIdxs = columnIds.map((id: Id, idx: number) => state.columns.findIndex((c: Column) => c.columnId === id));
        setState({
            columns: reorderArray<Column>(state.columns, columnIdxs, to),
            rows: state.rows.map(row => ({ ...row, cells: reorderArray<Cell>(row.cells, columnIdxs, to) })),
        });
    }

    const handleRowsReordered = (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => {
        const newState = { ...state };
        const to = state.rows.findIndex((row: Row) => row.rowId === targetRowId);
        const ids = rowIds.map((id: Id) => state.rows.findIndex(r => r.rowId === id)) as number[];
        setState({ ...newState, rows: reorderArray<Row>(state.rows, ids, to) });
    }

    const handleContextMenu = (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]): MenuOption[] => {
        if (selectionMode === 'row') {
            menuOptions = [
                ...menuOptions,
                { id: 'rowOption', label: 'Custom menu row option', handler: () => { } },
            ]
        }
        if (selectionMode === 'column') {
            menuOptions = [
                ...menuOptions,
                { id: 'columnOption', label: 'Custom menu column option', handler: () => { } },
            ]
        }
        return [
            ...menuOptions,
            { id: 'all', label: 'Custom menu option', handler: () => { } },
        ];
    }

    const handleFocusLocationChanged = (location: CellLocation): boolean => {
        return true;
    }

    return (
        <>
            <div className="test-grid-container" data-cy="div-scrollable-element" style={{
                ...(!config.pinToBody && {
                    height: props.containerHeight || config.rgViewportHeight,
                    width: props.containerWidth || config.rgViewportWidth,
                    margin: props.containerMargin || config.margin,
                    overflow: 'auto',
                }),
                position: 'relative',
                ...(config.flexRow && {
                    display: 'flex',
                    flexDirection: 'row'
                }),
            }}>
                {config.enableAdditionalContent &&
                    <>
                        <Logo />
                        <Logo />
                        <Logo />
                    </>
                }
                <ReactGrid
                    rows={state.rows}
                    columns={state.columns}
                    customCellTemplates={{
                        'flag': new FlagCellTemplate(),
                    }}
                    focusLocation={{ columnId: 'col-2', rowId: 'row-2' }}
                    onCellsChanged={handleChanges}
                    onColumnResized={handleColumnResize}
                    highlights={[{ columnId: 'col-1', rowId: 'row-1', borderColor: '#00ff00' }]}
                    stickyLeftColumns={props.enableSticky && config.stickyLeft}
                    stickyRightColumns={props.enableSticky && config.stickyRight}
                    stickyTopRows={props.enableSticky && config.stickyTop}
                    stickyBottomRows={props.enableSticky && config.stickyBottom}
                    canReorderColumns={handleCanReorderColumns}
                    canReorderRows={handleCanReorderRows}
                    onColumnsReordered={handleColumnsReordered}
                    onRowsReordered={handleRowsReordered}
                    onContextMenu={handleContextMenu}
                    onFocusLocationChanged={handleFocusLocationChanged}
                    enableRowSelection={props.enableColumnAndRowSelection || false}
                    enableColumnSelection={props.enableColumnAndRowSelection || false}
                    disableFloatingCellEditor={props.disableFloatingCellEditor || false}

                />

                {config.enableAdditionalContent &&
                    <>
                        <h1 style={{ width: 3000 }}>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                        <h1>TEXT</h1> Test WITH IT
                    </>
                }
            </div>
            <input type='text' data-cy="outer-input" />
            {config.enableAdditionalContent &&
                <>
                    <h1 style={{ width: 3000 }}>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                    <h1>TEXT</h1> Test WITH IT
                </>
            }
        </>
    )

}

const Logo = () => {
    return <div style={{ display: 'flex', minWidth: 185 }}>
        <h1 style={{ position: 'relative' }}>
            ReactGrid
            <div
                style={{
                    position: 'absolute',
                    top: '-0.5em',
                    right: 0,
                    height: '2.5em',
                    width: '2.5em',
                    transform: 'translateX(100%) rotate(90deg)',
                    background: 'gold',
                    fontSize: '0.3em',
                    color: 'black'
                }}>
                PRO</div>
        </h1>
    </div>
}