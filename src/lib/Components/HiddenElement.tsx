import * as React from 'react';
import { State } from '../Model/State';

interface HiddenElementProps {
    state: State;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
}

export const HiddenElement: React.FC<HiddenElementProps> = ({ state, hiddenElementRefHandler }) => {
    return <input className='rg-hidden-element' ref={hiddenElementRefHandler} inputMode='none'
        onBlur={e => {
            if (!e.relatedTarget) { // prevents from losing focus on hidden element on mobile devices
                state.hiddenFocusElement?.focus({ preventScroll: true })
            }
        }} />
}
