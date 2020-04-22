import { State, ClipboardEvent } from '../Model';
import { getDataToCopy } from './getDataToCopy';
import { getActiveSelectedRange, isBrowserSafari } from '.';

export function handleCopy(event: ClipboardEvent, state: State, removeValues = false): State {
    const activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
        return state;
    }
    const { div } = getDataToCopy(state, activeSelectedRange, removeValues);

    if (isBrowserSafari()) {
        event.clipboardData.setData('text/html', div.innerHTML);
    } else {
        document.body.appendChild(div);
        div.focus();
        document.execCommand('selectAll', false);
        document.execCommand('copy');
        document.body.removeChild(div);
    }

    state.hiddenFocusElement?.focus();
    event.preventDefault();
    return state;
}