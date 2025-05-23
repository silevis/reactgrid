import { CellTemplates, Cell, ReactGridProps, Compatible, Highlight, CellChange, Id, SelectionMode } from './PublicModel';
import { DefaultBehavior } from '../Behaviors/DefaultBehavior';
import { CellMatrix } from './CellMatrix';
import { Behavior } from './Behavior';
import { Location, Orientation } from './InternalModel';
import { Range } from './Range';
export type StateModifier<TState extends State = State> = (state: TState) => TState;
export type StateUpdater = (modifier: StateModifier) => void;
export interface State<TCellMatrix extends CellMatrix = CellMatrix, TBehavior extends Behavior = Behavior> {
    update: StateUpdater;
    readonly props?: ReactGridProps;
    readonly legacyBrowserMode: boolean;
    readonly cellMatrix: TCellMatrix;
    readonly currentBehavior: TBehavior;
    readonly focusedLocation?: Location;
    readonly cellTemplates: CellTemplates;
    hiddenFocusElement?: HTMLDivElement;
    readonly reactGridElement?: HTMLDivElement;
    readonly scrollableElement?: HTMLElement | (Window & typeof globalThis);
    readonly queuedCellChanges: CellChange[];
    currentlyEditedCell?: Compatible<Cell>;
    readonly highlightLocations: Highlight[];
    readonly visibleRange?: Range;
    readonly leftStickyColumns?: number;
    readonly topStickyRows?: number;
    readonly topScrollBoudary: number;
    readonly bottomScrollBoudary: number;
    readonly leftScrollBoudary: number;
    readonly rightScrollBoudary: number;
    readonly enableGroupIdRender: boolean;
    readonly enableFillHandle: boolean;
    readonly enableRangeSelection: boolean;
    readonly enableColumnSelection: boolean;
    readonly enableRowSelection: boolean;
    readonly disableVirtualScrolling: boolean;
    readonly contextMenuPosition: {
        top: number;
        left: number;
    };
    readonly lineOrientation: Orientation;
    readonly linePosition: number;
    readonly shadowSize: number;
    readonly shadowPosition: number;
    readonly shadowCursor: string;
    readonly selectionMode: SelectionMode;
    readonly selectedRanges: Range[];
    readonly selectedIndexes: number[];
    readonly selectedIds: Id[];
    readonly activeSelectedRangeIdx: number;
    readonly copyRange?: Range;
    readonly rightStickyColumns: number | undefined;
    readonly bottomStickyRows: number | undefined;
}
export declare const defaultStateFields: {
    legacyBrowserMode: boolean;
    focusedLocation: undefined;
    currentBehavior: DefaultBehavior;
    cellTemplates: CellTemplates;
    hiddenFocusElement: undefined;
    reactGridElement: undefined;
    scrollableElement: undefined;
    queuedCellChanges: never[];
    currentlyEditedCell: undefined;
    highlightLocations: never[];
    visibleRange: undefined;
    topScrollBoudary: number;
    bottomScrollBoudary: number;
    leftScrollBoudary: number;
    rightScrollBoudary: number;
    enableGroupIdRender: boolean;
    leftStickyColumns: undefined;
    topStickyRows: undefined;
    enableFillHandle: boolean;
    enableRangeSelection: boolean;
    enableColumnSelection: boolean;
    enableRowSelection: boolean;
    contextMenuPosition: {
        top: number;
        left: number;
    };
    lineOrientation: Orientation;
    linePosition: number;
    shadowSize: number;
    shadowPosition: number;
    shadowCursor: string;
    selectionMode: SelectionMode;
    selectedRanges: never[];
    selectedIndexes: never[];
    selectedIds: never[];
    activeSelectedRangeIdx: number;
    copyRange: undefined;
    rightStickyColumns: undefined;
    bottomStickyRows: undefined;
    disableVirtualScrolling: boolean;
};
