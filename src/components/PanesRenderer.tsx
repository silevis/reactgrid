import { FC, useEffect, useRef, useState } from "react";
import { NumericalRange } from "../types/CellMatrix";
import { PaneName, StickyOffsets } from "../types/InternalModel";
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
  const setPaneRanges = useReactGridStore(id, (store) => store.setPaneRanges);

  const ranges: Record<PaneName, NumericalRange> = {
    TopLeft: {
      startRowIdx: 0,
      endRowIdx: stickyTopRows,
      startColIdx: 0,
      endColIdx: stickyLeftColumns,
    },
    TopCenter: {
      startRowIdx: 0,
      endRowIdx: stickyTopRows,
      startColIdx: stickyLeftColumns,
      endColIdx: columnAmount - stickyRightColumns,
    },
    TopRight: {
      startRowIdx: 0,
      endRowIdx: stickyTopRows,
      startColIdx: columnAmount - stickyRightColumns,
      endColIdx: columnAmount,
    },
    Left: {
      startRowIdx: stickyTopRows,
      endRowIdx: rowAmount - stickyBottomRows,
      startColIdx: 0,
      endColIdx: stickyLeftColumns,
    },
    Center: {
      startRowIdx: stickyTopRows,
      endRowIdx: rowAmount - stickyBottomRows,
      startColIdx: stickyLeftColumns,
      endColIdx: columnAmount - stickyRightColumns,
    },
    Right: {
      startRowIdx: stickyTopRows,
      endRowIdx: rowAmount - stickyBottomRows,
      startColIdx: columnAmount - stickyRightColumns,
      endColIdx: columnAmount,
    },
    BottomLeft: {
      startRowIdx: rowAmount - stickyBottomRows,
      endRowIdx: rowAmount,
      startColIdx: 0,
      endColIdx: stickyLeftColumns,
    },
    BottomCenter: {
      startRowIdx: rowAmount - stickyBottomRows,
      endRowIdx: rowAmount,
      startColIdx: stickyLeftColumns,
      endColIdx: columnAmount - stickyRightColumns,
    },
    BottomRight: {
      startRowIdx: rowAmount - stickyBottomRows,
      endRowIdx: rowAmount,
      startColIdx: columnAmount - stickyRightColumns,
      endColIdx: columnAmount,
    },
  };

  useEffect(() => {
    setPaneRanges(ranges);
  }, [ranges]);

  const [stickyOffsets, setStickyOffsets] = useState<StickyOffsets>({
    topRows: [],
    bottomRows: [],
    leftColumns: [],
    rightColumns: [],
  });

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const resizeObserver = useRef<ResizeObserver>(new ResizeObserver(() => {
    setStickyOffsets(() => ({
      topRows: getRowsOffsets(stickyTopRows),
      bottomRows: getRowsOffsets(stickyBottomRows, "backward"),
      leftColumns: getColumnsOffsets(stickyLeftColumns),
      rightColumns: getColumnsOffsets(stickyRightColumns, "backward"),
    }));
  }));

  useEffect(() => {
    if (!gridContainerRef.current) return;

    const observer = resizeObserver.current;
    observer.observe(gridContainerRef.current);

    return () => observer.disconnect();
  }, []);

  /**
   * Finds the offsets of the sticky rows. Fetches the cells until it finds a cell that is not spanned.
   * @param {number} stickyRowsAmount defines the amount of rows to get offsets for
   * @param {"forward" | "backward"} direction defines the direction in which the offsets should be fetched
   */
  const getRowsOffsets = (stickyRowsAmount: number, direction: "forward" | "backward" = "forward") => {
    if (stickyRowsAmount === 0 || !gridContainerRef.current) return [];
    const offsets: number[] = [parseFloat(window.getComputedStyle(gridContainerRef.current).gap ?? "0")];
    let rowIndex = 1;
    let colOffset = 0;

    do {
      const cellElement = gridContainerRef.current.getElementsByClassName(
        `rgRowIdx-${direction === "forward" ? rowIndex - 1 : rowAmount - rowIndex} rgColIdx-${colOffset}`
      )[0];

      if (cellElement) {
        const cellElementStyle = window.getComputedStyle(cellElement);
        // If the cell is spanned skip it and look for another one...
        if (cellElementStyle.gridRowEnd.includes("span")) {
          colOffset += parseInt(cellElementStyle.gridRowEnd.split(" ").at(-1) ?? "1");
          continue;
        }

        // ...else, get real (px) cell height (which represents row height in this context)...
        const rowHeight = cellElement.getBoundingClientRect().height;

        // ... and store total offset, i.e. the sum of the previous offset, current width and grid gap
        offsets.push(offsets[rowIndex - 1] + rowHeight + offsets[0]);

        // Reset colOffset and increment rowIndex
        colOffset = 0;
        rowIndex++;

        // In the end register the element in the observer (required for the offset to update on cell resize)
        resizeObserver.current.observe(cellElement);
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
  const getColumnsOffsets = (stickyColumnsAmount: number, direction: "forward" | "backward" = "forward") => {
    if (stickyColumnsAmount === 0 || !gridContainerRef.current) return [];
    const offsets: number[] = [parseFloat(window.getComputedStyle(gridContainerRef.current).gap ?? "0")];
    let colIndex = 1;
    let rowOffset = 0;

    do {
      const cellElement = gridContainerRef.current.getElementsByClassName(
        `rgColIdx-${direction === "forward" ? colIndex - 1 : columnAmount - colIndex} rgRowIdx-${rowOffset}`
      )[0];

      if (cellElement) {
        const cellElementStyle = window.getComputedStyle(cellElement);
        // If the cell is spanned skip it and look for another one...
        if (cellElementStyle.gridColumnEnd.includes("span")) {
          rowOffset += parseInt(cellElementStyle.gridColumnEnd.split(" ").at(-1) ?? "1");
          continue;
        }

        //...else, get real (px) cell height (which represents col width in this context)...
        const colWidth = cellElement.getBoundingClientRect().width;

        // ...and store total offset, i.e. the sum of the previous offset, current width and grid gap
        offsets.push(offsets[colIndex - 1] + colWidth + offsets[0]);

        // Reset rowOffset and increment colIndex
        rowOffset = 0;
        colIndex++;

        // In the end register the element in the observer (required for the offset to update on cell resize)
        resizeObserver.current.observe(cellElement);
        continue;
      }

      // No element found, increment rowOffset and try again
      rowOffset++;
    } while (colIndex < stickyColumnsAmount && rowOffset < rowAmount);

    return offsets;
  };

  return (
    <div
      css={{
        display: "grid",
        userSelect: "none",

        ".rgCellContainer": {
          paddingTop: theme.cellContainer.padding.top,
          paddingLeft: theme.cellContainer.padding.left,
          paddingBottom: theme.cellContainer.padding.bottom,
          paddingRight: theme.cellContainer.padding.right,
          backgroundColor: "white",
        },
      }}
    >
      <div
        className="rgGridContent"
        style={{
          display: "grid",
          gridTemplateColumns: theme.grid.templates.columns({
            amount: columns.length,
            widths: columns.map(({ width }) => (typeof width === "number" ? `${width}px` : width)),
          }),
          gridTemplateRows: theme.grid.templates.rows({
            amount: rows.length,
            heights: rows.map(({ height }) => (typeof height === "number" ? `${height}px` : height)),
          }),
          gap: theme.grid.gap.width,
          backgroundColor: theme.grid.gap.color,
          padding: theme.grid.gap.width,
        }}
        ref={gridContainerRef}
      >
        <Pane paneName="Center" gridContentRange={ranges.Center} />
        <Pane
          paneName="BottomCenter"
          gridContentRange={ranges.BottomCenter}
          getCellOffset={(rowIndex, _colIndex, rowSpan) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            bottom: stickyOffsets.bottomRows.at(-rowIndex - rowSpan),
          })}
          shouldRender={stickyBottomRows > 0}
        />
        <Pane
          paneName="Right"
          gridContentRange={ranges.Right}
          getCellOffset={(_rowIndex, colIndex, _rowSpan, colSpan) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            right: stickyOffsets.rightColumns.at(-colIndex - colSpan),
          })}
          shouldRender={stickyRightColumns > 0}
        />
        <Pane
          paneName="TopCenter"
          gridContentRange={ranges.TopCenter}
          getCellOffset={(rowIndex) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            top: stickyOffsets.topRows[rowIndex],
          })}
          shouldRender={stickyTopRows > 0}
        />
        <Pane
          paneName="Left"
          gridContentRange={ranges.Left}
          getCellOffset={(_rowIndex, colIndex) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            left: stickyOffsets.leftColumns[colIndex],
          })}
          shouldRender={stickyLeftColumns > 0}
        />
        <Pane
          paneName="BottomRight"
          gridContentRange={ranges.BottomRight}
          getCellOffset={(rowIndex, colIndex, rowSpan, colSpan) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            bottom: stickyOffsets.bottomRows.at(-rowIndex - rowSpan),
            right: stickyOffsets.rightColumns.at(-colIndex - colSpan),
          })}
          shouldRender={stickyBottomRows > 0 && stickyRightColumns > 0}
        />
        <Pane
          paneName="BottomLeft"
          gridContentRange={ranges.BottomLeft}
          getCellOffset={(rowIndex, colIndex, rowSpan) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            bottom: stickyOffsets.bottomRows.at(-rowIndex - rowSpan),
            left: stickyOffsets.leftColumns[colIndex],
          })}
          shouldRender={stickyBottomRows > 0 && stickyLeftColumns > 0}
        />
        <Pane
          paneName="TopRight"
          gridContentRange={ranges.TopRight}
          getCellOffset={(rowIndex, colIndex, _rowSpan, colSpan) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            top: stickyOffsets.topRows[rowIndex],
            right: stickyOffsets.rightColumns.at(-colIndex - colSpan),
          })}
          shouldRender={stickyTopRows > 0 && stickyRightColumns > 0}
        />
        <Pane
          paneName="TopLeft"
          gridContentRange={ranges.TopLeft}
          getCellOffset={(rowIndex, colIndex) => ({
            position: "sticky",
            backgroundColor: "floralwhite",
            top: stickyOffsets.topRows[rowIndex],
            left: stickyOffsets.leftColumns[colIndex],
          })}
          shouldRender={stickyTopRows > 0 && stickyLeftColumns > 0}
        />
        {/* <div className="rgFocusIndicator" style={{
            gridArea: "5 / 2 / 6 / 6",
            // width: "calc(100% + 10px)",
            // height: "calc(100% + 10px)",
            width: "100%",
            height: "100%",
            marginTop: "-4px",
            marginLeft: "-4px",
            // marginRight: "-5px",
            // marginBottom: "-5px",
            // backgroundColor: "aliceblue",
            // opacity: 0.5,
            border: "4px solid blue",
            // pointerEvents: "none",
          }} /> */}
      </div>
    </div>
  );
};

export default PanesRenderer;
