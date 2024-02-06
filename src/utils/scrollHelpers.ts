type ScrollableElement = HTMLElement | ReturnType<typeof getTopScrollableElement> | undefined;

export const getScrollableParent = (element: HTMLElement, includeHidden: boolean): ScrollableElement => {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === "absolute";
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
  if (style.position === "fixed") return document.documentElement;
  for (let parent = element; ((parent as HTMLElement | null) = parent.parentElement);) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === "static")
      continue;
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
      return parent;
  }
  return getTopScrollableElement();
};

export const getScrollOfScrollableElement = (element: ScrollableElement): {
  scrollLeft: number;
  scrollTop: number,
  scrollWidth: number,
  scrollHeight: number
} => {
  // Check if element is defined
  if (element !== undefined) {
    // Cast element to HTMLElement
    const htmlElement = element as HTMLElement;

    // Destructure properties from htmlElement and getTopScrollableElement
    const {
      scrollLeft: elementScrollLeft,
      clientLeft,
      scrollTop: elementScrollTop,
      clientTop,
      scrollWidth: elementScrollWidth,
      scrollHeight: elementScrollHeight
    } = htmlElement;
    const { scrollX, scrollY, innerWidth, innerHeight } = getTopScrollableElement();

    // Calculate scrollLeft and scrollTop
    const scrollLeft = (elementScrollLeft ?? scrollX) - (clientLeft || 0);
    const scrollTop = (elementScrollTop ?? scrollY) - (clientTop || 0);

    // Use scrollWidth and scrollHeight from element or fallback to innerWidth and innerHeight
    const scrollWidth = elementScrollWidth ?? innerWidth;
    const scrollHeight = elementScrollHeight ?? innerHeight;

    return { scrollLeft, scrollTop, scrollWidth, scrollHeight };
  } else {
    // If element is not defined, return zeros
    return { scrollLeft: 0, scrollTop: 0, scrollWidth: 0, scrollHeight: 0 };
  }
};

export const getSizeOfScrollableElement = (element: ScrollableElement): { width: number; height: number } => {
  // Check if element is defined
  if (element !== undefined) {
    // Cast element to HTMLElement
    const htmlElement = element as HTMLElement;

    // Destructure properties from htmlElement and getTopScrollableElement
    const {
      clientWidth: elementClientWidth,
      clientHeight: elementClientHeight
    } = htmlElement;
    const { innerWidth, innerHeight } = getTopScrollableElement();

    // Use clientWidth and clientHeight from element or fallback to innerWidth and innerHeight
    const width = elementClientWidth ?? innerWidth;
    const height = elementClientHeight ?? innerHeight;

    return { width, height };
  } else {
    // If element is not defined, return zeros
    return { width: 0, height: 0 };
  }
};

export const getTopScrollableElement = (): Window & typeof globalThis => {
  return window;
};
