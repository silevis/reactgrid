import * as React from 'react';
import { State } from '../Model';
import { isBrowserSafari } from '../Functions/safari';
import { getScrollOfScrollableElement } from '../Functions';
import { getSizeOfElement, getReactGridOffsets, getVisibleSizeOfReactGrid } from '../Functions/elementSizeHelpers';

interface HiddenElementProps {
    state: State;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
}

export const HiddenElement: React.FunctionComponent<HiddenElementProps> = (props) => {
    let styles = {};
    if (isBrowserSafari() && props.state.scrollableElement && getSizeOfElement(props.state.scrollableElement).height !== props.state.cellMatrix.height) {
        const { left, top } = getReactGridOffsets(props.state);
        const { scrollTop, scrollLeft } = getScrollOfScrollableElement(props.state.scrollableElement);
        const { height, width } = getVisibleSizeOfReactGrid(props.state);
        styles = {
            position: 'absolute',
            height,
            width,
            zIndex: -1,
            top: scrollTop > top ? scrollTop - top : 0,
            left: scrollLeft > left ? scrollLeft - left : 0,
        }
    }

    return <input className="rg-hidden-element" style={styles} ref={props.hiddenElementRefHandler}
        inputMode="none" onBlur={e => !e.relatedTarget && props.state.hiddenFocusElement.focus()}
    />
}