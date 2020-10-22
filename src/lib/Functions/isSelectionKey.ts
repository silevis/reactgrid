import { isMacOs } from './operatingSystem';
import { PointerEvent, KeyboardEvent } from '../Model/domEventsTypes';

export function isSelectionKey(event: PointerEvent | KeyboardEvent): boolean {
    return (!isMacOs() && event.ctrlKey) || event.metaKey;
}