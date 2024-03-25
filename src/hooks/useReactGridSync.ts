import { useEffect } from "react";
import { getCellIndexes } from "../utils/getCellIndexes.1";
import { getNumericalRange } from "../utils/getNumericalRange";
import { isSpanMember } from "../utils/isSpanMember";
import isDevEnvironment from "../utils/isDevEnvironment";
import { CellMap, Location, Range } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";

const devEnvironment = isDevEnvironment();

interface ReactGridSyncProps {
  cells: CellMap<string, string>;
  initialFocusLocation?: Location;
  initialSelectedRange?: Range;
}

export const useReactGridSync = (
  store: ReactGridStore,
  { cells, initialSelectedRange, initialFocusLocation }: ReactGridSyncProps
) => {
  const {
    setSelectedArea,
    setFocusedLocation: setFocusedCell,
    getCellOrSpanMemberByIndexes,
    getCellByIds,
    setCells,
  } = store;

  // sync cell data that comes from cell matrix builder with store
  useEffect(() => {
    setCells(cells);
  }, [cells]);

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
