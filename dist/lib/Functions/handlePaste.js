var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { getActiveSelectedRange, emptyCell } from '.';
import { pasteData } from './pasteData';
export function handlePaste(event, state) {
    var activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
        return state;
    }
    var pastedCell = emptyCell;
    var htmlData = event.clipboardData.getData('text/html');
    var document = new DOMParser().parseFromString(htmlData, 'text/html');
    var hasReactGridAttribute = document.body.firstElementChild.getAttribute('data-reactgrid') === 'reactgrid-content';
    if (hasReactGridAttribute) {
        var tableRows = document.body.firstElementChild.firstElementChild.children;
        var rawData = tableRows[0].children[0].getAttribute('data-reactgrid');
        var data = rawData && JSON.parse(rawData);
        pastedCell = data ? data : { type: 'text', text: tableRows[0].children[0].innerHTML, value: parseFloat(tableRows[0].children[0].innerHTML) };
    }
    else {
        var text = event.clipboardData.getData('text/plain');
        pastedCell = { type: 'text', text: text, value: parseFloat(text) };
    }
    event.preventDefault();
    return __assign({}, pasteData(state, activeSelectedRange, pastedCell));
}
