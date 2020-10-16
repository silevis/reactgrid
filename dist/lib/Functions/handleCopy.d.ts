import { ClipboardEvent } from '../Model/domEventsTypes';
import { State } from '../Model/State';
export declare function handleCopy(event: ClipboardEvent, state: State, removeValues?: boolean): State;
export declare function copyDataCommands(event: ClipboardEvent, state: State, div: HTMLDivElement): void;
