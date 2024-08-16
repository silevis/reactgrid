import { useEffect } from "react";
import { ReactGridProps } from "../types/PublicModel";
import { getNumericalRange } from "../utils/getNumericalRange";
import { ReactGridStore } from "../types/ReactGridStore";

export const useInitialSelectedRange = (
  store: ReactGridStore,
  rgProps: Partial<ReactGridProps>,
  devEnvironment: boolean
) => {
  useEffect(() => {
    if (!rgProps.initialSelectedRange) {
      return;
    } else {
      devEnvironment &&
        console.warn(
          "If you set initial selected range, be careful, as it may cut-trough spanned cells in an unintended way!"
        );
      if (rgProps.initialFocusLocation && devEnvironment) {
        const cell = store.getCellByIndexes(
          rgProps.initialFocusLocation.rowIndex,
          rgProps.initialFocusLocation.colIndex
        );
        if (!cell) {
          devEnvironment && console.error("There is no cell with indexes passed in initialFocusLocation prop.");
        }
      }

      const numericalInitialSelectedRange = getNumericalRange(store, rgProps.initialSelectedRange);

      store.setSelectedArea(numericalInitialSelectedRange);
    }
  }, []);
};
