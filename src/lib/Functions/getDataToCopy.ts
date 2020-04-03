import { State, Range, Location } from '../Model';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { tryAppendChange, emptyCell } from '.';

export function getDataToCopy(state: State, activeSelectedRange: Range, removeValues = false): { div: HTMLDivElement } {
    const div = document.createElement('div');
    const table = document.createElement('table');
    table.setAttribute('empty-cells', 'show');
    table.setAttribute('data-reactgrid', 'reactgrid-content');
    const tableRow = table.insertRow();
    const location = { row: activeSelectedRange.first.row, column: activeSelectedRange.first.column };
    processSingleCell(tableRow, state, location);
    div.setAttribute('contenteditable', 'true');
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.appendChild(table);
    if (removeValues) {
        state = tryAppendChange(state, location, emptyCell);
    }
    return { div };
}

function processSingleCell(tableRow: HTMLTableRowElement, state: State, location: Location): void {
    const tableCell: HTMLTableDataCellElement = tableRow.insertCell();
    const { cell } = getCompatibleCellAndTemplate(state, location);
    tableCell.textContent = cell.text ? cell.text : ' ';
    tableCell.setAttribute('data-reactgrid', JSON.stringify(cell));
    tableCell.style.border = '1px solid #D3D3D3';
}