export function isBrowserEdge() {
  if (typeof window !== 'undefined') { // condition needed for circle ci compiler
    return window.navigator.userAgent.indexOf('Edge/') > 0;
  } else {
    return false;
  }
}