import { useEffect, useRef } from "react";
import { deepCompare } from "../utils/deepCompare";
import { CellMatrix } from "../types/CellMatrix";
import { ReactGridStore, ReactGridStoreProps } from "../types/ReactGridStore";

export const useReactGridSync = (
  store: ReactGridStore,
  cellMatrix: CellMatrix,
  rgProps: Partial<ReactGridStoreProps>
) => {
  const previousGridProps = useRef<Partial<ReactGridStoreProps> | null>(null);

  // sync props with store in case of one of them changes
  useEffect(() => {
    // deep compare to avoid unnecessary updates
    if (!deepCompare(previousGridProps.current, rgProps)) {
      store.setExternalData({ ...rgProps });
      previousGridProps.current = rgProps;
    }
  }, [rgProps]);

  // sync rows with store
  useEffect(() => {
    store.setExternalData({ rows: cellMatrix.rows });
  }, [cellMatrix.rows]);

  // sync columns with store
  useEffect(() => {
    store.setExternalData({ columns: cellMatrix.columns });
  }, [cellMatrix.columns]);

  // sync cells with store
  useEffect(() => {
    store.setExternalData({ cells: cellMatrix.cells });
  }, [cellMatrix.cells]);
};
