import { getDataToCopy } from './getDataToCopy';
import { getActiveSelectedRange } from '.';
export function copySelectedRangeToClipboard(state, removeValues) {
    if (removeValues === void 0) { removeValues = false; }
    var activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
        return;
    }
    var div = getDataToCopy(state, activeSelectedRange, removeValues).div;
    document.body.appendChild(div);
    div.focus();
    document.execCommand('selectAll', false);
    document.execCommand('copy');
    document.body.removeChild(div);
    state.hiddenFocusElement.focus();
}
export function copySelectedRangeToClipboardOnSafari(event, state, removeValues) {
    if (removeValues === void 0) { removeValues = false; }
    var activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
        return;
    }
    var div = getDataToCopy(state, activeSelectedRange, removeValues).div;
    event.clipboardData.setData('text/html', div.innerHTML);
    state.hiddenFocusElement.focus();
}
