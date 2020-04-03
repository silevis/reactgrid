import { State, ClipboardEvent } from '../Model';
import { getDataToCopy } from './getDataToCopy';
import { getActiveSelectedRange } from '.';

export function copySelectedRangeToClipboard(state: State, removeValues = false) {
    const activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
        return;
    }
    const { div } = getDataToCopy(state, activeSelectedRange, removeValues);
    document.body.appendChild(div);
    div.focus();
    document.execCommand('selectAll', false);
    document.execCommand('copy');
    document.body.removeChild(div);
    state.hiddenFocusElement.focus();
}

export function copySelectedRangeToClipboardOnSafari(event: ClipboardEvent, state: State, removeValues = false) {
    const activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
        return;
    }
    const { div } = getDataToCopy(state, activeSelectedRange, removeValues);
    event.clipboardData.setData('text/html', div.innerHTML);
    state.hiddenFocusElement.focus();
}
