import { Direction, Location } from './../Model/InternalModel';
import { State } from './../Model/State';
import { ReactGridProps } from './../Model/PublicModel';
export declare function componentDidUpdate(prevProps: ReactGridProps, prevState: State, state: State): void;
export declare function scrollCalculator(state: State, location: Location, direction?: Direction): {
    top: number;
    left: number;
};
export declare function getScrollTop(state: State, location: Location, dontChange: boolean): number;
export declare function getScrollLeft(state: State, location: Location, dontChange: boolean): number;
