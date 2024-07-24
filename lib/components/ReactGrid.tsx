import { FC, useState } from "react";
import { ErrorBoundary } from "./ErrorBoundary";
import GridWrapper from "./GridWrapper";
import PanesRenderer from "./PanesRenderer";
import { ReactGridIdProvider } from "./ReactGridIdProvider";
import { ReactGridProps } from "../types/PublicModel";
import isDevEnvironment from "../utils/isDevEnvironment";
import { initReactGridStore, reactGridStores, useReactGridStore } from "../utils/reactGridStore";
import { useReactGridSync } from "../hooks/useReactGridSync";
import { Line } from "./Line";
import { Shadow } from "./Shadow";
import { isReorderBehavior } from "../utils/isReorderBehavior";

const devEnvironment = isDevEnvironment();

export const ReactGrid: FC<ReactGridProps> = ({
  id,
  stickyTopRows,
  stickyBottomRows,
  stickyLeftColumns,
  stickyRightColumns,
  ...rgProps
}) => {
  initReactGridStore(id, {
    ...rgProps,
  });

  // access store in non-reactive way
  const store = reactGridStores()[id].getState();

  const currentBehavior = useReactGridStore(id, (store) => store.currentBehavior);
  const linePosition = useReactGridStore(id, (store) => store.linePosition);

  useReactGridSync(store, rgProps);

  const [bypassSizeWarning, setBypassSizeWarning] = useState(false);

  if (devEnvironment && !bypassSizeWarning && rgProps.rows.length * rgProps.columns.length > 25_000) {
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
        <GridWrapper reactGridId={id} style={{ position: "relative", ...rgProps.styles?.gridWrapper }}>
          <PanesRenderer
            rowAmount={rgProps.rows.length}
            columnAmount={rgProps.columns.length}
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