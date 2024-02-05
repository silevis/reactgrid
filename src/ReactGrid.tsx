import { keyframes } from "@emotion/react";
import { FC, useEffect, useState, useTransition } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import GridWrapper from "./components/GridWrapper";
import PanesRenderer from "./components/PanesRenderer";
import { ReactGridIdProvider } from "./components/ReactGridIdProvider";
import { ReactGridProps } from "./types/PublicModel";
import { getCellIndexes } from "./utils/getCellIndexes.1";
import { getNumericalRange } from "./utils/getNumericalRange";
import isDevEnvironment from "./utils/isDevEnvironment";
import { isSpanMember } from "./utils/isSpanMember";
import { useReactGridStore as useInitReactGridStore, useReactGridStoreApi } from "./utils/reactGridStore";

const devEnvironment = isDevEnvironment();

const ReactGrid: FC<ReactGridProps> = ({
  id,
  rows,
  columns,
  cells,
  stickyTopRows,
  stickyBottomRows,
  stickyLeftColumns,
  stickyRightColumns,
  behaviors,
  style,
  initialSelectedRange,
  initialFocusLocation,
  styledRanges,
}) => {
  // TODO: Create store initializer instead of "initializing" with useEffect
  // It's actually a useReactGridStore()
  useInitReactGridStore(id, () => null); // Init store.
  const store = useReactGridStoreApi(id).getState();
  const {
    setRows,
    setColumns,
    setCells,
    setBehaviors,
    setSelectedArea,
    setFocusedLocation: setFocusedCell,
    getCellOrSpanMemberByIndexes,
    setStyledRanges,
    getCellByIds,
  } = store;

  const [bypassSizeWarning, setBypassSizeWarning] = useState(false);
  const [isGridStoreInitialized, setIsGridStoreInitialized] = useState(false);

  useEffect(() => {
    if (styledRanges) setStyledRanges(styledRanges);
  }, [styledRanges]);

  useEffect(() => {
    setRows(rows);
    setColumns(columns);
    setCells(cells);
    setIsGridStoreInitialized(true);
  }, [cells, columns, rows]);

  useEffect(() => {
    if (!initialSelectedRange || !isGridStoreInitialized) {
      return;
    } else {
      devEnvironment &&
        console.warn(
          "If you set initial selected range, be careful, as it may cut-trough spanned cells in an unintended way!"
        );
      if (initialFocusLocation && isDevEnvironment()) {
        const cell = getCellByIds(initialFocusLocation.rowId, initialFocusLocation.rowId);
        if (!cell) {
          devEnvironment && console.error("There is no cell with indexes passed in initialFocusLocation prop.");
        }
      }

      const numericalInitialSelectedRange = getNumericalRange(store, initialSelectedRange);

      setSelectedArea(numericalInitialSelectedRange);
    }
  }, [initialFocusLocation, initialSelectedRange, isGridStoreInitialized]);

  useEffect(() => {
    if (initialFocusLocation && isGridStoreInitialized) {
      const { rowId, columnId } = initialFocusLocation;
      const cell = getCellByIds(rowId, columnId);

      if (!cell) {
        return;
      }

      const { colIndex, rowIndex } = getCellIndexes(store, cell);

      const targetCellOrSpanMember = getCellOrSpanMemberByIndexes(rowIndex, colIndex);

      if (isDevEnvironment()) {
        if (!targetCellOrSpanMember) {
          console.error("The provided 'initialFocusLocation' does not exist!");
        } else if (isSpanMember(targetCellOrSpanMember))
          console.error("The provided 'initialFocusLocation' is invalid!");
      }

      setFocusedCell(rowIndex, colIndex);
    }
  }, [initialFocusLocation, isGridStoreInitialized]);

  useEffect(() => {
    if (behaviors) setBehaviors(behaviors);
  }, [behaviors]);

  if (devEnvironment && !bypassSizeWarning && rows.length * columns.length > 25_000) {
    return (
      <>
        <h1>You're about to render a huge grid!</h1>
        <p>
          The grid you provided exceeds 25 000 cells. You might experience performance problems. This message is
          displayed only in development environment.
        </p>
        <p>Are you sure you want to render it all?</p>
        <button onClick={() => setBypassSizeWarning(true)}>I understand, proceed anyway.</button>
      </>
    );
  }

  return (
    <ReactGridIdProvider id={id}>
      <ErrorBoundary>
        <GridWrapper reactGridId={id} style={style}>
          <PanesRenderer
            rowAmount={rows.length}
            columnAmount={columns.length}
            stickyTopRows={stickyTopRows ?? 0}
            stickyBottomRows={stickyBottomRows ?? 0}
            stickyLeftColumns={stickyLeftColumns ?? 0}
            stickyRightColumns={stickyRightColumns ?? 0}
          />

          {/* TODO: Shadow for row&col reorder */}
        </GridWrapper>
      </ErrorBoundary>
    </ReactGridIdProvider>
  );
};

export default ReactGrid;
