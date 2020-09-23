import * as React from 'react';

interface HiddenElementProps {
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
}

export const HiddenElement: React.FC<HiddenElementProps> = ({ hiddenElementRefHandler }) => {
    return <input className='rg-hidden-element' ref={hiddenElementRefHandler} inputMode='none' />
}