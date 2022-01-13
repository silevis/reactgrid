import * as React from "react";
import { Range } from "../../core";
import { ProCellSelectionBehavior } from "../Behaviors/ProCellSelectionBehavior";
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
        !(state.currentBehavior instanceof ProCellSelectionBehavior) && (
          <FillHandle
            state={state}
            location={state.selectedRanges[state.activeSelectedRangeIdx].last}
          />
        )}
    </>
  );
};
