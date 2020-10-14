import * as React from 'react';
import {
    ReactGridProps, State, StateUpdater, defaultStateFields, CellMatrixBuilder, PointerEventsController, EventHandlers
} from '../Model';
import { GridRenderer } from './GridRenderer';
import { PanesRenderer } from './PanesRenderer';
import {
    getDerivedStateFromProps, componentDidUpdate, notifyAboutReactGridPro, handleStateUpdate
} from '../Functions';
import { LegacyBrowserGridRenderer } from './LegacyBrowserGridRenderer';
import { CellEditorRenderer, cellEditorCalculator } from './CellEditor';
import { CellRenderer } from './CellRenderer';


export class ReactGrid extends React.Component<ReactGridProps, State> {
    private updateState = (state: State) => this.setState(state);
    private stateUpdater: StateUpdater = modifier => handleStateUpdate(modifier(this.state), this.state, this.props, this.updateState);
    private pointerEventsController = new PointerEventsController(this.stateUpdater);
    private eventHandlers: EventHandlers = new EventHandlers(this.stateUpdater, this.pointerEventsController);
    private cellMatrixBuilder = new CellMatrixBuilder();
    state: State = {
        update: this.stateUpdater,
        cellMatrix: this.cellMatrixBuilder.setProps(this.props).fillRowsAndCols().fillSticky().fillScrollableRange()
            .setEdgeLocations().getCellMatrix(),
        ...defaultStateFields
    }

    static getDerivedStateFromProps(props: ReactGridProps, state: State) {
        try {
            return getDerivedStateFromProps(props, state);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    componentDidUpdate(prevProps: ReactGridProps, prevState: State) {
        componentDidUpdate(prevProps, prevState, this.state);
    }

    componentDidMount() {
        notifyAboutReactGridPro(this.state);
        window.addEventListener('resize', this.eventHandlers.windowResizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.eventHandlers.windowResizeHandler);
    }

    render() {
        const { state, eventHandlers } = this;
        if (state.legacyBrowserMode) {
            return <LegacyBrowserGridRenderer state={state} eventHandlers={eventHandlers} />
        } else {
            return (
                <GridRenderer state={state} eventHandlers={eventHandlers}>
                    <PanesRenderer state={state} cellRenderer={CellRenderer} />
                    {state.currentlyEditedCell && <CellEditorRenderer state={state} positionCalculator={cellEditorCalculator} />}
                </GridRenderer>
            )
        }
    }

};
