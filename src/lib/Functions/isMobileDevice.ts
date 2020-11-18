export function isMobileDevice() {
    if (typeof window !== 'undefined') { // condition needed for circle ci compiler
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }
    return false;
};