import * as React from "react";
import { PaneContentChild, Range } from "../../core";
import { PartialArea } from "./PartialArea";

export const CutRanges: React.FC<PaneContentChild> = ({ state, calculatedRange }) => {
  return (
    <>
      {state.copyRange &&
        [state.copyRange].map((range: Range, i: number) => {
          return (
            <PartialArea
              key={i}
              pane={calculatedRange}
              range={range}
              className="rg-partial-area-cut-range"
              style={{}}
            />
          );
        })}
    </>
  );
};
