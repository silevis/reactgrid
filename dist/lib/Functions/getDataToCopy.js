import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { tryAppendChange, emptyCell } from '.';
export function getDataToCopy(state, activeSelectedRange, removeValues) {
    if (removeValues === void 0) { removeValues = false; }
    var div = document.createElement('div');
    var table = document.createElement('table');
    table.setAttribute('empty-cells', 'show');
    table.setAttribute('data-reactgrid', 'reactgrid-content');
    var tableRow = table.insertRow();
    var location = { row: activeSelectedRange.first.row, column: activeSelectedRange.first.column };
    processSingleCell(tableRow, state, location);
    div.setAttribute('contenteditable', 'true');
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.appendChild(table);
    if (removeValues) {
        state = tryAppendChange(state, location, emptyCell);
    }
    return { div: div };
}
function processSingleCell(tableRow, state, location) {
    var tableCell = tableRow.insertCell();
    var cell = getCompatibleCellAndTemplate(state, location).cell;
    tableCell.textContent = cell.text ? cell.text : ' ';
    tableCell.setAttribute('data-reactgrid', JSON.stringify(cell));
    tableCell.style.border = '1px solid #D3D3D3';
}
