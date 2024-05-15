import { NumericalRange } from "../../types/CellMatrix";
import { parseLocaleNumber } from "../../utils/parseLocaleNumber";

export const onFillHandle = (
  selectedArea: NumericalRange,
  fillRange: NumericalRange,
  setData: React.Dispatch<React.SetStateAction<any[][]>>
) => {
  setData((prev) => {
    const next = [...prev];

    for (let i = fillRange.startRowIdx; i < fillRange.endRowIdx; i++) {
      for (let j = fillRange.startColIdx; j < fillRange.endColIdx; j++) {
        if (next[i][j] === null) continue;
        const relativeRowIdx = i - fillRange.startRowIdx;
        const relativeColIdx = j - fillRange.startColIdx;

        if (selectedArea.startColIdx + relativeColIdx >= selectedArea.endColIdx) {
          const repeatIdx = relativeColIdx % (selectedArea.endColIdx - selectedArea.startColIdx);
          const newValue = prev[selectedArea.startRowIdx][selectedArea.startColIdx + repeatIdx];

          next[i][j] = {
            text: newValue?.number ? newValue.number.toString() : newValue?.text,
            number: newValue?.number ?? parseLocaleNumber(newValue?.text),
          };
        } else if (!next[selectedArea.startRowIdx + relativeRowIdx][selectedArea.startColIdx + relativeColIdx]) {
          const newValue = next[selectedArea.startRowIdx][selectedArea.startColIdx];

          next[i][j] = {
            text: newValue?.number ? newValue.number.toString() : newValue?.text,
            number: newValue?.number ?? parseLocaleNumber(newValue?.text),
          };
        } else {
          const newValue = prev[selectedArea.startRowIdx + relativeRowIdx][selectedArea.startColIdx + relativeColIdx];

          next[i][j] = {
            text: newValue?.number ? newValue.number.toString() : newValue?.text,
            number: newValue?.number ?? parseLocaleNumber(newValue?.text),
          };
        }
      }
    }
    return next;
  });
};
