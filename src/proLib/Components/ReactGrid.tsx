import * as React from "react";
import { ReactGridProps } from "../../core";
import {
  GridRenderer,
  LegacyBrowserGridRenderer,
  StateModifier,
  defaultStateFields,
  MenuOption,
  CellEditorRenderer,
  handleStateUpdate,
  isMobileDevice,
} from "../../core";
import { cellEditorCalculator } from "../Functions/cellEditorCalculator";
import { ProPointerEventsController } from "../Model/ProPointerEventsController";
import { ProEventHandlers } from "../Model/ProEventHandlers";
import { getProDerivedStateFromProps } from "../Functions/getProDerivedStateFromProps";
import { PanesRenderer } from "./PanesRenderer";
import { ProDefaultBehavior } from "../Behaviors/ProDefaultBehavior";
import { ProCellMatrixBuilder } from "../Model/ProCellMatrixBuilder";
import { defaultProStateFields, ProState } from "../Model/ProState";
import { Line } from "./Line";
import { Shadow } from "./Shadow";
import { ContextMenu } from "./ContextMenu";
import { ProCellRenderer } from "./HOCs";
import { proComponentDidUpdate } from "../Functions/proComponentDidUpdate";
import { getSelectedLocations } from "../Functions/getSelectedLocations";

export class ReactGrid extends React.Component<ReactGridProps, ProState> {
  private updateState = (state: ProState) => this.setState(state);
  private stateUpdater = (modifier: StateModifier) =>
    handleStateUpdate(
      modifier(this.state) as ProState,
      this.state,
      this.props,
      this.updateState
    );
  private pointerEventsController = new ProPointerEventsController(
    this.stateUpdater
  );
  private eventHandlers = new ProEventHandlers(
    this.stateUpdater,
    this.pointerEventsController
  );
  private cellMatrixBuilder = new ProCellMatrixBuilder();
  state: ProState = {
    update: this.stateUpdater,
    ...defaultStateFields,
    currentBehavior: new ProDefaultBehavior(),
    cellMatrix: this.cellMatrixBuilder
      .setProps(this.props)
      .fillRowsAndCols()
      .setRangesToRenderLookup()
      .fillSticky()
      .fillScrollableRange()
      .setEdgeLocations()
      .getCellMatrix(),
    ...defaultProStateFields,
  };

  static getDerivedStateFromProps(
    props: ReactGridProps,
    state: ProState
  ): ProState | null {
    try {
      return getProDerivedStateFromProps(props, state);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  componentDidUpdate(prevProps: ReactGridProps, prevState: ProState): void {
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
