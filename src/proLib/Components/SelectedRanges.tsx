import * as React from "react";
import { Range } from "../../core";
import { PartialArea } from "./PartialArea";
import { isRangeIntersects } from "../Functions/isRangeIntersectsWith";
import { ProPaneContentChild } from "./HOCs";

export const SelectedRanges: React.FC<ProPaneContentChild> = ({
  state,
  calculatedRange,
}) => {
  return (
    <>
      {state.selectedRanges.map(
        (range: Range, i: number) =>
          !(
            state.focusedLocation &&
            range.contains(state.focusedLocation) &&
            range.columns.length === 1 &&
            range.rows.length === 1
          ) &&
          calculatedRange &&
          isRangeIntersects(calculatedRange, range) && (
            <PartialArea
              key={i}
              pane={calculatedRange}
              range={range}
              className="rg-partial-area-selected-range"
              style={{}}
            />
          )
      )}
    </>
  );
};
