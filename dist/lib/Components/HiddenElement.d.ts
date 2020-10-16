import * as React from 'react';
import { State } from '../Model/State';
interface HiddenElementProps {
    state: State;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
}
export declare const HiddenElement: React.FC<HiddenElementProps>;
export {};
