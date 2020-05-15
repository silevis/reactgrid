import * as React from 'react';
import { State } from '../Model';
import { isBrowserSafari } from '../Functions/safari';
import { getScrollOfScrollableElement } from '../Functions/scrollHelpers';
import { getSizeOfElement, getReactGridOffsets_DEPRECATED, getVisibleSizeOfReactGrid } from '../Functions/elementSizeHelpers';

interface HiddenElementProps {
    state: State;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
}

export const HiddenElement: React.FunctionComponent<HiddenElementProps> = props => {
    const { state, hiddenElementRefHandler } = props;
    let styles = {};
    if (isBrowserSafari() && state.scrollableElement && getSizeOfElement(state.scrollableElement).height !== state.cellMatrix.height) {
        const { left, top } = getReactGridOffsets_DEPRECATED(state);
        const { scrollTop, scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
        const { height, width } = getVisibleSizeOfReactGrid(state);
        styles = {
            position: 'absolute',
            height,
            width,
            zIndex: -1,
            top: scrollTop > top ? scrollTop - top : 0,
            left: scrollLeft > left ? scrollLeft - left : 0,
        }
    }

    return <input className="rg-hidden-element" style={styles} ref={hiddenElementRefHandler}
        inputMode="none"
    // onBlur={e => !e.relatedTarget && state.hiddenFocusElement?.focus()}
    />
}