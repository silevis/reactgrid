import * as React from 'react';
import { ReactGridProps, State } from '../Model';
export declare class ReactGrid extends React.Component<ReactGridProps, State> {
    private stateUpdater;
    private pointerEventsController;
    private eventHandlers;
    private cellMatrixBuilder;
    state: State;
    static getDerivedStateFromProps(props: ReactGridProps, state: State): State<import("../Model").CellMatrix<import("../Model").StickyRanges, import("../Model").CellMatrixProps>, import("../Model").Behavior>;
    componentDidUpdate(prevProps: ReactGridProps, prevState: State): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private handleStateUpdate;
}
