import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import ReactGrid from "../ReactGrid";
import { ErrorBoundary } from "../components/ErrorBoundary";
import TextCell from "../components/cellTemplates/TextCell";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";
import NumberCell from "../components/cellTemplates/NumberCell";
import { NumericalRange } from "../types/CellMatrix";
import { parseLocaleNumber } from "../utils/parseLocaleNumber";
import { HeaderCell } from "../components/cellTemplates/HeaderCell";
import DateCell from "../components/cellTemplates/DateCell";

const styledRanges = [
  {
    range: { start: { rowId: "0", columnId: "5" }, end: { rowId: "14", columnId: "12" } },
    styles: { background: "red", color: "yellow" },
  },
  {
    range: { start: { rowId: "7", columnId: "10" }, end: { rowId: "10", columnId: "14" } },
    styles: { background: "green", color: "purple" },
  },
];

const onFillHandle = (
  selectedArea: NumericalRange,
  fillRange: NumericalRange,
  setData: React.Dispatch<React.SetStateAction<(CellData | null)[][]>>
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

const onPasteHandler = <T,>(
  selectedArea: NumericalRange,
  pastedData: string,
  setData: React.Dispatch<React.SetStateAction<T[][]>>
) => {
  // parse the pasted data
  const parsedData = JSON.parse(pastedData);

  setData((prev) => {
    const next = [...prev];
    for (let i = 0; i < parsedData.length; i++) {
      for (let j = 0; j < parsedData[i].length; j++) {
        next[selectedArea.startRowIdx + i][selectedArea.startColIdx + j] = parsedData[i][j];
      }
    }
    return next;
  });
};

const onCutHandler = <T,>(
  data: T[][],
  selectedArea: NumericalRange,
  setData: React.Dispatch<React.SetStateAction<T[][]>>
) => {
  // copy the data from the selected area to the clipboard
  const selectedData = data
    .slice(selectedArea.startRowIdx, selectedArea.endRowIdx)
    .map((row) => row.slice(selectedArea.startColIdx, selectedArea.endColIdx));

  navigator.clipboard.writeText(JSON.stringify(selectedData));

  // remove the data from the selected area
  setData((prev) => {
    const next = [...prev];
    for (let i = selectedArea.startRowIdx; i < selectedArea.endRowIdx; i++) {
      for (let j = selectedArea.startColIdx; j < selectedArea.endColIdx; j++) {
        next[i][j] = "" as T;
      }
    }
    return next;
  });
};

const onCopyHandler = <T,>(data: T[][], selectedArea: NumericalRange) => {
  // copy the data from the selected area to the clipboard
  const selectedData = data
    .slice(selectedArea.startRowIdx, selectedArea.endRowIdx)
    .map((row) => row.slice(selectedArea.startColIdx, selectedArea.endColIdx));

  navigator.clipboard.writeText(JSON.stringify(selectedData));
};

const ROW_COUNT = 20;
const COLUMN_COUNT = 25;

const testStyles = {};

const myNumberFormat = new Intl.NumberFormat("pl", {
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  currency: "PLN",
});

interface CellData {
  text?: string;
  number?: number;
  date?: Date;
}

export const BigGrid = () => {
  const [data, setData] = useState<(CellData | null)[][]>(
    Array.from({ length: ROW_COUNT }).map((_, i) => {
      return Array.from({ length: COLUMN_COUNT }).map((_, j) => {
        if (i === 2 && j === 4) return null;
        if (i === 3 && j === 3) return null;
        if (i === 3 && j === 4) return null;

        if (i === 3 && j === 7) return null;
        if (i === 4 && j === 6) return null;
        if (i === 4 && j === 7) return null;

        if (i === 5 && j === 6) return null;
        if (i === 5 && j === 7) return null;

        if (i === 6 && j === 4) return null;

        if (i === 6 && j === 7) return null;
        if (i === 6 && j === 8) return null;

        if (i === 1 && j === 3) return { date: new Date() };

        if (i === 0 && j === 0) return { number: 100 };

        if (i === 2 && j === 3) return { number: 125 };

        return {
          text:
            `[${i.toString()}:${j.toString()}]` +
            [
              "Lorem ipsum dolor sit amet",
              "Reiciendis illum, nihil, ab officiis explicabo!",
              "Excepturi in adipisci omnis illo eveniet obcaecati!",
              "Doloremque, sit!",
            ][Math.floor(Math.random() * 4)],
        };
      });
    })
  );

  const cellMatrix = cellMatrixBuilder(({ addRows, addColumns, setCell }) => {
    data.forEach((row, i) => {
      addRows({
        id: i.toString(),
        // height: `${Math.floor(Math.random() * 5) + 1}fr`,
        height: "max-content",
      });
      row.forEach((val, j) => {
        if (i === 0) {
          addColumns({
            id: j.toString(),
            // width: `${Math.floor(Math.random() * 3) + 1}fr`,
            width: "min-content",
          });
        }
        if (val === null) return;

        setCell(i.toString(), j.toString(), TextCell, {
          value: val?.text,
          onTextChanged: (data) => {
            setData((prev) => {
              const next = [...prev];
              if (next[i][j] !== null) {
                next[i][j].text = data;
              }
              return next;
            });
          },
        });
      });
    });

    setCell(
      "1",
      "3",
      DateCell,
      {
        value: data[1][3]?.date,
        onDateChanged: (newDate) => {
          setData((prev) => {
            const next = [...prev];
            next[1][3] = newDate;
            return next;
          });
        },
      },
      { colSpan: 2 }
    );

    setCell("0", "0", NumberCell, {
      value: data[0][0]?.number ?? 0,
      validator: (value) => !isNaN(value),
      errorMessage: "ERR",
      format: myNumberFormat,
      hideZero: true,
      onValueChanged: (newNumber) => {
        setData((prev) => {
          const next = [...prev];
          next[0][0]!.number = newNumber;
          return next;
        });
      },
    });

    setCell(
      "2",
      "3",
      NumberCell,
      {
        value: data[2][3]?.number ?? 0,
        validator: (value) => !isNaN(value),
        errorMessage: "ERR",
        format: myNumberFormat,
        hideZero: true,
        onValueChanged: (newNumber) => {
          setData((prev) => {
            const next = [...prev];
            next[2][3]!.number = newNumber;
            return next;
          });
        },
      },
      { colSpan: 2, rowSpan: 2 }
    );
    setCell(
      "3",
      "6",
      TextCell,
      { value: data[3][6]?.text ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 2, rowSpan: 2 }
    );
    setCell(
      "5",
      "4",
      TextCell,
      { value: data[5][4]?.text ?? "", reverse: true, onTextChanged: () => null },
      { rowSpan: 2 }
    );
    setCell(
      "5",
      "5",
      TextCell,
      { value: data[5][5]?.text ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 3 }
    );
    setCell(
      "6",
      "6",
      TextCell,
      { value: data[5][4]?.text ?? "", reverse: true, onTextChanged: () => null },
      { colSpan: 3 }
    );
  });

  cellMatrix.columns[1].width = "7rem";

  return (
    <>
      <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
        <ReactGrid
          id="big-grid"
          stickyTopRows={1}
          stickyLeftColumns={3}
          stickyRightColumns={2}
          stickyBottomRows={2}
          styles={testStyles}
          // styledRanges={styledRanges}
          {...cellMatrix}
          onAreaSelected={(selectedArea) => {
            console.log("area selected: ", selectedArea);
          }}
          onFillHandle={(selectedArea, fillRange) => onFillHandle(selectedArea, fillRange, setData)}
          onCut={(selectedArea) => onCutHandler(data, selectedArea, setData)}
          onPaste={(selectedArea, pastedData) => onPasteHandler(selectedArea, pastedData, setData)}
          onCopy={(selectedArea) => onCopyHandler(data, selectedArea)}
          onCellFocused={(cellLocation) => {}}
        />
      </div>
    </>
  );
};

export default {
  decorators: [
    (Component) => (
      <StrictMode>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </StrictMode>
    ),
  ],
} satisfies StoryDefault;