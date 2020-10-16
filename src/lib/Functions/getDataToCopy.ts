import { State } from '../Model/State';
import { Range } from '../Model/Range';
import { Location } from '../Model/InternalModel';
import { emptyCell } from './emptyCell';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { tryAppendChange } from './tryAppendChange';

export function getDataToCopy(state: State, activeSelectedRange: Range, removeValues = false): { div: HTMLDivElement } {
    const { div, table, location } = createHTMLElements(activeSelectedRange);
    const tableRow = table.insertRow();
    processSingleCell(tableRow, state, location);
    setStyles(div, table);
    clearCell(state, location, removeValues);
    return { div };
}

export function processSingleCell(tableRow: HTMLTableRowElement, state: State, location: Location): void {
    const tableCell: HTMLTableDataCellElement = tableRow.insertCell();
    const { cell } = getCompatibleCellAndTemplate(state, location);
    tableCell.textContent = cell.text ? cell.text : ' ';
    tableCell.setAttribute('data-reactgrid', JSON.stringify(cell));
    tableCell.style.border = '1px solid #D3D3D3';
}

export function createHTMLElements(activeSelectedRange: Range): { div: HTMLDivElement, table: HTMLTableElement, location: Location } {
    const div = document.createElement('div');
    const table = document.createElement('table');
    table.setAttribute('empty-cells', 'show');
    table.setAttribute('data-reactgrid', 'reactgrid-content');
    const location = { row: activeSelectedRange.first.row, column: activeSelectedRange.first.column };
    return { div, table, location };
}

export function setStyles(div: HTMLDivElement, table: HTMLTableElement): void {
    div.setAttribute('contenteditable', 'true');
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.appendChild(table);
}

export function clearCell(state: State, location: Location, removeValues: boolean): void {
    if (removeValues) {
        state = tryAppendChange(state, location, emptyCell);
    }
}