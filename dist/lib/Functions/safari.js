export function isBrowserSafari() {
    if (typeof window !== 'undefined') { // condition needed for circle ci compiler
        return window.navigator.userAgent.indexOf('Safari') !== -1
            && navigator.userAgent.indexOf('Chrome') === -1;
    }
    return false;
}
