import React, { useState } from 'react';
import {
    Column, Row, Id, MenuOption, SelectionMode, DropPosition, CellLocation,
    NumberCell, GroupCell, DefaultCellTypes, CellChange, ReactGridProps
} from './../reactgrid';
import { Config } from './testEnvConfig';
import '../styles.scss';
import { FlagCellTemplate, FlagCell } from './flagCell/FlagCellTemplate';

type TestGridRow = Row<DefaultCellTypes | FlagCell>;

interface TestGridState {
    columns: Column[]
    rows: TestGridRow[]
}

interface TestGridProps {
    containerHeight?: number;
    containerWidth?: number;
    containerMargin?: number;
    enableSticky?: boolean;
    enableColumnAndRowSelection?: boolean;
    enableFullWidthHeader?: boolean;
    isPro?: boolean;
    config: Config;
    component: React.ComponentClass<ReactGridProps>;
}

const emailValidator = (email: string): boolean => {
    const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email_regex.test(email.replace(/\s+/g, ''));
}

export const TestGrid: React.FunctionComponent<TestGridProps> = (props) => {

    const myNumberFormat = new Intl.NumberFormat('pl', { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'PLN' });
    const myDateFormat = new Intl.DateTimeFormat('pl', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
    const myTimeFormat = new Intl.DateTimeFormat('pl', { hour: '2-digit', minute: '2-digit' })

    const [state, setState] = useState<TestGridState>(() => {
        const columns = new Array(props.config.columns).fill(0).map((_, ci) => ({
            columnId: `col-${ci}`, resizable: true, reorderable: true, width: props.config.cellWidth,
        } as Column));

        const rows = new Array(props.config.rows).fill(0).map((_, ri) => {
            return {
                rowId: `row-${ri}`, reorderable: true, height: props.config.cellHeight, cells: columns.map((_, ci) => {
                    if (ri === 0) return { type: props.config.firstRowType, text: `${ri} - ${ci}` }
                    const now = new Date();
                    switch (ci) {
                        case 0:
                            return { type: 'group', groupId: Math.random() < .66 ? Math.random() < .5 ? 'A' : 'B' : undefined, text: `${ri} - ${ci}`, parentId: ri, isExpanded: ri % 4 && undefined, hasChildrens: true } as GroupCell
                        case 1:
                            return { type: 'text', groupId: Math.random() < .66 ? Math.random() < .5 ? 'A' : 'B' : undefined, text: `${ri} - ${ci}` }
                        case 2:
                            return { type: 'email', text: `${ri}.${ci}@bing.pl`, validator: emailValidator }
                        case 3:
                            return { type: 'number', format: myNumberFormat, value: parseFloat(`${ri}.${ci}`), nanToZero: false, hideZero: true } as NumberCell
                        case 4:
                            return { type: 'date', format: myDateFormat, date: new Date(now.setHours((ri * 24), 0, 0, 0)) }
                        case 5:
                            return { type: 'time', format: myTimeFormat, time: new Date(now.setHours(now.getHours() + ri)) }
                        case 6:
                            return { type: 'checkbox', checked: false, checkedText: 'Checked', uncheckedText: false }
                        case 7:
                            return { type: 'flag', group: 'B', text: 'bra' }
                        default:
                            return { type: 'text', text: `${ri} - ${ci}`, validator: () => { } }
                    }
                })
            } as TestGridRow
        });

        return { rows, columns }
    })

    const handleColumnResize = (columnId: Id, width: number, selectedColIds: Id[]) => {
        const newState = { ...state };

        const setColumnWidth = (columnIndex: number) => {
            const resizedColumn = newState.columns[columnIndex];
            newState.columns[columnIndex] = { ...resizedColumn, width };
        }

        if (selectedColIds.includes(columnId)) {
            const stateColumnIndexes = newState.columns
                .filter(col => selectedColIds.includes(col.columnId))
                .map(col => newState.columns.findIndex(el => el.columnId === col.columnId));
            stateColumnIndexes.forEach(setColumnWidth);
        } else {
            const columnIndex = newState.columns.findIndex(col => col.columnId === columnId);
            setColumnWidth(columnIndex);
        }
        setState(newState);
    }

    // eslint-disable-next-line
    const handleChangesTest = (changes: CellChange[]) => {
        changes.forEach(change => {
            if (change.type === 'text') {
                console.log(change.newCell.text);
            }
            if (change.type === 'checkbox') {
                console.log(change.initialCell.checked);
            }
        });
    };

    const handleChanges = (changes: CellChange<DefaultCellTypes | FlagCell>[]) => setState(st => {
        changes.forEach(change => {
            const changeRowIdx = st.rows.findIndex(el => el.rowId === change.rowId);
            const changeColumnIdx = st.columns.findIndex(el => el.columnId === change.columnId);
            if (change.type === 'flag') {
                // console.log(change.newCell.text);
            }
            if (change.type === 'text') {
                // console.log(change.newCell.text);
            }
            if (change.type === 'checkbox') {
                // console.log(change.initialCell.checked);
            }
            st.rows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        });
        return st;
    });

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

    const handleColumnsReorder = (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => {
        const to = state.columns.findIndex((column: Column) => column.columnId === targetColumnId);
        const columnIdxs = columnIds.map((id: Id, idx: number) => state.columns.findIndex((c: Column) => c.columnId === id));
        setState({
            columns: reorderArray(state.columns, columnIdxs, to),
            rows: state.rows.map(row => ({ ...row, cells: reorderArray(row.cells, columnIdxs, to) })),
        });
    }

    const handleRowsReorder = (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => {
        const newState = { ...state };
        const to = state.rows.findIndex(row => row.rowId === targetRowId);
        const ids = rowIds.map(id => state.rows.findIndex(r => r.rowId === id));
        setState({ ...newState, rows: reorderArray(state.rows, ids, to) });
    }

    const handleContextMenu = (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]): MenuOption[] => {
        if (selectionMode === 'row') {
            menuOptions = [
                ...menuOptions,
                {
                    id: 'rowOption', label: 'Custom menu row option',
                    handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => { }
                },
            ]
        }
        if (selectionMode === 'column') {
            menuOptions = [
                ...menuOptions,
                {
                    id: 'columnOption', label: 'Custom menu column option',
                    handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => { }
                },
            ]
        }
        return [
            ...menuOptions,
            {
                id: 'all', label: 'Custom menu option',
                handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => { }
            },
        ];
    }

    const handleFocusLocationChanged = (location: CellLocation): void => { }

    const handleFocusLocationChanging = (location: CellLocation): boolean => {
        return true;
    }


    const Component = props.component;
    return (
        <>
            <div className='test-grid-container' data-cy='div-scrollable-element' style={{
                ...(!props.config.pinToBody && {
                    height: props.containerHeight || props.config.rgViewportHeight,
                    width: props.containerWidth || props.config.rgViewportWidth,
                    margin: props.containerMargin || props.config.margin,
                    overflow: 'auto',
                }),
                position: 'relative',
                ...(props.config.flexRow && {
                    display: 'flex',
                    flexDirection: 'row'
                }),
            }}>
                {props.config.enableAdditionalContent &&
                    <>
                        <Logo isPro={props.isPro} />
                        <Logo isPro={props.isPro} />
                        <Logo isPro={props.isPro} />
                    </>
                }
                <Component
                    rows={state.rows}
                    columns={state.columns}
                    initialFocusLocation={{ columnId: 'col-1', rowId: 'row-2' }}
                    // focusLocation={{ columnId: 'col-1', rowId: 'row-3' }}
                    onCellsChanged={handleChanges}
                    onColumnResized={handleColumnResize}
                    customCellTemplates={{ 'flag': new FlagCellTemplate() }}
                    highlights={[{ columnId: 'col-1', rowId: 'row-1', borderColor: '#00ff00' }, { columnId: 'col-0', rowId: 'row-1', borderColor: 'red' }]}
                    stickyLeftColumns={props.enableSticky ? props.config.stickyLeft : undefined}
                    stickyRightColumns={props.enableSticky ? props.config.stickyRight : undefined}
                    stickyTopRows={props.enableSticky ? props.config.stickyTop : undefined}
                    stickyBottomRows={props.enableSticky ? props.config.stickyBottom : undefined}
                    canReorderColumns={handleCanReorderColumns}
                    canReorderRows={handleCanReorderRows}
                    onColumnsReordered={handleColumnsReorder}
                    onRowsReordered={handleRowsReorder}
                    onContextMenu={handleContextMenu}
                    onFocusLocationChanged={handleFocusLocationChanged}
                    onFocusLocationChanging={handleFocusLocationChanging}
                    enableRowSelection={props.enableColumnAndRowSelection || false}
                    enableColumnSelection={props.enableColumnAndRowSelection || false}
                    enableFullWidthHeader={props.config.enableFullWidthHeader || false}
                    enableRangeSelection={props.config.enableRangeSelection}
                    enableFillHandle={props.config.enableFillHandle}
                    labels={{
                        copyLabel: 'Copy me!',
                        pasteLabel: 'Paste me!',
                        cutLabel: 'Cut me!',
                    }}
                />
                {props.config.enableAdditionalContent &&
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
            <input type='text' data-cy='outer-input' />
            <Logo isPro={props.isPro} />
            {props.config.enableAdditionalContent &&
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

const Logo: React.FC<{ isPro?: boolean }> = props => {
    return <div style={{ display: 'flex', minWidth: 185 }}>
        <h1 style={{ position: 'relative' }}>
            ReactGrid
            {props.isPro && <div
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
                PRO</div>}
        </h1>
    </div>
}

export const withDiv = <T extends object>(Component: React.ComponentType<T>): React.FC<T & TestGridProps> => {
    return ({ ...props }: TestGridProps) => {
        Component.displayName = 'WithDivWrapperTestGrid';
        return (
            <div style={{
                padding: 20,
                position: 'relative',
            }}>
                <Component {...props as T} />
            </div>
        )
    }
}

export const ExtTestGrid = withDiv(TestGrid);