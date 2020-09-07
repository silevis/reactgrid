import React from 'react';
import {
    Column, Row, Id, MenuOption, SelectionMode, DropPosition, CellLocation,
    DefaultCellTypes, CellChange, ReactGridProps, TextCell, Cell
} from './../reactgrid';
import { Config } from './testEnvConfig';
import '../styles.scss';
import { FlagCellTemplate, FlagCell } from './flagCell/FlagCellTemplate';

type TestGridCells = DefaultCellTypes | FlagCell;

type TestGridRow = Row<TestGridCells>;

interface TestGridProps {
    containerHeight?: number;
    containerWidth?: number;
    containerMargin?: number;
    enableSticky?: boolean;
    enableColumnAndRowSelection?: boolean;
    isPro?: boolean;
    config: Config;
    component: React.ComponentClass<ReactGridProps>;
}

const emailValidator: TextCell['validator'] = (email) => {
    const email_regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email_regex.test(email.replace(/\s+/g, ''));
}

export const TestGrid: React.FunctionComponent<TestGridProps> = (props) => {
    const { config, containerHeight, containerWidth, containerMargin, isPro, component, enableSticky, enableColumnAndRowSelection } = props;

    const myNumberFormat = new Intl.NumberFormat('pl', { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2, currency: 'PLN' });
    const myDateFormat = new Intl.DateTimeFormat('pl', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
    const myTimeFormat = new Intl.DateTimeFormat('pl', { hour: '2-digit', minute: '2-digit' })

    const [columns, setColumns] = React.useState(() => new Array(config.columns).fill({ columnId: 0, resizable: true, reorderable: true, width: -1 })
        .map<Column>((_, ci) => ({ columnId: `col-${ci}`, resizable: true, reorderable: true, width: config.cellWidth })));

    const [rows, setRows] = React.useState(() => new Array(config.rows).fill(0).map<TestGridRow>((_, ri) => ({
        rowId: `row-${ri}`,
        reorderable: true,
        height: config.cellHeight,
        cells: columns.map<TestGridCells | Cell>((_, ci) => { // TestGridCells | Cell - allow to use variables containing cell type eg. config.firstRowType
            if (ri === 0) return { type: config.firstRowType, text: `${ri} - ${ci}` }
            const now = new Date();
            switch (ci) {
                case 0:
                    return { type: 'chevron', groupId: !(ri % 3) ? 'A' : undefined, text: `${ri} - ${ci}`, parentId: ri, isExpanded: ri % 4 ? true : undefined, hasChildren: true }
                case 1:
                    return { type: 'text', groupId: !(ri % 3) ? 'B' : undefined, text: `${ri} - ${ci}` }
                case 2:
                    return { type: 'email', groupId: Math.random() < .66 ? Math.random() < .5 ? 'A' : 'B' : undefined, text: `${ri}.${ci}@bing.pl`, validator: emailValidator }
                case 3:
                    return { type: 'number', format: myNumberFormat, value: parseFloat(`${ri}.${ci}`), nanToZero: false, hideZero: true }
                case 4:
                    return { type: 'date', format: myDateFormat, date: new Date(now.setHours((ri * 24), 0, 0, 0)) }
                case 5:
                    return { type: 'time', format: myTimeFormat, time: new Date(now.setHours(now.getHours() + ri)) }
                case 6:
                    return { type: 'checkbox', checked: false, checkedText: 'Checked', uncheckedText: 'Unchecked' }
                case 7:
                    return { type: 'flag', groupId: 'B', text: 'bra' }
                // case 8: // TODO allow user to pass non focusable cell (header cell) with arrows
                //     return { type: 'header', text: `${ri} - ${ci}` }
                default:
                    return { type: 'text', text: `${ri} - ${ci}`, validator: (text: string): boolean => true }
            }
        })
    })));

    const handleColumnResize = (columnId: Id, width: number, selectedColIds: Id[]) => {
        setColumns((prevColumns) => {
            const setColumnWidth = (columnIndex: number) => {
                const resizedColumn = prevColumns[columnIndex];
                prevColumns[columnIndex] = { ...resizedColumn, width };
            }

            if (selectedColIds.includes(columnId)) {
                const stateColumnIndexes = prevColumns
                    .filter(col => selectedColIds.includes(col.columnId))
                    .map(col => prevColumns.findIndex(el => el.columnId === col.columnId));
                stateColumnIndexes.forEach(setColumnWidth);
            } else {
                const columnIndex = prevColumns.findIndex(col => col.columnId === columnId);
                setColumnWidth(columnIndex);
            }
            return [...prevColumns];
        });
    }

    // eslint-disable-next-line
    const handleChangesTest = (changes: CellChange[]) => {
        changes.forEach(change => {
            if (change.type === 'text') {
                console.log(change.newCell.text);
            }
            if (change.type === 'checkbox') {
                console.log(change.previousCell.checked);
            }
        });
    };

    const handleChanges = (changes: CellChange<TestGridCells>[]) => {
        setRows((prevRows) => {
            changes.forEach((change) => {
                const changeRowIdx = prevRows.findIndex(
                    (el) => el.rowId === change.rowId
                );
                const changeColumnIdx = columns.findIndex(
                    (el) => el.columnId === change.columnId
                );
                if (change.type === 'flag') {
                    // console.log(change.newCell.text);
                }
                if (change.type === 'text') {
                    // console.log(change.newCell.text);
                }
                if (change.type === 'checkbox') {
                    // console.log(change.previousCell.checked);
                }
                prevRows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
            });
            return [...prevRows];
        });
    };

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
        const to = columns.findIndex((column: Column) => column.columnId === targetColumnId);
        const columnIdxs = columnIds.map((id: Id, idx: number) => columns.findIndex((c: Column) => c.columnId === id));
        setRows(rows.map(row => ({ ...row, cells: reorderArray(row.cells, columnIdxs, to) })));
        setColumns(reorderArray(columns, columnIdxs, to));
    }

    const handleRowsReorder = (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => {
        setRows((prevRows) => {
            const to = rows.findIndex(row => row.rowId === targetRowId);
            const columnIdxs = rowIds.map(id => rows.findIndex(r => r.rowId === id));
            return reorderArray(prevRows, columnIdxs, to);
        });
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

    const Component = component;
    return (
        <>
            <div className='test-grid-container' data-cy='div-scrollable-element' style={{
                ...(!config.pinToBody && {
                    height: containerHeight || config.rgViewportHeight,
                    width: containerWidth || config.rgViewportWidth,
                    margin: containerMargin || config.margin,
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
                        <Logo isPro={isPro} />
                        <Logo isPro={isPro} />
                        <Logo isPro={isPro} />
                    </>
                }
                <Component
                    rows={rows}
                    columns={columns}
                    initialFocusLocation={{ columnId: 'col-1', rowId: 'row-2' }}
                    // focusLocation={{ columnId: 'col-1', rowId: 'row-3' }}
                    onCellsChanged={handleChanges}
                    onColumnResized={handleColumnResize}
                    customCellTemplates={{ 'flag': new FlagCellTemplate() }}
                    highlights={[
                        { columnId: 'col-1', rowId: 'row-1', borderColor: '#00ff00' },
                        { columnId: 'col-0', rowId: 'row-1', borderColor: 'red' }
                    ]}
                    stickyLeftColumns={enableSticky ? config.stickyLeft : undefined}
                    stickyRightColumns={enableSticky ? config.stickyRight : undefined}
                    stickyTopRows={enableSticky ? config.stickyTop : undefined}
                    stickyBottomRows={enableSticky ? config.stickyBottom : undefined}
                    canReorderColumns={handleCanReorderColumns}
                    canReorderRows={handleCanReorderRows}
                    onColumnsReordered={handleColumnsReorder}
                    onRowsReordered={handleRowsReorder}
                    onContextMenu={handleContextMenu}
                    onFocusLocationChanged={handleFocusLocationChanged}
                    onFocusLocationChanging={handleFocusLocationChanging}
                    enableRowSelection={enableColumnAndRowSelection || false}
                    enableColumnSelection={enableColumnAndRowSelection || false}
                    enableFullWidthHeader={config.enableFullWidthHeader || false}
                    enableRangeSelection={config.enableRangeSelection}
                    enableFillHandle={config.enableFillHandle}
                    enableGroupIdRender={config.enableGroupIdRender}
                    labels={{
                        copyLabel: 'Copy me!',
                        pasteLabel: 'Paste me!',
                        cutLabel: 'Cut me!',
                    }}
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
            <input type='text' data-cy='outer-input' />
            <Logo isPro={isPro} />
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