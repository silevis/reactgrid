import React from "react";
import { Cell } from "../types/PublicModel";

interface SpanFilterProps {
  rowAmount: number;
  colAmount: number;
}

type SpanMembers = Record<number, number[]>;

interface SetSpanMembersParams {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
}

interface IsSpanMemberParams {
  rowIndex: number;
  colIndex: number;
}

const useSpanMembers = ({ rowAmount, colAmount }: SpanFilterProps) => {
  const spanMembers = React.useRef<SpanMembers>({}).current;

  /**
   * Checks if cell is a span member.
   * @param rowIndex Cell's row index
   * @param colIndex Cell's column index
   * @returns True if cell is a span member, false otherwise
   */
  const isSpanMember = React.useCallback(
    ({ rowIndex, colIndex }: IsSpanMemberParams) => {
      return spanMembers[rowIndex]?.includes(colIndex) ?? false;
    },
    [spanMembers]
  );

  /**
   * Checks if cell is spanned then finds span members to the right and below and saves it to spanMembers.
   * @param cell Cell to check
   * @param rowIndex Cell's row index
   * @param colIndex Cell's column index
   * @throws Error if cell's span exceeds the number of rows or columns
   * @throws Error if cell's span overlaps another spanned cell
   */
  const markMembersIfSpanned = React.useCallback(
    ({ cell, rowIndex, colIndex }: SetSpanMembersParams) => {
      let thisCellColSpanMembers: number[] = [];

      // Find cell's span members to the right, omit cell's column to keep it from being deleted
      if (cell.colSpan && cell.colSpan > 1) {
        if (cell.colSpan > colAmount - colIndex) {
          throw new Error(
            `Cell [${rowIndex}-${colIndex}] has a colSpan of ${cell.colSpan} which exceeds the number of columns (${colAmount})!`
          );
        }

        // thisCellColSpanMembers = Array.from({ length: cell.colSpan - 1 }, (_, i) => colIndex + i + 1);
        thisCellColSpanMembers = Array.from({ length: cell.colSpan -1 }, (_, i) => {
          // ! For some reason this errors on hot reload (but not on refresh, nor second hot reload)
          if (isSpanMember({ rowIndex, colIndex: colIndex + i + 1 })) {
            throw new Error(`Cell [${rowIndex}-${colIndex}] has a colSpan of ${cell.colSpan} which overlaps another spanned cell!`);
          }

          return colIndex + i + 1;
        })
        spanMembers[rowIndex] = [...spanMembers[rowIndex] ?? [], ...thisCellColSpanMembers];
      }

      // Find cell's span members below, include cell's column omitted above
      if (cell.rowSpan && cell.rowSpan > 1) {
        if (cell.rowSpan > rowAmount - rowIndex) {
          throw new Error(
            `Cell [${rowIndex}-${colIndex}] has a rowSpan of ${cell.rowSpan} which exceeds the number of rows (${rowAmount})!`
          );
        }

        Array.from({ length: cell.rowSpan - 1 }, (_, i) => {
          spanMembers[rowIndex + i + 1] = [colIndex, ...thisCellColSpanMembers];
        });
      }
    },
    [rowAmount, colAmount, spanMembers, isSpanMember]
  );

  return { markMembersIfSpanned, isSpanMember };
};

export default useSpanMembers;
