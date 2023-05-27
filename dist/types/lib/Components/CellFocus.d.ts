import * as React from 'react';
import { Location } from '../Model/InternalModel';
import { State } from '../Model/State';
interface FeaturedCellProps {
    location: Location;
    state?: State;
    borderColor?: string;
    className?: string;
}
export declare const CellHighlight: React.FC<FeaturedCellProps>;
export declare const CellFocus: React.FC<FeaturedCellProps>;
export {};
