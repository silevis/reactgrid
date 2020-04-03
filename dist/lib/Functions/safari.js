export function isBrowserSafari() {
    if (typeof window !== 'undefined') {
        return window.navigator.userAgent.indexOf('Safari') !== -1
            && navigator.userAgent.indexOf('Chrome') === -1;
    }
    return false;
}
