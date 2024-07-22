import { useEffect, useRef } from "react";
import { getCellIndexes } from "../utils/getCellIndexes.1";
import { getNumericalRange } from "../utils/getNumericalRange";
import { isSpanMember } from "../utils/isSpanMember";
import isDevEnvironment from "../utils/isDevEnvironment";
import { ReactGridProps } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import isEqual from "lodash.isequal";

const devEnvironment = isDevEnvironment();

export const useReactGridSync = (
  store: ReactGridStore,
  { initialSelectedRange, initialFocusLocation, ...rgProps }: Partial<ReactGridProps>
) => {
  const { setSelectedArea, setFocusedLocation, getCellOrSpanMemberByIndexes, getCellByIds, setExternalData } = store;

  function useDeepCompareGridProps(callback: () => void, dependencies: Partial<ReactGridProps>[]) {
    const currentDependenciesRef = useRef<Partial<ReactGridProps>[]>();

    if (!isEqual(currentDependenciesRef.current, dependencies)) {
      currentDependenciesRef.current = dependencies;
    }

    useEffect(callback, [currentDependenciesRef.current]);
  }

  useDeepCompareGridProps(() => {
    setExternalData(rgProps);
  }, [rgProps]);

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
  }, []);

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

      setFocusedLocation(rowIndex, colIndex);
    }
  }, []);
};
