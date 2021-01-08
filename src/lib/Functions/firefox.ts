export function isBrowserFirefox(): boolean {
    if (typeof window !== 'undefined') { // condition needed for circle ci compiler
        return navigator.userAgent.includes('Firefox');
    }
    return false;
}
