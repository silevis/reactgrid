export function isMacOs() {
    if (typeof window !== 'undefined') { // condition needed for CI/CD
        return window.navigator.appVersion.indexOf('Mac') !== -1;
    }
    return false;
}
export function isIOS() {
    if (typeof window !== 'undefined') { // condition needed for CI/CD
        if (/iPad|iPhone|iPod/.test(window.navigator.platform)) {
            return true;
        }
        else {
            return isIpadOS();
        }
    }
    return false;
}
export function isIpadOS() {
    if (typeof window !== 'undefined') { // condition needed for CI/CD
        return window.navigator.maxTouchPoints > 2 && /MacIntel/.test(window.navigator.platform);
    }
    return false;
}
