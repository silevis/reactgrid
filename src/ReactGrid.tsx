import { FC, useEffect, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import GridWrapper from "./components/GridWrapper";
import PanesRenderer from "./components/PanesRenderer";
import { ReactGridIdProvider } from "./components/ReactGridIdProvider";
import { ReactGridProps } from "./types/PublicModel";
import { getCellIndexes } from "./utils/getCellIndexes.1";
import { getNumericalRange } from "./utils/getNumericalRange";
import isDevEnvironment from "./utils/isDevEnvironment";
import { isSpanMember } from "./utils/isSpanMember";
import { initReactGridStore, useReactGridStore, useReactGridStoreApi } from "./utils/reactGridStore";

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
  initialSelectedRange,
  styles: userStyles,
  initialFocusLocation,
  handleSelectArea,
  handleFocusCell,
}) => {
  initReactGridStore(id, {
    rows,
    columns,
    cells,
    behaviors,
    userStyles,
  });

  const setCells = useReactGridStore(id, (store) => store.setCells);

  useEffect(() => {
    setCells(cells);
  }, [cells]);

  const store = useReactGridStoreApi(id).getState();
  const { setSelectedArea, setFocusedLocation: setFocusedCell, getCellOrSpanMemberByIndexes, getCellByIds } = store;
  const [bypassSizeWarning, setBypassSizeWarning] = useState(false);

  // TODO move to initializer
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

  // TODO move to initializer
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
        <GridWrapper reactGridId={id} style={userStyles?.gridWrapper}>
          <PanesRenderer
            rowAmount={rows.length}
            columnAmount={columns.length}
            stickyTopRows={stickyTopRows ?? 0}
            stickyBottomRows={stickyBottomRows ?? 0}
            stickyLeftColumns={stickyLeftColumns ?? 0}
            stickyRightColumns={stickyRightColumns ?? 0}
            handleSelectArea={handleSelectArea}
            handleFocusCell={handleFocusCell}
          />

          {/* TODO: Shadow for row&col reorder */}
        </GridWrapper>
      </ErrorBoundary>
    </ReactGridIdProvider>
  );
};

export default ReactGrid;
