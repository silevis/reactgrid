export function isMacOs(): boolean {
    if (typeof window !== 'undefined') { // condition needed for CI/CD
        return window.navigator.appVersion.indexOf('Mac') !== -1;
    }
    return false;
}

export function isIOS(): boolean {
    if (typeof window !== 'undefined') { // condition needed for CI/CD
        if (/iPad|iPhone|iPod/.test(window.navigator.platform)) {
            return true;
        } else {
            return isIpadOS();
        }
    }
    return false;
}

export function isIpadOS(): boolean {
    if (typeof window !== 'undefined') { // condition needed for CI/CD
        return window.navigator.maxTouchPoints > 2 && /MacIntel/.test(window.navigator.platform);
    }
    return false;
}
