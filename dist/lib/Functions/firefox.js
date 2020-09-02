export function isBrowserFirefox() {
    if (typeof window !== 'undefined') {
        return navigator.userAgent.indexOf('Firefox') !== -1;
    }
    return false;
}
