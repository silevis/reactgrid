import { StyledRange } from "../types/PublicModel.ts";
import { getNumericalRange } from "./getNumericalRange.ts";
import { InternalStyledRange } from "../types/InternalModel.ts";
import { createStyledRangesCSS } from "./createStyledRangesCSS.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { Interpolation, Theme, css } from "@emotion/react";

export function getStyledRangesCSS(store: ReactGridStore, styledRanges: StyledRange[]): Interpolation<Theme> {
  const styledNumericalRanges: InternalStyledRange[] = styledRanges.map((styledRange) => {
    const { styles, range } = styledRange;
    const numericalRange = getNumericalRange(store, range);
    return { range: numericalRange, styles };
  });

  const selectorsWithStyles = createStyledRangesCSS(styledNumericalRanges);

  // cnvert the array of styles to a single object
  const stylesObject = selectorsWithStyles.reduce((acc, curr) => ({ ...acc, ...curr }), {});

  // convert the styles object to a string
  const stylesString = Object.entries(stylesObject)
    .map(([selector, styles]) => {
      const stylesString = Object.entries(styles)
        .map(([property, value]) => `${property}: ${value};`)
        .join(" ");

      return `${selector} { ${stylesString} }`;
    })
    .join(" ");

  return css`
    ${stylesString}
  `;
}
