import { State, ClipboardEvent } from '../Model';
export declare function copySelectedRangeToClipboard(state: State, removeValues?: boolean): void;
export declare function copySelectedRangeToClipboardOnSafari(event: ClipboardEvent, state: State, removeValues?: boolean): void;
