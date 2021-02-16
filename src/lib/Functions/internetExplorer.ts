export function isBrowserIE(): boolean {
    if (typeof window !== 'undefined') { // condition needed for circle ci compiler
        return window.navigator.userAgent.indexOf('Trident') > 0;
    } else {
        return false;
    }
}
