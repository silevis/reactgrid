import { ReactGridProps, State } from '../Model';
export declare function getDerivedStateFromProps(props: ReactGridProps, state: State): State;
export declare const stateDeriver: (props: ReactGridProps) => (state: State<import("../Model").CellMatrix<import("../Model").StickyRanges, import("../Model").CellMatrixProps>, import("../Model").Behavior>) => (fn: (props: ReactGridProps, state: State<import("../Model").CellMatrix<import("../Model").StickyRanges, import("../Model").CellMatrixProps>, import("../Model").Behavior>) => State<import("../Model").CellMatrix<import("../Model").StickyRanges, import("../Model").CellMatrixProps>, import("../Model").Behavior>) => State<import("../Model").CellMatrix<import("../Model").StickyRanges, import("../Model").CellMatrixProps>, import("../Model").Behavior>;
export declare const dataHasChanged: (props: ReactGridProps, state: State<import("../Model").CellMatrix<import("../Model").StickyRanges, import("../Model").CellMatrixProps>, import("../Model").Behavior>) => boolean;
export declare function updateStateProps(props: ReactGridProps, state: State): State;
export declare function updateFocusedLocation(props: ReactGridProps, state: State): State;
export declare function appendCellTamplatesAndHighlights(props: ReactGridProps, state: State): State;
export declare function setInitialFocusLocation(props: ReactGridProps, state: State): State;
