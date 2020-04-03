import { CellMatrix, Behavior, Range, Location, CellChange } from '.';
import { CellTemplates, Cell, ReactGridProps, Compatible, Highlight } from './PublicModel';
export declare type StateModifier = (state: State) => State;
export declare type StateUpdater = (modifier: StateModifier) => void;
export declare class State {
    update: StateUpdater;
    constructor(update: StateUpdater);
    readonly props: ReactGridProps;
    readonly legacyBrowserMode: boolean;
    readonly cellMatrix: CellMatrix;
    readonly currentBehavior: Behavior;
    readonly focusedLocation?: Location;
    readonly cellTemplates: CellTemplates;
    hiddenFocusElement: HTMLDivElement;
    readonly reactGridElement: HTMLDivElement;
    readonly scrollableElement: HTMLElement | (Window & typeof globalThis);
    readonly queuedCellChanges: CellChange[];
    currentlyEditedCell?: Compatible<Cell>;
    readonly disableFloatingCellEditor: boolean;
    readonly highlightLocations: Highlight[];
    readonly visibleRange: Range;
    readonly minScrollTop: number;
    readonly maxScrollTop: number;
    readonly minScrollLeft: number;
    readonly maxScrollLeft: number;
}
