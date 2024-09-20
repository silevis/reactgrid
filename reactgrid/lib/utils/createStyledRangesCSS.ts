import { InternalStyledRange, StyledRangesCSS } from "../types/InternalModel";

export function createStyledRangesCSS(styledRanges: InternalStyledRange[]): StyledRangesCSS {
  const selectorsWithStyles = styledRanges.map((styledRange) => {
    const classNames: string[] = [];

    const { range, styles } = styledRange;

    for (let rowIndex = range.startRowIdx; rowIndex < range.endRowIdx; rowIndex++) {
      for (let colIndex = range.startColIdx; colIndex < range.endColIdx; colIndex++) {
        classNames.push(`.rgRowIdx-${rowIndex}.rgColIdx-${colIndex}`);
      }
    }

    const selector = classNames.join(", ");

    return { [`${selector}`]: styles };
  });

  return selectorsWithStyles;
}
