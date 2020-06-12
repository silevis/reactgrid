import * as React from 'react';
import { ReactGridProps, State, StateUpdater, defaultStateFields } from '../Model';
import { CellMatrixBuilder } from '../Model/CellMatrixBuilder';
import { GridRenderer } from './GridRenderer';
import { PanesRenderer } from './PanesRenderer';
import { EventHandlers } from '../Model/EventHandlers';
import { getDerivedStateFromProps } from '../Functions/getDerivedStateFromProps';
import { PointerEventsController } from '../Model/PointerEventsController';
import { componentDidUpdate } from '../Functions/componentDidUpdate';
import { LegacyBrowserGridRenderer } from './LegacyBrowserGridRenderer';
import { CellEditorRenderer, cellEditorCalculator } from './CellEditor';
import { CellRenderer, } from './CellRenderer';
import { notifyAboutReactGridPro } from '../Functions/notifyAboutReactGridPro';

export class ReactGrid extends React.Component<ReactGridProps, State> {
    // private stateUpdater: StateUpdater<StateModifier<State<AbstractCellMatrix, Behavior>>> = modifier => this.handleStateUpdate(modifier(this.state));
    private stateUpdater: StateUpdater = modifier => this.handleStateUpdate(modifier(this.state));
    private pointerEventsController = new PointerEventsController(this.stateUpdater);
    private eventHandlers: EventHandlers = new EventHandlers(this.stateUpdater, this.pointerEventsController);
    private cellMatrixBuilder = new CellMatrixBuilder();
    state: State = { // should init state here instead in getDerivedStateFromProps ??
        update: this.stateUpdater,
        props: this.props,
        cellMatrix: this.cellMatrixBuilder.setProps(this.props).fillRowsAndCols().fillSticky().fillScrollableRange()
            .setEdgeLocations().getCellMatrix(),
        ...defaultStateFields
    }

    static getDerivedStateFromProps(props: ReactGridProps, state: State) {
        return getDerivedStateFromProps(props, state);
    }

    componentDidUpdate(prevProps: ReactGridProps, prevState: State) {
        componentDidUpdate(prevProps, prevState, this.state);
    }

    componentDidMount() {
        // notifyAboutReactGridPro(this.state);
        // window.addEventListener('resize', this.eventHandlers.windowResizeHandler);
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

    // TODO create function
    private handleStateUpdate(newState: State) {
        const changes = [...newState.queuedCellChanges];
        if (changes.length > 0) {
            if (this.props.onCellsChanged) {
                this.props.onCellsChanged([...changes]);
            };
            changes.forEach(() => newState.queuedCellChanges.pop());
        }
        if (newState !== this.state) {
            this.setState(newState);
        }
    }
};
