import { keyframes } from "@emotion/react";
import { FC, useEffect, useState, useTransition } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import GridWrapper from "./components/GridWrapper";
import PanesRenderer from "./components/PanesRenderer";
import { ReactGridIdProvider } from "./components/ReactGridIdProvider";
import { ReactGridProps } from "./types/PublicModel";
import { useReactGridStore } from "./utils/reactGridStore";

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
}) => {
  const setRows = useReactGridStore(id, (store) => store.setRows);
  const setColumns = useReactGridStore(id, (store) => store.setColumns);
  const setCells = useReactGridStore(id, (store) => store.setCells);
  const setBehaviors = useReactGridStore(id, (store) => store.setBehaviors);

  const [bypassSizeWarning, setBypassSizeWarning] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setRows(rows);
    setColumns(columns);
    setCells(cells);
  }, [cells, columns, rows]);

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
          The grid you provided exceeds a safety data size limit {"(>25k cells)"}. 
          You might experience performance problems.
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
