import * as React from 'react';
import { Location } from '../Model';
interface CellFocusProps {
    location: Location;
    isHighlight?: boolean;
    borderColor?: string;
    className?: string;
}
export declare const CellFocus: React.FunctionComponent<CellFocusProps>;
export {};
