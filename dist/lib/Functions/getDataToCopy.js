import { emptyCell } from './emptyCell';
import { getCompatibleCellAndTemplate } from './getCompatibleCellAndTemplate';
import { tryAppendChange } from './tryAppendChange';
export function getDataToCopy(state, activeSelectedRange, removeValues) {
    if (removeValues === void 0) { removeValues = false; }
    var _a = createHTMLElements(activeSelectedRange), div = _a.div, table = _a.table, location = _a.location;
    var tableRow = table.insertRow();
    processSingleCell(tableRow, state, location);
    setStyles(div, table);
    clearCell(state, location, removeValues);
    return { div: div };
}
export function processSingleCell(tableRow, state, location) {
    var tableCell = tableRow.insertCell();
    var cell = getCompatibleCellAndTemplate(state, location).cell;
    tableCell.textContent = cell.text ? cell.text : ' ';
    tableCell.setAttribute('data-reactgrid', JSON.stringify(cell));
    tableCell.style.border = '1px solid #D3D3D3';
}
export function createHTMLElements(activeSelectedRange) {
    var div = document.createElement('div');
    var table = document.createElement('table');
    table.setAttribute('empty-cells', 'show');
    table.setAttribute('data-reactgrid', 'reactgrid-content');
    var location = { row: activeSelectedRange.first.row, column: activeSelectedRange.first.column };
    return { div: div, table: table, location: location };
}
export function setStyles(div, table) {
    div.setAttribute('contenteditable', 'true');
    div.style.position = 'fixed';
    div.style.top = '50%';
    div.style.left = '50%';
    div.appendChild(table);
}
export function clearCell(state, location, removeValues) {
    if (removeValues) {
        state = tryAppendChange(state, location, emptyCell);
    }
}
