export function isBrowserEdge() {
    if (typeof window !== 'undefined') {
        return window.navigator.userAgent.indexOf('Edge/') > 0;
    }
    else {
        return false;
    }
}
