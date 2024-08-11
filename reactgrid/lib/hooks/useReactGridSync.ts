/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { getNumericalRange } from "../utils/getNumericalRange";
import { isSpanMember } from "../utils/isSpanMember";
import isDevEnvironment from "../utils/isDevEnvironment";
import { ReactGridProps } from "../types/PublicModel";
import { ReactGridStore } from "../types/ReactGridStore";
import isEqual from "lodash.isequal";
import { getHiddenTargetFocusByIdx } from "../utils/getHiddenTargetFocusByIdx";
import { CellMatrix } from "../types/CellMatrix";
import cloneDeep from "lodash.clonedeep";

const devEnvironment = isDevEnvironment();

export const useReactGridSync = (
  store: ReactGridStore,
  { initialSelectedRange, initialFocusLocation, ...rgProps }: Partial<ReactGridProps>,
  cellMatrix: CellMatrix
) => {
  const { setSelectedArea, getCellOrSpanMemberByIndexes, setExternalData } = store;

  function useDeepCompareGridProps(callback: () => void, dependencies: Partial<any>[]) {
    const currentDependenciesRef = useRef<Partial<any>[]>();

    if (!isEqual(currentDependenciesRef.current, dependencies)) {
      currentDependenciesRef.current = cloneDeep(dependencies);
    }

    useEffect(callback, [currentDependenciesRef.current]);
  }

  useDeepCompareGridProps(() => {
    setExternalData(rgProps);
  }, [rgProps]);

  useDeepCompareGridProps(() => {
    setExternalData({ cells: cellMatrix });
  }, [cellMatrix]);

  useEffect(() => {
    if (!initialSelectedRange) {
      return;
    } else {
      devEnvironment &&
        console.warn(
          "If you set initial selected range, be careful, as it may cut-trough spanned cells in an unintended way!"
        );
      if (initialFocusLocation && devEnvironment) {
        const cell = store.getCellByIndexes(initialFocusLocation.rowIndex, initialFocusLocation.colIndex);
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
      const { rowIndex, colIndex } = initialFocusLocation;
      const cell = store.getCellByIndexes(rowIndex, colIndex);

      if (!cell) {
        return;
      }

      const targetCellOrSpanMember = getCellOrSpanMemberByIndexes(rowIndex, colIndex);

      if (devEnvironment) {
        if (!targetCellOrSpanMember) {
          console.error("The provided 'initialFocusLocation' does not exist!");
        } else if (isSpanMember(targetCellOrSpanMember))
          console.error("The provided 'initialFocusLocation' is invalid as it targets !");
      }

      getHiddenTargetFocusByIdx(rowIndex, colIndex)?.focus();
    }
  }, []);
};
