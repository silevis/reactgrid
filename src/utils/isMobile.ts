function isMobileUserAgent() {
  const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

function hasTouchSupport() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

function isMobileScreenSize(minWidth = 768) {
  return window.innerWidth < minWidth || screen.width < minWidth;
}

export function isMobile(withTouch = true, mobileScreenSize = 0): boolean {
  const touchSupport = withTouch ? hasTouchSupport() : true;
  const mobileSize = mobileScreenSize > 0 ? isMobileScreenSize(mobileScreenSize) : true;

  return isMobileUserAgent() && touchSupport && mobileSize;
}
