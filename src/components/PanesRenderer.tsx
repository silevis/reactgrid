import { FC, useEffect, useRef, useState } from "react";
import { NumericalRange } from "../types/CellMatrix";
import { StickyOffsets } from "../types/InternalModel";
import { useReactGridStore } from "../utils/reactGridStore";
import { useTheme } from "../utils/useTheme";
import { Pane } from "./Pane";
import { useReactGridId } from "./ReactGridIdProvider";

interface PanesRendererProps {
  rowAmount: number;
  columnAmount: number;
  stickyTopRows: number;
  stickyBottomRows: number;
  stickyLeftColumns: number;
  stickyRightColumns: number;
}

type Pane =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "left"
  | "center"
  | "right"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight";

const PanesRenderer: FC<PanesRendererProps> = ({
  rowAmount,
  columnAmount,
  stickyTopRows,
  stickyBottomRows,
  stickyLeftColumns,
  stickyRightColumns,
}) => {
  const id = useReactGridId();
  const theme = useTheme();
  const rows = useReactGridStore(id, (store) => store.rows);
  const columns = useReactGridStore(id, (store) => store.columns);

  const ranges: Record<Pane, NumericalRange> = {
    topLeft: {
      startRowIdx: 0,
      endRowIdx: stickyTopRows,
      startColIdx: 0,
      endColIdx: stickyLeftColumns,
    },
    topCenter: {
      startRowIdx: 0,
      endRowIdx: stickyTopRows,
      startColIdx: stickyLeftColumns,
      endColIdx: columnAmount - stickyRightColumns,
    },
    topRight: {
      startRowIdx: 0,
      endRowIdx: stickyTopRows,
      startColIdx: columnAmount - stickyRightColumns,
      endColIdx: columnAmount,
    },
    left: {
      startRowIdx: stickyTopRows,
      endRowIdx: rowAmount - stickyBottomRows,
      startColIdx: 0,
      endColIdx: stickyLeftColumns,
    },
    center: {
      startRowIdx: stickyTopRows,
      endRowIdx: rowAmount - stickyBottomRows,
      startColIdx: stickyLeftColumns,
      endColIdx: columnAmount - stickyRightColumns,
    },
    right: {
      startRowIdx: stickyTopRows,
      endRowIdx: rowAmount - stickyBottomRows,
      startColIdx: columnAmount - stickyRightColumns,
      endColIdx: columnAmount,
    },
    bottomLeft: {
      startRowIdx: rowAmount - stickyBottomRows,
      endRowIdx: rowAmount,
      startColIdx: 0,
      endColIdx: stickyLeftColumns,
    },
    bottomCenter: {
      startRowIdx: rowAmount - stickyBottomRows,
      endRowIdx: rowAmount,
      startColIdx: stickyLeftColumns,
      endColIdx: columnAmount - stickyRightColumns,
    },
    bottomRight: {
      startRowIdx: rowAmount - stickyBottomRows,
      endRowIdx: rowAmount,
      startColIdx: columnAmount - stickyRightColumns,
      endColIdx: columnAmount,
    },
  };

  const [stickyOffsets, setStickyOffsets] = useState<StickyOffsets>({
    topRows: [],
    bottomRows: [],
    leftColumns: [],
    rightColumns: [],
  });

  const gridContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Finds the offsets of the sticky rows. Fetches the cells until it finds a cell that is not spanned.
   * @param {number} stickyRowsAmount defines the amount of rows to get offsets for
   * @param {"forward" | "backward"} direction defines the direction in which the offsets should be fetched
   */
  const getRowsOffsets = (
    stickyRowsAmount: number,
    direction: "forward" | "backward" = "forward"
  ) => {
    if (stickyRowsAmount === 0 || !gridContainerRef.current) return [];
    const offsets: number[] = [];
    let rowIndex = 1;
    let colOffset = 0;

    do {
      const cellElement = gridContainerRef.current.getElementsByClassName(
        `rgRowIdx-${
          direction === "forward" ? rowIndex - 1 : rowAmount - 1 - rowIndex
        } rgColIdx-${colOffset}`
      )[0];

      if (cellElement) {
        const cellElementStyle = window.getComputedStyle(cellElement);
        // If the cell is spanned skip it and look for another one
        if (cellElementStyle.gridRowEnd.includes("span")) {
          colOffset += parseInt(
            cellElementStyle.gridRowEnd.split(" ").at(-1) ?? "1"
          );
          continue;
        }

        // Else, get real (px) cell height (which represents row height in this context) and add it to the offsets array
        const rowHeight = parseFloat(cellElementStyle.height);
        // The first offset is always the width of the grid gap/cell outline
        // If its undefined, get it from the current cell's style
        if (offsets[0] === undefined) {
          const gridGap = parseFloat(
            cellElementStyle.boxShadow.split(" ").at(-1) ?? "0"
          );
          offsets[0] = gridGap;
        }

        offsets.push(offsets[rowIndex - 1] + offsets[0] + rowHeight);
        colOffset = 0;
        rowIndex++;
        continue;
      }

      // No element found, increment colOffset and try again
      colOffset++;
    } while (rowIndex < stickyRowsAmount && colOffset < columnAmount);

    return offsets;
  };

  /**
   * Finds the offsets of the sticky columns. Fetches the cells until it finds a cell that is not spanned.
   * @param {number} stickyColumnsAmount defines the amount of columns to get offsets for
   * @param {"forward" | "backward"} direction defines the direction in which the offsets should be fetched
   * @returns an array of offsets
   */
  const getColumnsOffsets = (
    stickyColumnsAmount: number,
    direction: "forward" | "backward" = "forward"
  ) => {
    if (stickyColumnsAmount === 0 || !gridContainerRef.current) return [];
    const offsets: number[] = [];
    let colIndex = 1;
    let rowOffset = 0;

    do {
      const cellElement = gridContainerRef.current.getElementsByClassName(
        `rgColIdx-${
          direction === "forward" ? colIndex - 1 : columnAmount - 1 - colIndex
        } rgRowIdx-${rowOffset}`
      )[0];

      if (cellElement) {
        const cellElementStyle = window.getComputedStyle(cellElement);
        // If the cell is spanned skip it and look for another one
        if (cellElementStyle.gridColumnEnd.includes("span")) {
          rowOffset += parseInt(
            cellElementStyle.gridColumnEnd.split(" ").at(-1) ?? "1"
          );
          continue;
        }

        // Else, get real (px) cell height (which represents col width in this context) and add it to the offsets array
        const colWidth = parseFloat(cellElementStyle.width);
        // The first offset is always the width of the grid gap/cell outline
        // If its undefined, get it from the current cell's style
        if (offsets[0] === undefined) {
          const gridGap = parseFloat(
            cellElementStyle.boxShadow.split(" ").at(-1) ?? "0"
          );
          offsets[0] = gridGap;
        }

        offsets.push(offsets[colIndex - 1] + offsets[0] + colWidth);
        rowOffset = 0;
        colIndex++;
        continue;
      }

      // No element found, increment rowOffset and try again
      rowOffset++;
    } while (colIndex < stickyColumnsAmount && rowOffset < rowAmount);

    return offsets;
  };

  useEffect(() => {
    const gridContainer = gridContainerRef.current;
    if (!gridContainer) return;

    const observer = new ResizeObserver(() => {
      setStickyOffsets(() => ({
        topRows: getRowsOffsets(stickyTopRows),
        bottomRows: getRowsOffsets(stickyBottomRows, "backward"),
        leftColumns: getColumnsOffsets(stickyLeftColumns),
        rightColumns: getColumnsOffsets(stickyRightColumns, "backward"),
      }));
      console.log("resize");
    });

    observer.observe(gridContainer);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      css={{
        display: "grid",

        ".rgCellWrapper": {
          boxShadow: `0 0 0 ${theme.grid.gap.width} ${theme.grid.gap.color}`,
        },
      }}
    >
      <div
        className="rgGridContent"
        style={{
          display: "grid",
          gridTemplateColumns: theme.grid.templates.columns({
            amount: columns.length,
            widths: columns.map(({ width }) =>
              typeof width === "number" ? `${width}px` : width
            ),
          }),
          gridTemplateRows: theme.grid.templates.rows({
            amount: rows.length,
            heights: rows.map(({ height }) =>
              typeof height === "number" ? `${height}px` : height
            ),
          }),
          gap: theme.grid.gap.width,
        }}
        ref={gridContainerRef}
      >
        <Pane className="rgPane-Center" gridContentRange={ranges.center} />
        <Pane
          className="rgPane-BottomCenter"
          gridContentRange={ranges.bottomCenter}
          getCellOffset={(rowIndex, _colIndex, rowSpan) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            bottom: stickyOffsets.bottomRows.at(-rowIndex - rowSpan),
          })}
        />
        <Pane
          className="rgPane-Right"
          gridContentRange={ranges.right}
          getCellOffset={(_rowIndex, colIndex, _rowSpan, colSpan) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            right: stickyOffsets.rightColumns.at(-colIndex - colSpan),
          })}
        />
        <Pane
          className="rgPane-TopCenter"
          gridContentRange={ranges.topCenter}
          getCellOffset={(rowIndex) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            top: stickyOffsets.topRows[rowIndex],
          })}
        />
        <Pane
          className="rgPane-Left"
          gridContentRange={ranges.left}
          getCellOffset={(_rowIndex, colIndex) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            left: stickyOffsets.leftColumns[colIndex],
          })}
        />
        <Pane
          className="rgPane-BottomRight"
          gridContentRange={ranges.bottomRight}
          getCellOffset={(rowIndex, colIndex, rowSpan, colSpan) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            bottom: stickyOffsets.bottomRows.at(-rowIndex - rowSpan),
            right: stickyOffsets.rightColumns.at(-colIndex - colSpan),
          })}
        />
        <Pane
          className="rgPane-BottomLeft"
          gridContentRange={ranges.bottomLeft}
          getCellOffset={(rowIndex, colIndex, rowSpan) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            bottom: stickyOffsets.bottomRows.at(-rowIndex - rowSpan),
            left: stickyOffsets.leftColumns[colIndex],
          })}
        />
        <Pane
          className="rgPane-TopRight"
          gridContentRange={ranges.topRight}
          getCellOffset={(rowIndex, colIndex, _rowSpan, colSpan) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            top: stickyOffsets.topRows[rowIndex],
            right: stickyOffsets.rightColumns.at(-colIndex - colSpan),
          })}
        />
        <Pane
          className="rgPane-TopLeft"
          gridContentRange={ranges.topLeft}
          getCellOffset={(rowIndex, colIndex) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            top: stickyOffsets.topRows[rowIndex],
            left: stickyOffsets.leftColumns[colIndex],
          })}
        />
      </div>
    </div>
  );
};

export default PanesRenderer;
