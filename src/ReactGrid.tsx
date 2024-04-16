import { FC, useState } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import GridWrapper from "./components/GridWrapper";
import PanesRenderer from "./components/PanesRenderer";
import { ReactGridIdProvider } from "./components/ReactGridIdProvider";
import { ReactGridProps } from "./types/PublicModel";
import isDevEnvironment from "./utils/isDevEnvironment";
import { initReactGridStore, useReactGridStoreApi } from "./utils/reactGridStore";
import { useReactGridSync } from "./hooks/useReactGridSync";

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
  onAreaSelected,
  onFillHandle,
  onCellFocused,
}) => {
  initReactGridStore(id, {
    rows,
    columns,
    cells,
    behaviors,
    userStyles,
    styledRanges,
    onFillHandle,
  });

  const store = useReactGridStoreApi(id).getState();

  useReactGridSync(store, { cells, initialSelectedRange, initialFocusLocation });

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
        <GridWrapper reactGridId={id} style={userStyles?.gridWrapper}>
          <PanesRenderer
            rowAmount={rows.length}
            columnAmount={columns.length}
            stickyTopRows={stickyTopRows ?? 0}
            stickyBottomRows={stickyBottomRows ?? 0}
            stickyLeftColumns={stickyLeftColumns ?? 0}
            stickyRightColumns={stickyRightColumns ?? 0}
            onAreaSelected={onAreaSelected}
            onCellFocused={onCellFocused}
          />

          {/* TODO: Shadow for row&col reorder */}
        </GridWrapper>
      </ErrorBoundary>
    </ReactGridIdProvider>
  );
};

export default ReactGrid;
