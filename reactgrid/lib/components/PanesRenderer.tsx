import { FC, useEffect, useMemo, useRef, useState } from "react";
import { StickyOffsets } from "../types/InternalModel";
import { reactGridStores, useReactGridStore } from "../utils/reactGridStore";
import { useTheme } from "../hooks/useTheme";
import { Pane } from "./Pane";
import { useReactGridId } from "./ReactGridIdProvider";
import { RowMeasurement } from "../types/RowMeasurement";
import {
  getStickyColumnsOffsetsFromMeasurements,
  getStickyRowsOffsetsFromMeasurements,
} from "../utils/getStickyOffsetsFromMeasurements";
import { ColumnMeasurement } from "../types/ColumnMeasurement";
import { getCellArea } from "../utils/getCellArea";
import { isSpanMember } from "../utils/isSpanMember";
import { getNumberFromPixelString } from "../utils/getNumberFromPixelValueString";

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
  const store = reactGridStores()[id].getState();

  const theme = useTheme();
  const cells = useReactGridStore(id, (store) => store.cells);
  const rows = useReactGridStore(id, (store) => store.rows);
  const focusedLocation = useReactGridStore(id, (store) => store.focusedLocation);
  const columns = useReactGridStore(id, (store) => store.columns);

  const setPaneRanges = useReactGridStore(id, (store) => store.setPaneRanges);
  const setRowMeasurements = useReactGridStore(id, (store) => store.setRowMeasurements);
  const setColMeasurements = useReactGridStore(id, (store) => store.setColMeasurements);

  const onCellFocused = useReactGridStore(id, (store) => store.onCellFocused);

  const ranges = useMemo(
    () => ({
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
    }),
    [stickyTopRows, stickyLeftColumns, stickyRightColumns, rowAmount, columnAmount, stickyBottomRows]
  );

  useEffect(() => {
    onCellFocused?.(focusedLocation);
  }, [focusedLocation]);

  useEffect(() => {
    cells?.forEach((cell) => {
      const cellArea = getCellArea(store, cell);

      if (!isSpanMember(cell)) {
        if (cellArea.startRowIdx < ranges.TopCenter.endRowIdx) {
          if (cellArea.endRowIdx > ranges.TopCenter.endRowIdx) {
            console.error(`Cell with indexes [${cell.rowIndex}, ${cell.colIndex}] does not fit in sticky top pane.`);
          }
        }

        if (cellArea.endRowIdx > ranges.BottomCenter.startRowIdx) {
          if (cellArea.startRowIdx < ranges.BottomCenter.startRowIdx) {
            console.error(`Cell with indexes [${cell.rowIndex}, ${cell.colIndex}] does not fit in sticky bottom pane.`);
          }
        }

        if (cellArea.startColIdx < ranges.Left.endColIdx) {
          if (cellArea.endColIdx > ranges.Left.endColIdx) {
            console.error(`Cell with indexes [${cell.rowIndex}, ${cell.colIndex}] does not fit in sticky left pane.`);
          }
        }

        if (cellArea.endColIdx > ranges.Right.startColIdx) {
          if (cellArea.startColIdx < ranges.Right.startColIdx) {
            console.error(`Cell with indexes [${cell.rowIndex}, ${cell.colIndex}] does not fit in sticky right pane.`);
          }
        }
      }
    });

    setPaneRanges(ranges);
  }, [ranges]);

  const [stickyOffsets, setStickyOffsets] = useState<StickyOffsets>({
    topRows: [],
    bottomRows: [],
    leftColumns: [],
    rightColumns: [],
  });

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const resizeObserver = useRef<ResizeObserver>(
    new ResizeObserver(() => {
      const rowMeasurements = getRowsMeasurements();
      const colMeasurements = getColumnsMeasurements();

      setRowMeasurements(rowMeasurements);
      setColMeasurements(colMeasurements);

      setStickyOffsets(() => ({
        topRows: getStickyRowsOffsetsFromMeasurements(rowMeasurements, stickyTopRows, "forward"),
        bottomRows: getStickyRowsOffsetsFromMeasurements(rowMeasurements, stickyBottomRows, "backward"),
        leftColumns: getStickyColumnsOffsetsFromMeasurements(colMeasurements, stickyLeftColumns, "forward"),
        rightColumns: getStickyColumnsOffsetsFromMeasurements(colMeasurements, stickyRightColumns, "backward"),
      }));
    })
  );

  useEffect(() => {
    if (!gridContainerRef.current) return;

    const observer = resizeObserver.current;
    observer.observe(gridContainerRef.current);

    return () => observer.disconnect();
  }, []);

  /**
   * Measures the widths and offsets of rows. Fetches the cell until it finds a cell that is not spanned.
   *
   * @returns RowMeasurement[] - an array of row measurements
   */
  const getRowsMeasurements = (): RowMeasurement[] => {
    if (rowAmount === 0 || !gridContainerRef.current) return [];
    const gapWidth = parseFloat(window.getComputedStyle(gridContainerRef.current).gap ?? "0");
    const rowsMeasurements: RowMeasurement[] = [];

    let rowIndex = 0;
    let colIndexOffset = 0;

    do {
      const cellElement = gridContainerRef.current.getElementsByClassName(
        `rgRowIdx-${rowIndex} rgColIdx-${colIndexOffset}`
      )[0];

      if (cellElement) {
        const cellElementStyle = window.getComputedStyle(cellElement);
        // If the cell is spanned skip it and look for another one...
        if (cellElementStyle.gridRowEnd.includes("span")) {
          colIndexOffset += parseInt(cellElementStyle.gridRowEnd.split(" ").at(-1) ?? "1");
          continue;
        }

        // ...else, get real (px) cell height and top offset (which represents _row_ height and offset in this context)...
        const rowHeight = cellElement.getBoundingClientRect().height;
        const rowOffset =
          rowIndex === 0
            ? gapWidth
            : rowsMeasurements[rowIndex - 1].offsetTop + rowsMeasurements[rowIndex - 1].height + gapWidth;

        // ...and store those measurements in the array
        rowsMeasurements.push({ height: rowHeight, offsetTop: rowOffset });

        // Reset col index offset and increment rowIndex
        colIndexOffset = 0;
        rowIndex++;

        // In the end register the element in the observer (required for the measurements to update on cell resize)
        resizeObserver.current.observe(cellElement);
        continue;
      }

      // No element found, increment colOffset and try again
      colIndexOffset++;
    } while (rowIndex < rowAmount && colIndexOffset < columnAmount);

    return rowsMeasurements;
  };

  /**
   * Measures the widths and offsets of columns. Fetches the cell until it finds a cell that is not spanned.
   *
   * @returns ColumnMeasurement[] - an array of column measurements
   */
  const getColumnsMeasurements = (): ColumnMeasurement[] => {
    if (columnAmount === 0 || !gridContainerRef.current) return [];
    const gapWidth = parseFloat(window.getComputedStyle(gridContainerRef.current).gap ?? "0");
    const colMeasurements: ColumnMeasurement[] = [];

    let colIndex = 0;
    let rowIndexOffset = 0;

    do {
      const cellElement = gridContainerRef.current.getElementsByClassName(
        `rgColIdx-${colIndex} rgRowIdx-${rowIndexOffset}`
      )[0];

      if (cellElement) {
        const cellElementStyle = window.getComputedStyle(cellElement);
        // If the cell is spanned skip it and look for another one...
        if (cellElementStyle.gridColumnEnd.includes("span")) {
          rowIndexOffset += parseInt(cellElementStyle.gridColumnEnd.split(" ").at(-1) ?? "1");
          continue;
        }

        // ...else, get real (px) cell width and left offset (which represents _col_ width and offset in this context)...
        const colWidth = cellElement.getBoundingClientRect().width;
        const colOffset =
          colIndex === 0
            ? gapWidth
            : colMeasurements[colIndex - 1].offsetLeft + colMeasurements[colIndex - 1].width + gapWidth;

        // ...and store those measurements in the array
        colMeasurements.push({ width: colWidth, offsetLeft: colOffset });

        // Reset row index offset and increment colIndex
        rowIndexOffset = 0;
        colIndex++;

        // In the end register the element in the observer (required for the measurements to update on cell resize)
        resizeObserver.current.observe(cellElement);
        continue;
      }

      // No element found, increment rowIndex and try again
      rowIndexOffset++;
    } while (colIndex < columnAmount && rowIndexOffset < rowAmount);

    return colMeasurements;
  };

  return (
    <div
      css={{
        display: "flex",
        userSelect: "none",
        ".rgCellContainer": {
          paddingTop: theme.cellContainer.padding.top,
          paddingLeft: theme.cellContainer.padding.left,
          paddingBottom: theme.cellContainer.padding.bottom,
          paddingRight: theme.cellContainer.padding.right,
          backgroundColor: theme.cellContainer.background,
        },
      }}
    >
      <div
        className="rgGridContent"
        style={{
          display: "grid",
          gridTemplateColumns: columns
            .map(({ width, minWidth }) => {
              const widthValue = getNumberFromPixelString(width);
              const minWidthValue = getNumberFromPixelString(minWidth ?? 0);

              return widthValue < minWidthValue ? `${minWidthValue}px` : `${widthValue}px`;
            })
            .join(" "),
          gridTemplateRows: rows.map(({ height }) => (typeof height === "number" ? `${height}px` : height)).join(" "),
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
          stickyOffsets={stickyOffsets}
          getCellOffset={(rowIndex, _colIndex, rowSpan) => ({
            position: "sticky",
            backgroundColor: theme.paneContainer.bottom.background,
            bottom: stickyOffsets.bottomRows.at(-rowIndex - rowSpan),
          })}
          shouldRender={stickyBottomRows > 0}
        />
        <Pane
          paneName="TopCenter"
          gridContentRange={ranges.TopCenter}
          stickyOffsets={stickyOffsets}
          getCellOffset={(rowIndex) => ({
            position: "sticky",
            backgroundColor: theme.paneContainer.top.background,
            top: stickyOffsets.topRows[rowIndex],
          })}
          shouldRender={stickyTopRows > 0}
        />
        <Pane
          paneName="Right"
          gridContentRange={ranges.Right}
          stickyOffsets={stickyOffsets}
          getCellOffset={(_rowIndex, colIndex, _rowSpan, colSpan) => ({
            position: "sticky",
            backgroundColor: theme.paneContainer.right.background,
            right: stickyOffsets.rightColumns.at(-colIndex - colSpan),
          })}
          shouldRender={stickyRightColumns > 0}
        />
        <Pane
          paneName="Left"
          gridContentRange={ranges.Left}
          stickyOffsets={stickyOffsets}
          getCellOffset={(_rowIndex, colIndex) => ({
            position: "sticky",
            backgroundColor: theme.paneContainer.left.background,
            left: stickyOffsets.leftColumns[colIndex],
          })}
          shouldRender={stickyLeftColumns > 0}
        />
        <Pane
          paneName="BottomRight"
          gridContentRange={ranges.BottomRight}
          stickyOffsets={stickyOffsets}
          getCellOffset={(rowIndex, colIndex, rowSpan, colSpan) => ({
            position: "sticky",
            backgroundColor: theme.paneContainer.bottom.background,
            bottom: stickyOffsets.bottomRows.at(-rowIndex - rowSpan),
            right: stickyOffsets.rightColumns.at(-colIndex - colSpan),
          })}
          shouldRender={stickyBottomRows > 0 && stickyRightColumns > 0}
        />
        <Pane
          paneName="BottomLeft"
          gridContentRange={ranges.BottomLeft}
          stickyOffsets={stickyOffsets}
          getCellOffset={(rowIndex, colIndex, rowSpan) => ({
            position: "sticky",
            backgroundColor: theme.paneContainer.bottom.background,
            bottom: stickyOffsets.bottomRows.at(-rowIndex - rowSpan),
            left: stickyOffsets.leftColumns[colIndex],
          })}
          shouldRender={stickyBottomRows > 0 && stickyLeftColumns > 0}
        />
        <Pane
          paneName="TopRight"
          gridContentRange={ranges.TopRight}
          stickyOffsets={stickyOffsets}
          getCellOffset={(rowIndex, colIndex, _rowSpan, colSpan) => ({
            position: "sticky",
            backgroundColor: theme.paneContainer.top.background,
            top: stickyOffsets.topRows[rowIndex],
            right: stickyOffsets.rightColumns.at(-colIndex - colSpan),
          })}
          shouldRender={stickyTopRows > 0 && stickyRightColumns > 0}
        />
        <Pane
          paneName="TopLeft"
          gridContentRange={ranges.TopLeft}
          stickyOffsets={stickyOffsets}
          getCellOffset={(rowIndex, colIndex) => ({
            position: "sticky",
            backgroundColor: theme.paneContainer.top.background,
            top: stickyOffsets.topRows[rowIndex],
            left: stickyOffsets.leftColumns[colIndex],
          })}
          shouldRender={stickyTopRows > 0 && stickyLeftColumns > 0}
        />
      </div>
    </div>
  );
};

export default PanesRenderer;
