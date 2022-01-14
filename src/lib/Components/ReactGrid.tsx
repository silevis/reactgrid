import * as React from "react";
import { ReactGridProps } from "../../core";
import {
  GridRenderer,
  LegacyBrowserGridRenderer,
  StateModifier,
  MenuOption,
  CellEditorRenderer,
  handleStateUpdate,
  isMobileDevice,
} from "../../core";
import { cellEditorCalculator } from "../Functions/cellEditorCalculator";
import { PointerEventsController } from "../Model/PointerEventsController";
import { EventHandlers } from "../Model/EventHandlers";
import { getProDerivedStateFromProps } from "../Functions/getProDerivedStateFromProps";
import { PanesRenderer } from "./PanesRenderer";
import { DefaultBehavior } from "../Behaviors/DefaultBehavior";
import { CellMatrixBuilder } from "../Model/CellMatrixBuilder";
import { defaultStateFields, State } from "../Model/State";
import { Line } from "./Line";
import { Shadow } from "./Shadow";
import { ContextMenu } from "./ContextMenu";
import { ProCellRenderer } from "./HOCs";
import { proComponentDidUpdate } from "../Functions/proComponentDidUpdate";
import { getSelectedLocations } from "../Functions/getSelectedLocations";

export class ReactGrid extends React.Component<ReactGridProps, State> {
  private updateState = (state: State) => this.setState(state);
  private stateUpdater = (modifier: StateModifier) =>
    handleStateUpdate(
      modifier(this.state) as State,
      this.state,
      this.props,
      this.updateState
    );
  private pointerEventsController = new PointerEventsController(
    this.stateUpdater
  );
  private eventHandlers = new EventHandlers(
    this.stateUpdater,
    this.pointerEventsController
  );
  private cellMatrixBuilder = new CellMatrixBuilder();
  state: State = {
    update: this.stateUpdater,
    ...defaultStateFields,
    currentBehavior: new DefaultBehavior(),
    cellMatrix: this.cellMatrixBuilder
      .setProps(this.props)
      .fillRowsAndCols()
      .setRangesToRenderLookup()
      .fillSticky()
      .fillScrollableRange()
      .setEdgeLocations()
      .getCellMatrix(),
  };

  static getDerivedStateFromProps(
    props: ReactGridProps,
    state: State
  ): State | null {
    try {
      return getProDerivedStateFromProps(props, state);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  componentDidUpdate(prevProps: ReactGridProps, prevState: State): void {
    if (!prevState.reactGridElement && this.state.reactGridElement) {
      this.state.scrollableElement?.addEventListener(
        "scroll",
        this.eventHandlers.scrollHandler
      );
    }
    proComponentDidUpdate(prevProps, prevState, this.state);
  }

  componentDidMount(): void {
    window.addEventListener("resize", this.eventHandlers.windowResizeHandler);
  }

  componentWillUnmount(): void {
    window.removeEventListener(
      "resize",
      this.eventHandlers.windowResizeHandler
    );
    this.state.scrollableElement?.removeEventListener(
      "scroll",
      this.eventHandlers.scrollHandler
    );
  }

  render(): React.ReactNode {
    const { state, eventHandlers } = this;

    if (state.legacyBrowserMode) {
      return (
        <LegacyBrowserGridRenderer
          state={state}
          eventHandlers={eventHandlers}
        />
      );
    } else {
      return (
        <GridRenderer state={state} eventHandlers={eventHandlers}>
          <PanesRenderer state={state} cellRenderer={ProCellRenderer} />
          <Line
            linePosition={state.linePosition}
            orientation={state.lineOrientation}
            cellMatrix={state.cellMatrix}
          />
          <Shadow
            shadowPosition={state.shadowPosition}
            orientation={state.lineOrientation}
            cellMatrix={state.cellMatrix}
            shadowSize={state.shadowSize}
            cursor={state.shadowCursor}
          />
          {state.contextMenuPosition.top !== -1 &&
            state.contextMenuPosition.left !== -1 && (
              <ContextMenu
                state={state}
                onContextMenu={(menuOptions: MenuOption[]) =>
                  state.props?.onContextMenu
                    ? state.props.onContextMenu(
                        state.selectionMode === "row" ? state.selectedIds : [],
                        state.selectionMode === "column"
                          ? state.selectedIds
                          : [],
                        state.selectionMode,
                        menuOptions,
                        getSelectedLocations(state)
                      )
                    : []
                }
              />
            )}
          {!isMobileDevice() && state.currentlyEditedCell && (
            <CellEditorRenderer
              state={state}
              positionCalculator={cellEditorCalculator}
            />
          )}
        </GridRenderer>
      );
    }
  }
}
