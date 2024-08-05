import { ChevronCell, Column, Id, NumberCell } from '@silevis/reactgrid';
import { BPRow, RowCells, RowPair } from '.';
import { HorizontalChevronCell } from '../cell-templates/horizontal-chevron-cell-template/horizontal-chevron-cell-template';
import { BPColumn } from './columns';

export const getChevronCell = (row: BPRow) => row.cells.find((cell: RowCells) => cell.type === 'chevron') as ChevronCell;

const hasChildren = (rows: BPRow[], row: BPRow): boolean => rows.some(r => getChevronCell(r)?.parentId === row.rowId);

const isRowFullyExpanded = (rows: BPRow[], row: BPRow): boolean => {
    const parentRow = getParentRow(rows, row);
    if (parentRow) {
        if (!getChevronCell(parentRow).isExpanded) return false;
        return isRowFullyExpanded(rows, parentRow);
    }
    return true;
};

export const getExpandedRows = (rows: BPRow[]): BPRow[] => rows.filter(row => {
    const areAllParentsExpanded = isRowFullyExpanded(rows, row);
    return areAllParentsExpanded !== undefined ? areAllParentsExpanded : true;
});

export const fillCellMatrixHorizontally = (rows: BPRow[]): BPRow[] => rows.map(row => {
    const mappedCells = row.cells.map((cell, idx) => ({ className: cell.className, idx }));

    mappedCells
        .filter(mappedCell => mappedCell.className?.includes('quarter'))
        .forEach(mappedCell => {
            const cells = row.cells as NumberCell[];
            cells[mappedCell.idx].value = cells[mappedCell.idx + 1].value + cells[mappedCell.idx + 2].value + cells[mappedCell.idx + 3].value;
        });

    mappedCells
        .filter(mappedCell => mappedCell.className?.includes('year'))
        .forEach(mappedCell => {
            const cells = row.cells as NumberCell[];
            cells[mappedCell.idx].value = cells[mappedCell.idx + 1].value + cells[mappedCell.idx + 5].value
                + cells[mappedCell.idx + 9].value + cells[mappedCell.idx + 13].value
        });
    return row;
});

export const resetAggregatedMonthFields = (row: BPRow) => {
    row.cells.forEach(cell => {
        if ((cell.type === 'number' || cell.type === 'nonEditableNumber') && cell.className === 'month') {
            cell.value = 0;
        }
    });
};

export const fillCellMatrixVertically = (rows: BPRow[]) => {
    collectRowPairs(rows).forEach(rowPair => {
        rowPair.from.cells.forEach((_, idx) => {
            const fromCell = rowPair.from.cells[idx];
            const toCell = rowPair.to.cells[idx] as NumberCell;
            if (fromCell.type === 'number' || fromCell.type === 'nonEditableNumber') {
                const from = isNaN(fromCell.value) ? 0 : fromCell.value;
                const to = isNaN(toCell.value) ? 0 : toCell.value;
                toCell.value = from + to;
            }
        });
    });
};

export const collectRowPairs = (rows: BPRow[]) => {
    const acc: RowPair[] = [];
    rows.forEach(row => {
        const chevronCell = getChevronCell(row);
        if (chevronCell && chevronCell.parentId === undefined) {
            const hasRowChildrens = hasChildren(rows, row);
            if (hasRowChildrens) {
                collectRowPairsOnChildren(rows, row, acc);
                resetAggregatedMonthFields(row);
            };
        }
    });
    return acc;
};

const collectRowPairsOnChildren = (allRows: BPRow[], parentRow: BPRow, acc: RowPair[]) => {
    getDirectChildrenRows(allRows, parentRow).forEach(row => {
        const hasRowChildrens = hasChildren(allRows, row);
        if (hasRowChildrens) {
            collectRowPairsOnChildren(allRows, row, acc);
            resetAggregatedMonthFields(row);
        }
        acc.push({ from: row, to: parentRow });
    });
};

export const getDirectChildrenRows = (rows: BPRow[], parentRow: BPRow): BPRow[] => rows.filter(row => !!row.cells.find(cell => cell.type === 'chevron' && cell.parentId === parentRow.rowId));

export const getParentRow = (rows: BPRow[], row: BPRow): BPRow | undefined => rows.find(r => r.rowId === getChevronCell(row)?.parentId);

const assignIndentAndHasChildrens = (allRows: BPRow[], parentRow: BPRow, indent: number) => {
    ++indent;
    getDirectChildrenRows(allRows, parentRow).forEach(row => {
        const chevronCell = getChevronCell(row);
        chevronCell.indent = indent;
        const hasRowChildrens = hasChildren(allRows, row);
        chevronCell.hasChildren = hasRowChildrens;
        if (hasRowChildrens) assignIndentAndHasChildrens(allRows, row, indent);
    });
};

export const getDataFromRows = (rows: BPRow[]): BPRow[] => rows.filter(row => row.cells.find(cell => cell.type === 'chevron') !== undefined);

export const createIndents = (rows: BPRow[]): BPRow[] => rows.map(row => {
    const chevronCell = getChevronCell(row);
    if (chevronCell && chevronCell.parentId === undefined) {
        const hasRowChildrens = hasChildren(rows, row);
        chevronCell.hasChildren = hasRowChildrens;
        if (hasRowChildrens) assignIndentAndHasChildrens(rows, row, 0);
    }
    return row;
});

export const isHorizontalChevronCell = (cell: RowCells) => cell.type === 'horizontalChevron';

/// COLUMN

export const extendWithColIds = (row: BPRow, columns: BPColumn[]) => {
    row.cells.forEach((cell, idx) => (cell as any).columnId = columns[idx]?.columnId);
    return row;
}

export const getDataFromColumns = (columns: Column[]): Column[] => columns.slice(1, columns.length);

export const getHorizontalChevronCell = (cells: RowCells[], columnId: Id) => cells.find((cell: RowCells) => cell.type === 'horizontalChevron' && cell.parentId === columnId) as HorizontalChevronCell | undefined;

export const getParentCell = (cells: RowCells[], cell: RowCells): HorizontalChevronCell | undefined => cells.find(c => (c as any).columnId === (cell as any).parentId) as HorizontalChevronCell | undefined;

export const getDirectChildrenColumns = (rows: BPRow[], parentRow: BPRow): BPRow[] => rows.filter(row => !!row.cells.find(cell => cell.type === 'horizontalChevron' && cell.parentId === parentRow.rowId));

export const isCellFullyExpanded = (cells: RowCells[], cell: RowCells): boolean => {
    const parentCell = getParentCell(cells, cell);
    if (parentCell) {
        if (!parentCell.isExpanded) return false;
        return isCellFullyExpanded(cells, parentCell);
    }
    return true;
};

export const getExpandedCells = (cells: RowCells[]): RowCells[] => cells.filter(cell => {
    const areAllParentsExpanded = isCellFullyExpanded(cells, cell);
    return areAllParentsExpanded !== undefined ? areAllParentsExpanded : true;
});

export const getColumnsIdsxToRender = (cells: RowCells[], columnsToRender: BPColumn[]) => {
    return cells.map((thrCell, idx) =>
        columnsToRender.find(colToRender => colToRender.columnId === (thrCell as HorizontalChevronCell).columnId) ? idx : NaN)
        .filter(idx => !isNaN(idx));
}

export const filterCellsOnRows = (rows: BPRow[], visibleColsIdxs: number[]) => rows.map(row => {
    const cells = row.cells.filter((_, idx) => visibleColsIdxs.includes(idx));
    return { ...row, cells };
});