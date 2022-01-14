import { State } from '../Model/State';
import { getProActiveSelectedRange } from './getProActiveSelectedRange';
import { getProDataToCopy } from './getProDataToCopy';

export function copySelectedRangeToClipboard(state: State, removeValues = false): void {
    const activeSelectedRange = getProActiveSelectedRange(state);
    if (!activeSelectedRange) {
        return;
    }
    const { div } = getProDataToCopy(state, activeSelectedRange, removeValues);
    document.body.appendChild(div);
    div.focus();
    document.execCommand('selectAll', false, undefined);
    document.execCommand('copy');
    document.body.removeChild(div);
    state.hiddenFocusElement?.focus();
}
