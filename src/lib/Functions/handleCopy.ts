import { ClipboardEvent } from '../Model/domEventsTypes';
import { State } from '../Model/State';
import { getDataToCopy } from './getDataToCopy';
import { getActiveSelectedRange } from './getActiveSelectedRange';
import { isBrowserSafari } from './safari';

export function handleCopy(event: ClipboardEvent, state: State, removeValues = false): State {
    const activeSelectedRange = getActiveSelectedRange(state);
    if (!activeSelectedRange) {
      return state;
    }
    const { div } = getDataToCopy(state, activeSelectedRange, removeValues);
    copyDataCommands(event, state, div);
    return { ...state, copyRange: activeSelectedRange };
}

export function copyDataCommands(event: ClipboardEvent, state: State, div: HTMLDivElement): void {
    const supportNavigatorClipboard = !!navigator?.clipboard?.write;

    if (isBrowserSafari()) {
        event.clipboardData.setData('text/html', div.innerHTML);
    } else if (supportNavigatorClipboard) {
        const clipboardItemData = {
          "text/html": div.innerHtml,
        }; 
        const clipboardItem = new ClipboardItem(clipboardItemData);
        await navigator.clipboard.write([clipboardItem]);
    } else {
        document.body.appendChild(div);
        div.focus();
        document.execCommand('selectAll', false);
        document.execCommand('copy');
        document.body.removeChild(div);
    }

    state.hiddenFocusElement?.focus({ preventScroll: true });
    event.preventDefault();
}
