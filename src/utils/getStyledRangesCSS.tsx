import { StyledRange, StyledRangesCSS } from "../types/PublicModel";
import { getNumericalRange } from "./getNumericalRange";
import { InternalStyledRange } from "../types/InternalModel";
import { createStyledRangesCSS } from "./createStyledRangesCSS";
import { ReactGridStore } from "../types/ReactGridStore.ts";


export function getStyledRangesCSS(store: ReactGridStore, styledRanges: StyledRange[]): StyledRangesCSS {
  const styledNumericalRanges: InternalStyledRange[] = styledRanges.map((styledRange) => {
    const { styles, range } = styledRange;
    const numericalRange = getNumericalRange(store, range);
    return { range: numericalRange, styles };
  });

  return createStyledRangesCSS(styledNumericalRanges);
}
