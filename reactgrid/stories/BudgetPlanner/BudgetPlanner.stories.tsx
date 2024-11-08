import React, { useState } from "react";
import { StrictMode } from "react";
import { Cell, ReactGrid } from "@silevis/reactgrid";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../../lib/components/ErrorBoundary";
import { getCells } from "./utils2";

export const filterCells = (cells: Cell[], horizontalExpandStatus: Record<string, boolean>): Cell[] => {
  // Collect all variants with their colIndexes
  const expandStatusArr = Object.entries(horizontalExpandStatus).map(([key]) => {
    const [colIndexStr, variant] = key.split("-");
    return { variant, colIndex: parseInt(colIndexStr, 10), isExpanded: horizontalExpandStatus[key] };
  });

  const rangesToHide: number[][] = [];

  expandStatusArr.forEach(({ variant, colIndex, isExpanded }) => {
    if (isExpanded === false) {
      if (variant === "Week") {
        const nextWeekCell = cells.find((cell) => {
          return cell.colIndex > colIndex && cell.props.value.startsWith("Week");
        });
        const nextMonthCell = cells.find((cell) => {
          return cell.colIndex > colIndex && cell.props.value.startsWith("Month");
        });
        const nextQuarterCell = cells.find((cell) => {
          return cell.colIndex > colIndex && cell.props.value.startsWith("Quarter");
        });

        const nearestColIndex = Math.min(
          nextMonthCell?.colIndex || Infinity,
          nextWeekCell?.colIndex || Infinity,
          nextQuarterCell?.colIndex || Infinity
        );

        rangesToHide.push([colIndex, nearestColIndex]);
      } else if (variant === "Month") {
        const nextMonthCell = cells.find((cell) => {
          return cell.colIndex > colIndex && cell.props.value.startsWith("Month");
        });
        const nextQuarterCell = cells.find((cell) => {
          return cell.colIndex > colIndex && cell.props.value.startsWith("Quarter");
        });

        console.log({ nextMonthCell, nextQuarterCell });

        const nearestColIndex = Math.min(nextMonthCell?.colIndex || Infinity, nextQuarterCell?.colIndex || Infinity);

        rangesToHide.push([colIndex, nearestColIndex]);
      } else if (variant === "Quarter") {
        const nextQuarterCell = cells.find((cell) => {
          return cell.colIndex > colIndex && cell.props.value.startsWith("Quarter");
        });

        const lastColIndex = Math.max(...cells.map((cell) => cell.colIndex + 1));

        const nearestColIndex = nextQuarterCell?.colIndex || lastColIndex;

        rangesToHide.push([colIndex, nearestColIndex]);
      } else {
        const lastColIndex = Math.max(...cells.map((cell) => cell.colIndex + 1));

        rangesToHide.push([colIndex, lastColIndex]);
      }
    }
  });

  // Filter out cells that fall within the rangesToHide
  const filteredCells = cells.filter((cell) => {
    return !rangesToHide.some(([startRange, endRange]) => {
      return cell.colIndex > startRange && cell.colIndex < endRange;
    });
  });

  return filteredCells.map((cell, colIndex) => {
    return {
      ...cell,
      colIndex,
    };
  });
};

export const BudgetPlanner = () => {
  const [title, setTitle] = useState("Budget Planner");
  const [horizontalExpandStatus, setHorizontalExpandStatus] = useState<Record<string, boolean>>({});

  const handleHorizontalExpandStatusChange = (key: string, status: boolean) => {
    setHorizontalExpandStatus((prevStatus) => ({
      ...prevStatus,
      [key]: status,
    }));
  };

  const cells = getCells({
    horizontalExpandStatus,
    title,
    setTitle,
    handleHorizontalExpandStatusChange,
  });

  const cellsx = filterCells(cells, horizontalExpandStatus);

  return (
    <div>
      <ReactGrid cells={cellsx} />
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
