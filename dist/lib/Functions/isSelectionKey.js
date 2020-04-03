import { isMacOs } from './operatingSystem';
export function isSelectionKey(event) {
    return (!isMacOs() && event.ctrlKey) || event.metaKey;
}
