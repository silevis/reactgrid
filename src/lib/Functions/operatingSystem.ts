export function isMacOs() {
    return navigator.appVersion.indexOf("Mac") !== -1;
}

export function isIOS() {
    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
        return true;
    } else {
        return isIpadOS();
    }
}

export function isIpadOS() {
    return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 &&
        /MacIntel/.test(navigator.platform);
}