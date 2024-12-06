import React from "react";
import { StrictMode } from "react";
import { ReactGrid, TextCell, Column, Cell } from "../lib/main";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../lib/components/ErrorBoundary";
import { rgStyles } from "./utils/examplesConfig";

export const TestGridExample = () => {
  const columns: Column[] = [
    { colIndex: 0, width: 100 },
    { colIndex: 1, width: 100 },
    { colIndex: 2, width: 100 },
  ];

  const cells: Cell[] = [
    {
      rowIndex: 0,
      colIndex: 0,
      props: {
        text: "0-0",
      },
      Template: TextCell,
    },
    {
      rowIndex: 5,
      colIndex: 5,
      props: {
        text: "5-5",
      },
      Template: TextCell,
    },
    {
      rowIndex: 3,
      colIndex: 3,
      props: {
        text: "3-3",
      },
      Template: TextCell,
    },
  ];

  return (
    <div>
      <ReactGrid
        id="test-grid"
        styles={rgStyles}
        enableColumnSelectionOnFirstRow
        rows={[]}
        columns={columns}
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
