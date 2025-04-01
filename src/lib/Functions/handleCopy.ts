import { ClipboardEvent } from '../Model/domEventsTypes';
import { State } from '../Model/State';
import { getActiveSelectedRange } from './getActiveSelectedRange';
import { getDataToCopy } from './getDataToCopy';
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
    // how document.execCommand is deprecated, we need try use Clipboard API if is available
    // https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
    const supportNavigatorClipboard = !!navigator?.clipboard?.write;

    if (isBrowserSafari()) {
        event.clipboardData.setData('text/html', div.innerHTML);
    } else if (supportNavigatorClipboard) {
        const clipboardItemData = {
          'text/html': new Blob([div.innerHTML], { type: 'text/html' }),
          'text/plain': new Blob([div.textContent || ''], { type: 'text/plain' }),
        };
        const clipboardItem = new ClipboardItem(clipboardItemData);
    
        navigator.clipboard.write([clipboardItem]).catch((error) => {
          console.error("Error copying to clipboard: ", error);
        });
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
