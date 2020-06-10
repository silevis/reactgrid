import * as React from 'react';
import { State } from '../Model';
interface HiddenElementProps {
    state: State;
    hiddenElementRefHandler: (hiddenFocusElement: HTMLInputElement) => void;
}
export declare const HiddenElement: React.FunctionComponent<HiddenElementProps>;
export {};
