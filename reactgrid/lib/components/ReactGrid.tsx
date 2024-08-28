import { FC, useEffect, useRef, useState } from "react";
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
import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import { useInitialFocusLocation } from "../hooks/useInitialFocusLocation";
import { useInitialSelectedRange } from "../hooks/useInitialSelectedRange";
import { v4 as uuidv4 } from "uuid";

const devEnvironment = isDevEnvironment();

export const ReactGrid: FC<ReactGridProps> = ({
  id,
  stickyTopRows,
  stickyBottomRows,
  stickyLeftColumns,
  stickyRightColumns,
  ...rgProps
}) => {
  const reactGridId = useRef(id ?? `rg-${uuidv4()}`);

  const cellMatrix = useDeepCompareMemo(() => {
    return cellMatrixBuilder(rgProps.rows, rgProps.columns, ({ setCell }) => {
      rgProps.cells.forEach((cell) => {
        if (cell === null) return;

        const { Template, rowIndex, colIndex, props, ...args } = cell;

        setCell(rowIndex, colIndex, Template, props, args);
      });
    });
  }, [rgProps.rows, rgProps.columns, rgProps.cells]);

  initReactGridStore(reactGridId.current, {
    ...rgProps,
    ...cellMatrix,
  });

  // access store in non-reactive way
  const store = reactGridStores()[reactGridId.current].getState();

  useDeepCompareGridProps(() => {
    store.setExternalData({ ...rgProps, ...cellMatrix });
  }, [rgProps]);

  useInitialSelectedRange(store, rgProps, devEnvironment);
  useInitialFocusLocation(store, rgProps, devEnvironment);

  const rows = useReactGridStore(reactGridId.current, (store) => store.rows);
  const columns = useReactGridStore(reactGridId.current, (store) => store.columns);
  const currentBehavior = useReactGridStore(reactGridId.current, (store) => store.currentBehavior);
  const linePosition = useReactGridStore(reactGridId.current, (store) => store.linePosition);

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
    <ReactGridIdProvider id={reactGridId.current}>
      <ErrorBoundary>
        <GridWrapper reactGridId={reactGridId.current} style={{ position: "relative", ...rgProps.styles?.gridWrapper }}>
          <PanesRenderer
            rowAmount={rows.length}
            columnAmount={columns.length}
            stickyTopRows={stickyTopRows ?? 0}
            stickyBottomRows={stickyBottomRows ?? 0}
            stickyLeftColumns={stickyLeftColumns ?? 0}
            stickyRightColumns={stickyRightColumns ?? 0}
          />
          {linePosition && <Line />}
          {isReorderBehavior(currentBehavior.id) && <Shadow />}
        </GridWrapper>
      </ErrorBoundary>
    </ReactGridIdProvider>
  );
};

function useDeepCompareGridProps(callback: () => void, dependencies: Partial<unknown>[]) {
  const currentDependenciesRef = useRef<Partial<unknown>[]>();

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    currentDependenciesRef.current = cloneDeep(dependencies);
  }

  useEffect(callback, [currentDependenciesRef.current]);
}
