import * as React from 'react';
import { ReactGridProps, State, StateUpdater } from '../Model';
import { GridRenderer } from './GridRenderer';
import { LegacyBrowserGridRenderer } from './LegacyBrowserGridRenderer';
import { EventHandlers, } from '../Functions/EventHandlers';
import { getDerivedStateFromProps } from '../Functions/getDerivedStateFromProps';
import { notifyAboutReactGridPro } from '../Functions/notifyAboutReactGridPro';

export class ReactGrid extends React.Component<ReactGridProps, State> {
    private stateUpdater: StateUpdater = modifier => this.handleStateUpdate(modifier(this.state));
    private eventHandlers = new EventHandlers(this.stateUpdater);
    state = new State(this.stateUpdater);

    static getDerivedStateFromProps(props: ReactGridProps, state: State) {
        return getDerivedStateFromProps(props, state);
    }

    componentDidMount() {
        notifyAboutReactGridPro(this.state);
        window.addEventListener('resize', this.eventHandlers.windowResizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.eventHandlers.windowResizeHandler);
    }

    render() {
        const Grid = this.state.legacyBrowserMode ? LegacyBrowserGridRenderer : GridRenderer;
        return <Grid state={this.state} eventHandlers={this.eventHandlers} />;
    }

    private handleStateUpdate(state: State) {
        const changes = [...state.queuedCellChanges];
        if (changes.length > 0) {
            if (this.props.onCellsChanged) {
                this.props.onCellsChanged([...changes])
            };
            changes.forEach(() => state.queuedCellChanges.pop())
        }
        if (state !== this.state) {
            this.setState(state);
        }
    }
};
