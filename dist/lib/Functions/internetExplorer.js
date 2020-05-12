export function isBrowserIE() {
    if (typeof window !== 'undefined') {
        return window.navigator.userAgent.indexOf('Trident') > 0;
    }
    else {
        return false;
    }
}
