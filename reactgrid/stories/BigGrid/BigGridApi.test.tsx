import { render } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { StrictMode } from "react";
import React from "react";
import { ErrorBoundary } from "../../lib/components/ErrorBoundary";
import { BigGrid } from "./BigGrid.stories";
import { ReactGridAPI, useReactGridAPI } from "../../lib/hooks/useReactGridAPI";
import { TextCell } from "../../lib/cellTemplates/TextCell";

describe("useReactGridAPI methods", () => {
  let gridApi: ReactGridAPI | undefined;

  const TestComponent = () => {
    gridApi = useReactGridAPI("big-grid");

    return null;
  };

  beforeEach(() => {
    render(
      <StrictMode>
        <ErrorBoundary>
          <BigGrid />
          <TestComponent />
        </ErrorBoundary>
      </StrictMode>
    );
  });

  it("should set and get the selected area correctly", () => {
    gridApi?.setSelectedArea({
      startRowIdx: 1,
      startColIdx: 3,
      endRowIdx: 1,
      endColIdx: 4,
    });

    const selectedArea = gridApi?.getSelectedArea();
    expect(selectedArea).toEqual({
      startRowIdx: 1,
      endRowIdx: 1,
      startColIdx: 3,
      endColIdx: 4,
    });
  });

  it("should set and get the focused cell correctly", () => {
    gridApi?.setFocusedCell({ rowIndex: 5, colIndex: 8 });

    const focusedCell = gridApi?.getFocusedCell();
    expect(focusedCell).toEqual(
      expect.objectContaining({
        rowIndex: 5,
        colIndex: 8,
        Template: TextCell,
      })
    );
  });

  it("should get cell or span member by indexes correctly", () => {
    const cell = gridApi?.getCellOrSpanMemberByIndexes(1, 3);
    expect(cell).toEqual(
      expect.objectContaining({
        rowIndex: 1,
        colIndex: 3,
        Template: TextCell,
      })
    );
  });

  it("should get pane ranges correctly", () => {
    const paneRanges = gridApi?.getPaneRanges();
    expect(paneRanges).toEqual({
      TopLeft: {
        startRowIdx: 0,
        endRowIdx: 1,
        startColIdx: 0,
        endColIdx: 2,
      },
      TopCenter: {
        startRowIdx: 0,
        endRowIdx: 1,
        startColIdx: 2,
        endColIdx: 12,
      },
      TopRight: {
        startRowIdx: 0,
        endRowIdx: 1,
        startColIdx: 12,
        endColIdx: 14,
      },
      Left: {
        startRowIdx: 1,
        endRowIdx: 38,
        startColIdx: 0,
        endColIdx: 2,
      },
      Center: {
        startRowIdx: 1,
        endRowIdx: 38,
        startColIdx: 2,
        endColIdx: 12,
      },
      Right: {
        startRowIdx: 1,
        endRowIdx: 38,
        startColIdx: 12,
        endColIdx: 14,
      },
      BottomLeft: {
        startRowIdx: 38,
        endRowIdx: 40,
        startColIdx: 0,
        endColIdx: 2,
      },
      BottomCenter: {
        startRowIdx: 38,
        endRowIdx: 40,
        startColIdx: 2,
        endColIdx: 12,
      },
      BottomRight: {
        startRowIdx: 38,
        endRowIdx: 40,
        startColIdx: 12,
        endColIdx: 14,
      },
    });
  });

  it("should set selected columns and check selected area", () => {
    gridApi?.setSelectedColumns(2, 4);

    const selectedArea = gridApi?.getSelectedArea();
    expect(selectedArea).toEqual({
      startRowIdx: 0,
      endRowIdx: 40,
      startColIdx: 2,
      endColIdx: 4,
    });
  });

  it("should set selected rows and check selected area", () => {
    gridApi?.setSelectedRows(1, 3);

    const selectedArea = gridApi?.getSelectedArea();
    expect(selectedArea).toEqual({
      startRowIdx: 1,
      endRowIdx: 3,
      startColIdx: 0,
      endColIdx: 14,
    });
  });
});
