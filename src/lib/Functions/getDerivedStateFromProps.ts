import { State } from '../Model/State';
import { ReactGridProps, CellLocation } from '../Model/PublicModel';
import { CellMatrixBuilder } from '../Model/CellMatrixBuilder';
import { defaultCellTemplates } from './defaultCellTemplates';
import { focusLocation } from './focusLocation';
import { recalcVisibleRange } from './recalcVisibleRange';
import { updateResponsiveSticky } from './updateResponsiveSticky';
import { updateSelectedColumns, updateSelectedRows } from './updateState';
import { resetSelection } from './selectRange';

// TODO: rewrite without division
export function getDerivedStateFromProps(
    props: ReactGridProps,
    state: State
  ): State {
    const stateDeriverWithProps = stateDeriver(props);
  
    const hasHighlightsChanged = highlightsHasChanged(props, state);
  
    if (hasHighlightsChanged) {
      state = stateDeriverWithProps(state)(appendHighlights);
    }
    state = stateDeriverWithProps(state)(updateStateProps);
  
    state = stateDeriverWithProps(state)(appendCellTemplates);

    state = stateDeriverWithProps(state)(appendGroupIdRender);
  
    const hasChanged = dataHasChanged(props, state);
  
    state = stateDeriverWithProps(state)(updateResponsiveSticky)
    
    state = stateDeriverWithProps(state)(disableVirtualScrolling)
  
    if (hasChanged) {
      state = stateDeriverWithProps(state)(updateCellMatrix);
    }
  
    state = stateDeriverWithProps(state)(updateSelections);
  
    state = stateDeriverWithProps(state)(updateFocusedLocation);
  
    if (hasChanged) {
      state = stateDeriverWithProps(state)(updateVisibleRange);
    }

    state = stateDeriverWithProps(state)(setInitialFocusLocation);
  
    if (areFocusesDiff(props, state)) {
      state = stateDeriverWithProps(state)(setFocusLocation);
    }
  
    state = stateDeriverWithProps(state)(appendStateFields);
  
    return state;
}

function updateSelections(props: ReactGridProps, state: State): State {
    if (state.selectionMode === "row" && state.selectedIds.length > 0) {
      state = updateSelectedRows(state);
    } else if (state.selectionMode === "column" && state.selectedIds.length > 0) {
      state = updateSelectedColumns(state);
    } else {
      state = {
        ...state,
        selectedRanges: [...state.selectedRanges].map((range) =>
          state.cellMatrix.validateRange(range)
        ),
      };
    }
    return state;
  }

function appendStateFields(
    props: ReactGridProps,
    state: State
  ): State {
    return {
      ...state,
      enableFillHandle: !!props.enableFillHandle,
      enableRangeSelection: !!props.enableRangeSelection,
      enableColumnSelection: !!props.enableColumnSelection,
      enableRowSelection: !!props.enableRowSelection,
    };
  }
  

export const areFocusesDiff = (props: ReactGridProps, state: State): boolean => {
    return props.focusLocation?.columnId !== state.focusedLocation?.column.columnId
        || props.focusLocation?.rowId !== state.focusedLocation?.row.rowId
        || (props.stickyRightColumns !== undefined && props.stickyRightColumns !== state.rightStickyColumns) 
        || (props.stickyBottomRows !== undefined && props.stickyBottomRows !== state.bottomStickyRows);
}

export const stateDeriver = (props: ReactGridProps) => (state: State) => (fn: (props: ReactGridProps, state: State) => State): State => fn(props, state);

export const dataHasChanged = (props: ReactGridProps, state: State): boolean => !state.cellMatrix || props !== state.cellMatrix.props
    || (props.stickyLeftColumns !== undefined && props.stickyLeftColumns !== state.leftStickyColumns)
    || (props.stickyTopRows !== undefined && props.stickyTopRows !== state.topStickyRows)
    || (props.stickyBottomRows !== undefined && props.stickyBottomRows !== state.bottomStickyRows)
    || (props.stickyRightColumns !== undefined && props.stickyRightColumns !== state.rightStickyColumns);

export const highlightsHasChanged = (props: ReactGridProps, state: State): boolean => props.highlights !== state.props?.highlights;

export function updateStateProps(props: ReactGridProps, state: State): State {
    if (state.props !== props) {
        state = { ...state, props };
    }
    return state;
}

function updateCellMatrix(props: ReactGridProps, state: State): State {
    const builder = new CellMatrixBuilder();
    return {
        ...state,
        cellMatrix: builder
          .setProps(props)
          .fillRowsAndCols({
            leftStickyColumns: state.leftStickyColumns || 0,
            topStickyRows: state.topStickyRows || 0,
            rightStickyColumns: state.rightStickyColumns || 0,
            bottomStickyRows: state.bottomStickyRows || 0,
          })
          .setRangesToRenderLookup()
          .fillSticky({
            leftStickyColumns: state.leftStickyColumns || 0,
            topStickyRows: state.topStickyRows || 0,
            rightStickyColumns: state.rightStickyColumns || 0,
            bottomStickyRows: state.bottomStickyRows || 0,
          })
          .fillScrollableRange({
            leftStickyColumns: state.leftStickyColumns || 0,
            topStickyRows: state.topStickyRows || 0,
            rightStickyColumns: state.rightStickyColumns || 0,
            bottomStickyRows: state.bottomStickyRows || 0,
          })
          .setEdgeLocations()
          .getCellMatrix(),
      };
}

export function updateFocusedLocation(props: ReactGridProps, state: State): State {
    if (state.cellMatrix.columns.length > 0 && state.focusedLocation && !state.currentlyEditedCell) {
        state = { ...state, focusedLocation: state.cellMatrix.validateLocation(state.focusedLocation) };
    }
    return state;
}

function updateVisibleRange(props: ReactGridProps, state: State): State {
    if (state.visibleRange) {
        state = recalcVisibleRange(state);
    }
    return state;
}

export function appendCellTemplates(props: ReactGridProps, state: State): State {
    return {
        ...state,
        cellTemplates: { ...defaultCellTemplates, ...props.customCellTemplates }
    }
}

export function appendGroupIdRender(props: ReactGridProps, state: State): State {
    return {
        ...state,
        enableGroupIdRender: !!props.enableGroupIdRender
    }
}

function disableVirtualScrolling(props: ReactGridProps, state: State): State {
  return {
      ...state,
      disableVirtualScrolling: !!props.disableVirtualScrolling
  }
}

export function appendHighlights(props: ReactGridProps, state: State): State {
    const highlights = props.highlights?.filter(highlight => state.cellMatrix.rowIndexLookup[highlight.rowId] !== undefined &&
        state.cellMatrix.columnIndexLookup[highlight.columnId] !== undefined
    );
    if (highlights?.length !== props.highlights?.length) {
        console.error('Data inconsistency in ReactGrid "highlights" prop');
    }
    return {
        ...state,
        highlightLocations: highlights || [],
    }
}

export function setInitialFocusLocation(props: ReactGridProps, state: State): State {
    const locationToFocus = props.initialFocusLocation;
    const wasFocused = !!state.focusedLocation;

    if (locationToFocus && !state.focusedLocation) {
        if (isLocationToFocusCorrect(state, locationToFocus)) {
            console.error('Data inconsistency in ReactGrid "initialFocusLocation" prop');
        } else {
            const location = state.cellMatrix.getLocationById(locationToFocus.rowId, locationToFocus.columnId);
            state =  focusLocation(state, location);
        }
    }

    const location = state.focusedLocation;

    if (!wasFocused && location) {
        state = resetSelection(state, location);
    }

    return state;
}

export function setFocusLocation(props: ReactGridProps, state: State): State {
    const locationToFocus = props.focusLocation;
    const wasFocused = !!state.focusedLocation;

    if (locationToFocus) {
        if (isLocationToFocusCorrect(state, locationToFocus)) {
            console.error('Data inconsistency in ReactGrid "focusLocation" prop');
        } else {
            const location = state.cellMatrix.getLocationById(locationToFocus.rowId, locationToFocus.columnId);
            state = focusLocation(state, location)
        }
    }

    const location = state.focusedLocation;

    if (!wasFocused && location && props.focusLocation && state.selectedRanges.length <= 1) {
        state = resetSelection(state, location);
    }
    
    return state;
}

function isLocationToFocusCorrect(state: State, location: CellLocation) {
    return !(state.cellMatrix.columnIndexLookup[location.columnId] !== undefined)
        || !(state.cellMatrix.rowIndexLookup[location.rowId] !== undefined)
}
