import { FC, useRef, useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import GridWrapper from "./GridWrapper";
import PanesRenderer from "./PanesRenderer";
import { ReactGridIdProvider } from "./ReactGridIdProvider";
import { ReactGridProps } from "../types/PublicModel";
import isDevEnvironment from "../utils/isDevEnvironment";
import { initReactGridStore, reactGridStores, useReactGridStore } from "../utils/reactGridStore";
import { Line } from "./Line";
import { Shadow } from "./Shadow";
import { isReorderBehavior } from "../utils/isReorderBehavior";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";
import { useDeepCompareMemo } from "../hooks/useDeepCompareMemo";
import { useInitialFocusLocation } from "../hooks/useInitialFocusLocation";
import { useInitialSelectedRange } from "../hooks/useInitialSelectedRange";
import { v4 as uuidv4 } from "uuid";
import { useReactGridSync } from "../hooks/useReactGridSync";

const devEnvironment = isDevEnvironment();

export const ReactGrid: FC<ReactGridProps> = ({
  id,
  stickyTopRows,
  stickyBottomRows,
  stickyLeftColumns,
  stickyRightColumns,
  rows,
  columns,
  cells,
  ...rgProps
}) => {
  const reactGridId = useRef(id ?? `rg-${uuidv4()}`);

  const cellMatrix = useDeepCompareMemo(() => {
    return cellMatrixBuilder(rows, columns, ({ setCell }) => {
      cells.forEach((cell) => {
        if (cell === null) return;

        const { Template, rowIndex, colIndex, props, ...args } = cell;

        setCell(rowIndex, colIndex, Template, props, args);
      });
    });
  }, [rows, columns, cells]);

  initReactGridStore(reactGridId.current, {
    ...rgProps,
    ...cellMatrix,
  });

  // access store in non-reactive way
  const store = reactGridStores()[reactGridId.current].getState();

  useReactGridSync(store, cellMatrix, rgProps);

  useInitialSelectedRange(store, rgProps, devEnvironment);
  useInitialFocusLocation(store, rgProps, devEnvironment);

  const currentBehavior = useReactGridStore(reactGridId.current, (store) => store.currentBehavior);
  const linePosition = useReactGridStore(reactGridId.current, (store) => store.linePosition);

  const [bypassSizeWarning, setBypassSizeWarning] = useState(false);

  if (devEnvironment && !bypassSizeWarning && cellMatrix.rows.length * cellMatrix.columns.length > 25_000) {
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
    <ReactGridIdProvider id={reactGridId.current}>
      <ErrorBoundary>
        <GridWrapper reactGridId={reactGridId.current} style={{ position: "relative", ...rgProps.styles?.gridWrapper }}>
          <PanesRenderer
            cells={cellMatrix.cells}
            rowAmount={cellMatrix.rows.length}
            columnAmount={cellMatrix.columns.length}
            stickyTopRows={stickyTopRows ?? 0}
            stickyBottomRows={stickyBottomRows ?? 0}
            stickyLeftColumns={stickyLeftColumns ?? 0}
            stickyRightColumns={stickyRightColumns ?? 0}
          />
          {linePosition !== undefined && <Line />}
          {isReorderBehavior(currentBehavior.id) && <Shadow />}
        </GridWrapper>
      </ErrorBoundary>
    </ReactGridIdProvider>
  );
};
