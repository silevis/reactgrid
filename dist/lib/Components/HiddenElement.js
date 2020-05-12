import * as React from 'react';
import { isBrowserSafari } from '../Functions/safari';
import { getScrollOfScrollableElement } from '../Functions/scrollHelpers';
import { getSizeOfElement, getReactGridOffsets, getVisibleSizeOfReactGrid } from '../Functions/elementSizeHelpers';
export var HiddenElement = function (props) {
    var state = props.state, hiddenElementRefHandler = props.hiddenElementRefHandler;
    var styles = {};
    if (isBrowserSafari() && state.scrollableElement && getSizeOfElement(state.scrollableElement).height !== state.cellMatrix.height) {
        var _a = getReactGridOffsets(state), left = _a.left, top_1 = _a.top;
        var _b = getScrollOfScrollableElement(state.scrollableElement), scrollTop = _b.scrollTop, scrollLeft = _b.scrollLeft;
        var _c = getVisibleSizeOfReactGrid(state), height = _c.height, width = _c.width;
        styles = {
            position: 'absolute',
            height: height,
            width: width,
            zIndex: -1,
            top: scrollTop > top_1 ? scrollTop - top_1 : 0,
            left: scrollLeft > left ? scrollLeft - left : 0,
        };
    }
    return React.createElement("input", { className: "rg-hidden-element", style: styles, ref: hiddenElementRefHandler, inputMode: "none" });
};
