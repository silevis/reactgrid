import { keyframes } from "@emotion/react";
import { FC, useEffect, useState, useTransition } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import GridWrapper from "./components/GridWrapper";
import PanesRenderer from "./components/PanesRenderer";
import { ReactGridIdProvider } from "./components/ReactGridIdProvider";
import { ReactGridProps } from "./types/PublicModel";
import { useReactGridStore as useInitReactGridStore, useReactGridStoreApi } from "./utils/reactGridStore";
import isDevEnvironment from "./utils/isDevEnvironment";
import { getCellIndexes, isSpanMember } from "./utils/cellUtils";
import { getNumericalRange } from "./utils/getNumericalRange";

const devEnvironment = isDevEnvironment();

const spin = keyframes`
100% {
  transform: rotate(360deg);
}`;

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
  // It's actually a useReactGridStore()
  useInitReactGridStore(id, (store) => null); // Init store.
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
  const [isPending, startTransition] = useTransition();
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

  if (process.env.NODE_ENV === "development" && !bypassSizeWarning && rows.length * columns.length > 25_000) {
    if (isPending) {
      return (
        <div
          css={{
            width: "10em",
            height: "10em",
            borderTop: "1em solid #d5fff7",
            borderRight: "1em solid transparent",
            borderRadius: "50%",
            margin: "auto",
            animation: `${spin} 1s linear infinite`,
          }}
        >
          <div
            style={{
              width: "1em",
              height: "1em",
              backgroundColor: "#d5fff7",
              borderRadius: "50%",
              marginLeft: "8.5em",
              marginTop: "0.5em",
            }}
          ></div>
        </div>
      );
    }

    return (
      <>
        <h1>You're about to render a huge grid!</h1>
        <p>
          The grid you provided exceeds a safety data size limit {"(>25k cells)"}. You might experience performance
          problems.
        </p>
        <p>Are you sure you want to render it all?</p>
        <button onClick={() => startTransition(() => setBypassSizeWarning(true))}>
          I understand the risk, proceed anyway.
        </button>
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

          {/* Shadow? */}
          {/* ContextMenu? */}
          {/* CellEditor */}
        </GridWrapper>
      </ErrorBoundary>
    </ReactGridIdProvider>
  );
};

export default ReactGrid;
