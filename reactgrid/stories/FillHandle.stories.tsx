import React, { StrictMode, useState } from "react";
import { ReactGrid } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles, generateCells, gridData } from "./utils/examplesConfig";
import { handleFill } from "./utils/handleFill";

export const FillHandleExample = () => {
  const [cells, setCells] = useState(
    generateCells(gridData, {
      onValueChanged: (cellIndex, newValue) => {
        setCells((prev) => {
          const next = [...prev];
          const cell = next.find(
            (cell) => cell.rowIndex === cellIndex.rowIndex && cell.colIndex === cellIndex.colIndex
          );
          if (cell && cell.props !== undefined) {
            cell.props.value = newValue;
          }
          return next;
        });
      },
      onTextChanged: (cellIndex, newText) => {
        setCells((prev) => {
          const next = [...prev];
          const cell = next.find(
            (cell) => cell.rowIndex === cellIndex.rowIndex && cell.colIndex === cellIndex.colIndex
          );
          if (cell && cell.props !== undefined) {
            cell.props.text = newText;
          }
          return next;
        });
      },
    })
  );

  const [counter, setCounter] = useState(0);

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setCounter((prev) => prev + 1)}>Increment counter</button>
        <span style={{ marginLeft: "10px" }}>Counter: {counter}</span>
      </div>
      <ReactGrid
        id="fill-handle-example"
        styles={rgStyles}
        onFillHandle={(selectedArea, fillRange) => handleFill(selectedArea, fillRange, setCells)}
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
