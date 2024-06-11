import { useEffect } from "react";
import { getCellIndexes } from "../utils/getCellIndexes.1";
import { getNumericalRange } from "../utils/getNumericalRange";
import { isSpanMember } from "../utils/isSpanMember";
import isDevEnvironment from "../utils/isDevEnvironment";
import { CellMap, Column, Location, Range } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";

const devEnvironment = isDevEnvironment();

interface ReactGridSyncProps {
  cells: CellMap<string, string>;
  columns: Column[];
  initialFocusLocation?: Location;
  initialSelectedRange?: Range;
}

export const useReactGridSync = (
  store: ReactGridStore,
  { cells, columns, initialSelectedRange, initialFocusLocation }: ReactGridSyncProps
) => {
  const {
    setSelectedArea,
    setFocusedLocation: setFocusedCell,
    getCellOrSpanMemberByIndexes,
    getCellByIds,
    setCells,
    setColumns,
  } = store;

  // sync cell data that comes from cell matrix builder with store
  useEffect(() => {
    setCells(cells);
  }, [cells]);

  // sync column data that comes from cell matrix builder with store
  useEffect(() => {
    const columnsWithMinWidthApplied = columns.map((column) => {
      const columnWidth = typeof column.width === "string" ? parseInt(column.width) : column.width;
      if (columnWidth < store.minColumnWidth) {
        return { ...column, width: store.minColumnWidth };
      }
      return column;
    });

    setColumns(columnsWithMinWidthApplied);
  }, [columns]);

  useEffect(() => {
    if (!initialSelectedRange) {
      return;
    } else {
      devEnvironment &&
        console.warn(
          "If you set initial selected range, be careful, as it may cut-trough spanned cells in an unintended way!"
        );
      if (initialFocusLocation && devEnvironment) {
        const cell = getCellByIds(initialFocusLocation.rowId, initialFocusLocation.rowId);
        if (!cell) {
          devEnvironment && console.error("There is no cell with indexes passed in initialFocusLocation prop.");
        }
      }

      const numericalInitialSelectedRange = getNumericalRange(store, initialSelectedRange);

      setSelectedArea(numericalInitialSelectedRange);
    }
  }, [initialFocusLocation, initialSelectedRange]);

  useEffect(() => {
    if (initialFocusLocation) {
      const { rowId, columnId } = initialFocusLocation;
      const cell = getCellByIds(rowId, columnId);

      if (!cell) {
        return;
      }

      const { colIndex, rowIndex } = getCellIndexes(store, cell);

      const targetCellOrSpanMember = getCellOrSpanMemberByIndexes(rowIndex, colIndex);

      if (devEnvironment) {
        if (!targetCellOrSpanMember) {
          console.error("The provided 'initialFocusLocation' does not exist!");
        } else if (isSpanMember(targetCellOrSpanMember))
          console.error("The provided 'initialFocusLocation' is invalid as it targets !");
      }

      setFocusedCell(rowIndex, colIndex);
    }
  }, [initialFocusLocation]);
};
