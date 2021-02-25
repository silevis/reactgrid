import * as React from 'react';
import { GridRenderer } from './GridRenderer';
import { PanesRenderer } from './PanesRenderer';
import { handleStateUpdate } from '../Functions/handleStateUpdate';
import { getDerivedStateFromProps } from '../Functions/getDerivedStateFromProps';
import { notifyAboutReactGridPro } from '../Functions/notifyAboutReactGridPro';
import { componentDidUpdate } from '../Functions/componentDidUpdate';
import { EventHandlers } from '../Model/EventHandlers';
import { ReactGridProps } from '../Model/PublicModel';
import { defaultStateFields, State, StateUpdater } from '../Model/State';
import { PointerEventsController } from '../Model/PointerEventsController';
import { CellMatrixBuilder } from '../Model/CellMatrixBuilder';
import { LegacyBrowserGridRenderer } from './LegacyBrowserGridRenderer';
import { CellEditorRenderer, cellEditorCalculator } from './CellEditor';
import { CellRenderer } from './CellRenderer';
import { isMobileDevice } from '../Functions/isMobileDevice';


export class ReactGrid extends React.Component<ReactGridProps, State> {
    private updateState = (state: State) => this.setState(state);
    private stateUpdater: StateUpdater = modifier => handleStateUpdate(modifier(this.state), this.state, this.props, this.updateState);
    private pointerEventsController = new PointerEventsController(this.stateUpdater);
    private eventHandlers: EventHandlers = new EventHandlers(this.stateUpdater, this.pointerEventsController);
    private cellMatrixBuilder = new CellMatrixBuilder();
    state: State = {
        update: this.stateUpdater,
        cellMatrix: this.cellMatrixBuilder.setProps(this.props)
            .fillRowsAndCols()
            .setRangesToRenderLookup()
            .fillSticky()
            .fillScrollableRange()
            .setEdgeLocations()
            .getCellMatrix(),
        ...defaultStateFields
    }

    static getDerivedStateFromProps(props: ReactGridProps, state: State): State | undefined {
        try {
            return getDerivedStateFromProps(props, state);
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    componentDidUpdate(prevProps: ReactGridProps, prevState: State): void {
        componentDidUpdate(prevProps, prevState, this.state);
    }

    componentDidMount(): void {
        notifyAboutReactGridPro(this.state);
        window.addEventListener('resize', this.eventHandlers.windowResizeHandler);
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.eventHandlers.windowResizeHandler);
    }

    render(): React.ReactNode {
        const { state, eventHandlers } = this;
        if (state.legacyBrowserMode) {
            return <LegacyBrowserGridRenderer state={state} eventHandlers={eventHandlers} />
        } else {
            return (
                <GridRenderer state={state} eventHandlers={eventHandlers}>
                    <PanesRenderer state={state} cellRenderer={CellRenderer} />
                    {state.currentlyEditedCell && !isMobileDevice() &&
                        <CellEditorRenderer state={state} positionCalculator={cellEditorCalculator} />}
                </GridRenderer>
            )
        }
    }

}
