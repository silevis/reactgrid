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
import { emptyCell } from './emptyCell';
import { getActiveSelectedRange } from './getActiveSelectedRange';
import { pasteData } from './pasteData';
export function handlePaste(event, state) {
    var _a;
    var activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
        return state;
    }
    var pastedCell = emptyCell;
    var htmlData = event.clipboardData.getData('text/html');
    var document = new DOMParser().parseFromString(htmlData, 'text/html');
    // TODO Do we need selection mode here ?
    //const selectionMode = parsedData.body.firstElementChild && parsedData.body.firstElementChild.getAttribute('data-selection') as SelectionMode;
    // TODO quite insecure! maybe do some checks ?
    var hasReactGridAttribute = ((_a = document.body.firstElementChild) === null || _a === void 0 ? void 0 : _a.getAttribute('data-reactgrid')) === 'reactgrid-content';
    if (hasReactGridAttribute) {
        var tableRows = document.body.firstElementChild.firstElementChild.children;
        var rawData = tableRows[0].children[0].getAttribute('data-reactgrid');
        var data = rawData && JSON.parse(rawData);
        var text = tableRows[0].children[0].innerHTML;
        pastedCell = data ? data : { type: 'text', text: text, value: parseFloat(text) };
    }
    else {
        var text = event.clipboardData.getData('text/plain');
        pastedCell = { type: 'text', text: text, value: parseFloat(text) };
    }
    event.preventDefault();
    return __assign({}, pasteData(state, activeSelectedRange, pastedCell));
}
