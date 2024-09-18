import { useEffect, useRef } from "react";
import { deepCompare } from "../utils/deepCompare";
import { CellMatrix } from "../types/CellMatrix";
import { ReactGridStore, ReactGridStoreProps } from "../types/ReactGridStore";
import isEqual from "lodash.isequal";

export const useReactGridSync = (
  store: ReactGridStore,
  cellMatrix: CellMatrix,
  rgProps: Partial<ReactGridStoreProps>
) => {
  const previousGridProps = useRef<Partial<ReactGridStoreProps> | null>(null);

  // sync props with store in case of one of them changes
  useEffect(() => {
    // perform a deep comparison of props to avoid unnecessary updates
    if (!deepCompare(previousGridProps.current, rgProps)) {
      store.setExternalData({ ...rgProps });
      previousGridProps.current = rgProps;
    }
  }, [rgProps]);

  // sync rows with store
  useEffect(() => {
    if (!isEqual(cellMatrix.rows, store.rows)) {
      store.setExternalData({ rows: cellMatrix.rows });
    }
  }, [cellMatrix.rows]);

  // sync columns with store
  useEffect(() => {
    if (!isEqual(cellMatrix.columns, store.columns)) {
      store.setExternalData({ columns: cellMatrix.columns });
    }
  }, [cellMatrix.columns]);

  // sync cells with store
  useEffect(() => {
    if (!isEqual(cellMatrix.cells, store.cells)) {
      store.setExternalData({ cells: cellMatrix.cells });
    }
  }, [cellMatrix.cells]);
};
