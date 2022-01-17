export const x = 1;
// import {
//   ReactGridProps,
//   stateDeriver,
//   updateStateProps,
//   updateFocusedLocation,
//   setFocusLocation,
//   appendCellTemplates,
//   setInitialFocusLocation,
//   areFocusesDiff,
//   highlightsHasChanged,
//   appendHighlights,
//   appendGroupIdRender,
//   dataHasChanged,
// } from "../../core";
// import { ProState } from "../Model/ProState";
// import { updateSelectedRows, updateSelectedColumns } from "./updateState";
// import { proRecalcVisibleRange } from "./proRecalcVisibleRange";
// import { ProCellMatrixBuilder } from "../Model/ProCellMatrixBuilder";
// import { resetSelection } from "./selectRange";
// import { proUpdateResponsiveSticky } from "./proUpdateResponsiveSticky";

// export function getProDerivedStateFromProps(
//   props: ReactGridProps,
//   state: ProState
// ): ProState {
//   const stateDeriverWithProps = stateDeriver(props);

//   const hasHighlightsChanged = highlightsHasChanged(props, state);

//   if (hasHighlightsChanged) {
//     state = stateDeriverWithProps(state)(appendHighlights) as ProState;
//   }
//   state = stateDeriverWithProps(state)(updateStateProps) as ProState;

//   state = stateDeriverWithProps(state)(appendCellTemplates) as ProState;

//   state = stateDeriverWithProps(state)(appendGroupIdRender) as ProState;

//   const hasChanged = dataHasChangedPro(props, state);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   state = stateDeriverWithProps(state)(
//     proUpdateResponsiveSticky as any
//   ) as ProState;

//   if (hasChanged) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     state = stateDeriverWithProps(state)(
//       updateProCellMatrix as any
//     ) as ProState;
//   }

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   state = stateDeriverWithProps(state)(updateSelections as any) as ProState;

//   state = stateDeriverWithProps(state)(updateFocusedLocation) as ProState;

//   if (hasChanged) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     state = stateDeriverWithProps(state)(
//       proUpdateVisibleRange as any
//     ) as ProState;
//   }
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   state = stateDeriverWithProps(state)(
//     proSetInitialFocusLocation as any
//   ) as ProState;

//   if (areFocusesDiff(props, state)) {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     state = stateDeriverWithProps(state)(
//       proSetFocusLocation as any
//     ) as ProState;
//   }

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   state = stateDeriverWithProps(state)(appendProStateFields as any) as ProState;

//   return state;
// }

// function updateProCellMatrix(props: ReactGridProps, state: ProState): ProState {
//   const builder = new ProCellMatrixBuilder();
//   return {
//     ...state,
//     cellMatrix: builder
//       .setProps(props)
//       .fillRowsAndCols({
//         leftStickyColumns: state.leftStickyColumns || 0,
//         topStickyRows: state.topStickyRows || 0,
//         rightStickyColumns: state.rightStickyColumns || 0,
//         bottomStickyRows: state.bottomStickyRows || 0,
//       })
//       .setRangesToRenderLookup()
//       .fillSticky({
//         leftStickyColumns: state.leftStickyColumns || 0,
//         topStickyRows: state.topStickyRows || 0,
//         rightStickyColumns: state.rightStickyColumns || 0,
//         bottomStickyRows: state.bottomStickyRows || 0,
//       })
//       .fillScrollableRange({
//         leftStickyColumns: state.leftStickyColumns || 0,
//         topStickyRows: state.topStickyRows || 0,
//         rightStickyColumns: state.rightStickyColumns || 0,
//         bottomStickyRows: state.bottomStickyRows || 0,
//       })
//       .setEdgeLocations()
//       .getCellMatrix(),
//   };
// }

// function appendProStateFields(
//   props: ReactGridProps,
//   state: ProState
// ): ProState {
//   return {
//     ...state,
//     enableFillHandle: !!props.enableFillHandle,
//     enableRangeSelection: !!props.enableRangeSelection,
//     enableColumnSelection: !!props.enableColumnSelection,
//     enableRowSelection: !!props.enableRowSelection,
//   };
// }

// const dataHasChangedPro = (props: ReactGridProps, state: ProState) =>
//   dataHasChanged(props, state) ||
//   (props.stickyRightColumns !== undefined &&
//     props.stickyRightColumns !== state.rightStickyColumns) ||
//   (props.stickyBottomRows !== undefined &&
//     props.stickyBottomRows !== state.bottomStickyRows);

// function updateSelections(props: ReactGridProps, state: ProState): ProState {
//   if (state.selectionMode === "row" && state.selectedIds.length > 0) {
//     state = updateSelectedRows(state);
//   } else if (state.selectionMode === "column" && state.selectedIds.length > 0) {
//     state = updateSelectedColumns(state);
//   } else {
//     state = {
//       ...state,
//       selectedRanges: [...state.selectedRanges].map((range) =>
//         state.cellMatrix.validateRange(range)
//       ),
//     };
//   }
//   return state;
// }

// export function proUpdateVisibleRange(
//   props: ReactGridProps,
//   state: ProState
// ): ProState {
//   if (state.visibleRange) {
//     state = proRecalcVisibleRange(state);
//   }
//   return state;
// }

// export function proSetInitialFocusLocation(
//   props: ReactGridProps,
//   state: ProState
// ): ProState {
//   const wasFocused = !!state.focusedLocation;
//   state = setInitialFocusLocation(props, state) as ProState;
//   const location = state.focusedLocation;
//   if (!wasFocused && location) {
//     state = resetSelection(state, location);
//   }
//   return state;
// }

// export function proSetFocusLocation(
//   props: ReactGridProps,
//   state: ProState
// ): ProState {
//   const wasFocused = !!state.focusedLocation;
//   state = setFocusLocation(props, state) as ProState;
//   const location = state.focusedLocation;
//   if (
//     !wasFocused &&
//     location &&
//     props.focusLocation &&
//     state.selectedRanges.length <= 1
//   ) {
//     state = resetSelection(state, location);
//   }
//   return state;
// }
