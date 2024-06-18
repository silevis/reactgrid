import { FC, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import GridWrapper from "./components/GridWrapper";
import PanesRenderer from "./components/PanesRenderer";
import { ReactGridIdProvider } from "./components/ReactGridIdProvider";
import { ReactGridProps } from "./types/PublicModel";
import isDevEnvironment from "./utils/isDevEnvironment";
import { initReactGridStore, reactGridStores, useReactGridStore } from "./utils/reactGridStore";
import { useReactGridSync } from "./hooks/useReactGridSync";
import { Line } from "./components/Line";
import { ColumnReorderBehavior } from "./behaviors/ColumnReorderBehavior";
import { Shadow } from "./components/Shadow";
import { RowReorderBehavior } from "./behaviors/RowReorderBehavior";

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
  styles: userStyles,
  styledRanges,
  initialSelectedRange,
  initialFocusLocation,
  enableColumnSelectionOnFirstRow,
  enableRowSelectionOnFirstColumn,
  minColumnWidth,
  onAreaSelected,
  onFillHandle,
  onCellFocused,
  onCut,
  onPaste,
  onCopy,
  onResizeColumn,
  onColumnReorder,
  onRowReorder,
}) => {
  initReactGridStore(id, {
    rows,
    columns,
    cells,
    behaviors,
    userStyles,
    styledRanges,
    minColumnWidth,
    enableColumnSelectionOnFirstRow,
    enableRowSelectionOnFirstColumn,
    onFillHandle,
    onAreaSelected,
    onCellFocused,
    onCut,
    onCopy,
    onResizeColumn,
    onColumnReorder,
    onRowReorder,
    onPaste,
  });

  const store = reactGridStores()[id].getState();

  const currentBehavior = useReactGridStore(id, (store) => store.currentBehavior);
  const linePosition = useReactGridStore(id, (store) => store.linePosition);

  useReactGridSync(store, { cells, rows, columns, initialSelectedRange, initialFocusLocation });

  const [bypassSizeWarning, setBypassSizeWarning] = useState(false);

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
        <GridWrapper reactGridId={id} style={{ position: "relative", ...userStyles?.gridWrapper }}>
          <PanesRenderer
            rowAmount={rows.length}
            columnAmount={columns.length}
            stickyTopRows={stickyTopRows ?? 0}
            stickyBottomRows={stickyBottomRows ?? 0}
            stickyLeftColumns={stickyLeftColumns ?? 0}
            stickyRightColumns={stickyRightColumns ?? 0}
          />
          {linePosition && <Line />}
          {(currentBehavior.id === ColumnReorderBehavior.id || currentBehavior.id === RowReorderBehavior.id) && (
            <Shadow />
          )}
        </GridWrapper>
      </ErrorBoundary>
    </ReactGridIdProvider>
  );
};

export default ReactGrid;
