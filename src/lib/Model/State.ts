import { CellMatrix, Behavior, Range, Location, CellChange } from '.';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
import { CellTemplates, Cell, ReactGridProps, Compatible, Highlight } from './PublicModel';
import { isBrowserIE, isBrowserEdge } from '../Functions';

export type StateModifier = (state: State) => State;
export type StateUpdater = (modifier: StateModifier) => void;

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// INTERNAL
export class State {
    constructor(public update: StateUpdater) { }
    readonly props!: ReactGridProps;
    readonly legacyBrowserMode = isBrowserIE() || isBrowserEdge();
    readonly cellMatrix!: CellMatrix;
    readonly currentBehavior: Behavior = new DefaultBehavior();
    readonly focusedLocation?: Location;

    readonly cellTemplates!: CellTemplates;
    hiddenFocusElement!: HTMLDivElement; // updated without setState
    readonly reactGridElement!: HTMLDivElement;
    readonly scrollableElement!: HTMLElement | (Window & typeof globalThis);

    readonly queuedCellChanges: CellChange[] = [];
    currentlyEditedCell?: Compatible<Cell>;

    readonly disableFloatingCellEditor: boolean = false;
    readonly highlightLocations: Highlight[] = [];

    // VISIBLE RANGE
    readonly visibleRange!: Range;

    // SCROLLS
    readonly minScrollTop: number = -1;
    readonly maxScrollTop: number = -1;
    readonly minScrollLeft: number = -1;
    readonly maxScrollLeft: number = -1;
}