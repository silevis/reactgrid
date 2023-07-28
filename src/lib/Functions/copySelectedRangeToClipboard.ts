import { State } from '../Model/State';
import { getActiveSelectedRange } from './getActiveSelectedRange';
import { getDataToCopy } from './getDataToCopy';

export function copySelectedRangeToClipboard(state: State, removeValues = false): void {
    const activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
        return;
    }
    const { div } = getDataToCopy(state, activeSelectedRange, removeValues);
    document.body.appendChild(div);
    div.focus();
    document.execCommand('selectAll', false, undefined);
    document.execCommand('copy');
    document.body.removeChild(div);
    state.hiddenFocusElement?.focus();
}
