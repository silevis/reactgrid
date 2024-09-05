import React, { StrictMode, useState } from "react";
import { Cell, ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, initialGridData } from "./utils/examplesConfig";
import { handleCopy } from "./utils/handleCopy";
import { handleCut } from "./utils/handleCut";
import { handlePaste } from "./utils/handlePaste";

export const CutCopyPasteExample = () => {
  const [cells, setCells] = useState<Cell[]>(initialGridData);

  return (
    <div>
      <ReactGrid
        id="cut-copy-paste-example"
        styles={rgStyles}
        onCellChanged={(cellLocation, newValue) => {
          setCells((prev) => {
            const next = [...prev];
            const cell = next.find(
              (cell) => cell.rowIndex === cellLocation.rowIndex && cell.colIndex === cellLocation.colIndex
            );
            if (cell && cell.props !== undefined) {
              cell.props.value = newValue;
            }
            return next;
          });
        }}
        onCut={(selectedArea) => handleCut(cells, selectedArea, setCells)}
        onCopy={(selectedArea) => handleCopy(cells, selectedArea)}
        onPaste={(selectedArea, pastedData) => handlePaste(selectedArea, pastedData, setCells)}
        initialFocusLocation={{ rowIndex: 2, colIndex: 1 }}
        cells={cells}
      />
    </div>
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
