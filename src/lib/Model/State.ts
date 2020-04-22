import { Behavior, Range, Location, CellChange, AbstractCellMatrix } from '.';
import { CellTemplates, Cell, ReactGridProps, Compatible, Highlight } from './PublicModel';

export type StateModifier<S extends {} = State> = (state: S) => S;
export type StateUpdater = (modifier: StateModifier) => void;


export interface State<C extends {} = AbstractCellMatrix, B extends {} = Behavior> {
    update: StateUpdater;
    readonly props?: ReactGridProps;
    readonly legacyBrowserMode: boolean;
    readonly cellMatrix: C;
    readonly currentBehavior: B;
    readonly focusedLocation?: Location;

    readonly cellTemplates?: CellTemplates;
    hiddenFocusElement?: HTMLDivElement; // updated without setState
    readonly reactGridElement?: HTMLDivElement;
    readonly scrollableElement?: HTMLElement | (Window & typeof globalThis);

    readonly queuedCellChanges: CellChange[];
    currentlyEditedCell?: Compatible<Cell>;

    readonly disableFloatingCellEditor: boolean;
    readonly highlightLocations: Highlight[];

    // VISIBLE RANGE
    readonly visibleRange?: Range;

    // SCROLLSy
    readonly minScrollTop: number;
    readonly maxScrollTop: number;
    readonly minScrollLeft: number;
    readonly maxScrollLeft: number;

    // readonly [key: string]: any;
}

// export const st: State = {

// }

/* export class State<C extends {} = AbstractCellMatrix>{
    constructor(public update: StateUpdater) { }
    readonly props!: ReactGridProps;
    readonly legacyBrowserMode = isBrowserIE() || isBrowserEdge();
    readonly cellMatrix!: C;
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
    // readonly [key: string]: any; // replace with correct types
} */