export function isMacOs() {
    if (typeof window !== 'undefined') {
        return window.navigator.appVersion.indexOf("Mac") !== -1;
    }
    return false;
}
export function isIOS() {
    if (typeof window !== 'undefined') {
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
    if (typeof window !== 'undefined') {
        return window.navigator.maxTouchPoints > 2 && /MacIntel/.test(window.navigator.platform);
    }
    return false;
}
