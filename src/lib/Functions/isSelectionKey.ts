import { isMacOs } from './operatingSystem';
import { PointerEvent, KeyboardEvent } from '../Model';

export function isSelectionKey(event: PointerEvent | KeyboardEvent): boolean {
    return (!isMacOs() && event.ctrlKey) || event.metaKey;
}