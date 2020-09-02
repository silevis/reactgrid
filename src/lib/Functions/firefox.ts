export function isBrowserFirefox() {
    if (typeof window !== 'undefined') { // condition needed for circle ci compiler
        return navigator.userAgent.indexOf('Firefox') !== -1;
    }
    return false;
}