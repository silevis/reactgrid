import * as React from "react";
import { Range } from "../../core";
import { CellSelectionBehavior } from "../Behaviors/CellSelectionBehavior";
import { ProPaneContentChild } from "./HOCs";
import { FillHandle } from "./FillHandle";

export const FillHandleRenderer: React.FC<ProPaneContentChild> = ({
  state,
  calculatedRange,
}) => {
  return (
    <>
      {state.selectedRanges[state.activeSelectedRangeIdx] &&
        calculatedRange instanceof Range &&
        calculatedRange.contains(
          state.selectedRanges[state.activeSelectedRangeIdx].last
        ) &&
        state.enableFillHandle &&
        !state.currentlyEditedCell &&
        !(state.currentBehavior instanceof CellSelectionBehavior) && (
          <FillHandle
            state={state}
            location={state.selectedRanges[state.activeSelectedRangeIdx].last}
          />
        )}
    </>
  );
};
