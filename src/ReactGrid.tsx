import { FC, useEffect, useState } from "react";
import { ReactGridProps } from "./types/PublicModel";
import { useTheme } from "./utils/useTheme";
import { ReactGridIdProvider } from "./components/ReactGridIdProvider";
import { useReactGridStore } from "./utils/reactGridStore";
import GridRenderer from "./components/GridRenderer";
import PanesRenderer from "./components/PanesRenderer";
import { GridColumn, GridRow } from "./types/CellMatrix";

const ReactGrid: FC<ReactGridProps> = ({ id, rows, columns, cells, style }) => {
  // const { rows, columns, cells } = useReactGridStore(id, store => );
  // const storedProps = useReactGridStore(id, store => store.props);
  // const setProps = useReactGridStore(id, store => store.setProps);
  // setProps({ id, cellMatrix, style });

  // const setCellMatrix = useReactGridStore(id, store => store.setCellMatrix);
  const setRows = useReactGridStore(id, store => store.setRows);
  const setColumns = useReactGridStore(id, store => store.setColumns);
  const setCells = useReactGridStore(id, store => store.setCells);
  const setMeasurements = useReactGridStore(id, store => store.setMeasurements);
  const setVisibleRange = useReactGridStore(id, store => store.setVisibleRange);
  
  useEffect(() => {
    setRows(rows);
    setColumns(columns);
    setCells(cells);
    setVisibleRange({
      startRowIdx: 0,
      endRowIdx: rows.length,
      startColIdx: 0,
      endColIdx: columns.length,
    });

    const rowsMeasurements: GridRow[] = [];
    const columnsMeasurements: GridColumn[] = [];
    
    const getTop = (rowIndex: number) => {
      if (rowIndex === 0) return 0;
      return rowsMeasurements[rowIndex - 1].top + rowsMeasurements[rowIndex - 1].heightInPx;
    }
  
    const getLeft = (colIndex: number) => {
      if (colIndex === 0) return 0;
      return columnsMeasurements[colIndex - 1].left + columnsMeasurements[colIndex - 1].widthInPx;
    }

    rows.map((row, idx) => {
      const height = document.querySelector(`.rgRowId-${idx}.rgColId-0`)?.clientHeight ?? 0;
      const top = getTop(idx);

      rowsMeasurements.push({
        ...row,
        heightInPx: height,
        top,
        bottom: top + height
      });
    });
    columns.map((col, idx) => {
      const width = document.querySelector(`.rgRowId-0.rgColId-${idx}`)?.clientWidth ?? 0;
      const left = getLeft(idx);

      columnsMeasurements.push({
        ...col,
        widthInPx: width,
        left,
        right: left + width
      });
    });

    const measurements = {
      rows: rowsMeasurements,
      columns: columnsMeasurements,
      totalHeight: 0,
      totalWidth: 0,
    }

    setMeasurements(measurements);
  }, [cells, columns, rows, setCells, setColumns, setMeasurements, setRows, setVisibleRange]);

  return (
    <ReactGridIdProvider id={id}>
      <GridRenderer>
        <PanesRenderer
          cells={cells}
          rows={rows}
          columns={columns}
          range={{
            startRowIdx: 0,
            endRowIdx: rows.length,
            startColIdx: 0,
            endColIdx: columns.length,
          }}
        />
      </GridRenderer>
    </ReactGridIdProvider>
  );
};

export default ReactGrid;
