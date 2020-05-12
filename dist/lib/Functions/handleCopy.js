import { getDataToCopy } from './getDataToCopy';
import { isBrowserSafari } from '.';
import { getActiveSelectedRange } from './getActiveSelectedRange';
export function handleCopy(event, state, removeValues) {
    if (removeValues === void 0) { removeValues = false; }
    var activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
        return state;
    }
    var div = getDataToCopy(state, activeSelectedRange, removeValues).div;
    copyDataCommands(event, state, div);
    return state;
}
export function copyDataCommands(event, state, div) {
    var _a;
    if (isBrowserSafari()) {
        event.clipboardData.setData('text/html', div.innerHTML);
    }
    else {
        document.body.appendChild(div);
        div.focus();
        document.execCommand('selectAll', false);
        document.execCommand('copy');
        document.body.removeChild(div);
    }
    (_a = state.hiddenFocusElement) === null || _a === void 0 ? void 0 : _a.focus();
    event.preventDefault();
}
