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
import { getHiddenTargetFocusByIdx } from "../utils/getHiddenTargetFocusByIdx";
import { getNumericalRange } from "../utils/getNumericalRange";
import { isSpanMember } from "../utils/isSpanMember";

const devEnvironment = isDevEnvironment();

export const ReactGrid: FC<ReactGridProps> = ({
  id,
  stickyTopRows,
  stickyBottomRows,
  stickyLeftColumns,
  stickyRightColumns,
  ...rgProps
}) => {
  const cellMatrix = useDeepCompareMemo(() => {
    return cellMatrixBuilder(({ setCell }) => {
      rgProps.cells.forEach((cell) => {
        if (cell === null) return;

        const { Template, isFocusable, isSelectable, rowSpan, colSpan, rowIndex, colIndex, props } = cell;

        setCell(rowIndex, colIndex, Template, props, {
          isFocusable,
          isSelectable,
          rowSpan,
          colSpan,
        });
      });
    });
  }, [rgProps.cells]);

  initReactGridStore(id, {
    ...rgProps,
    cells: cellMatrix,
  });

  // access store in non-reactive way
  const store = reactGridStores()[id].getState();

  const { setSelectedArea, getCellOrSpanMemberByIndexes, setExternalData } = store;

  useDeepCompareGridProps(() => {
    setExternalData({ ...rgProps, cells: cellMatrix });
  }, [rgProps]);

  useEffect(() => {
    if (!rgProps.initialSelectedRange) {
      return;
    } else {
      devEnvironment &&
        console.warn(
          "If you set initial selected range, be careful, as it may cut-trough spanned cells in an unintended way!"
        );
      if (rgProps.initialFocusLocation && devEnvironment) {
        const cell = store.getCellByIndexes(
          rgProps.initialFocusLocation.rowIndex,
          rgProps.initialFocusLocation.colIndex
        );
        if (!cell) {
          devEnvironment && console.error("There is no cell with indexes passed in initialFocusLocation prop.");
        }
      }

      const numericalInitialSelectedRange = getNumericalRange(store, rgProps.initialSelectedRange);

      setSelectedArea(numericalInitialSelectedRange);
    }
  }, []);

  useEffect(() => {
    if (rgProps.initialFocusLocation) {
      const { rowIndex, colIndex } = rgProps.initialFocusLocation;
      const cell = store.getCellByIndexes(rowIndex, colIndex);

      if (!cell) {
        return;
      }

      const targetCellOrSpanMember = getCellOrSpanMemberByIndexes(rowIndex, colIndex);

      if (devEnvironment) {
        if (!targetCellOrSpanMember) {
          console.error("The provided 'initialFocusLocation' does not exist!");
        } else if (isSpanMember(targetCellOrSpanMember))
          console.error("The provided 'initialFocusLocation' is invalid as it targets !");
      }

      getHiddenTargetFocusByIdx(rowIndex, colIndex)?.focus();
    }
  }, []);

  const rows = useReactGridStore(id, (store) => store.rows);
  const columns = useReactGridStore(id, (store) => store.columns);
  const currentBehavior = useReactGridStore(id, (store) => store.currentBehavior);
  const linePosition = useReactGridStore(id, (store) => store.linePosition);

  useDeepCompareGridProps(() => {
    const updatedColumns = columns.map((column) => {
      const customColumn = rgProps.customColumns?.find((customColumn) => customColumn.colIndex === column.colIndex);

      if (!customColumn) return column;

      return {
        ...column,
        ...customColumn,
      };
    });

    console.log("updatedColumns", updatedColumns);

    store.setColumns(updatedColumns);
  }, [rgProps.customColumns || []]);

  useDeepCompareGridProps(() => {
    const updatedRows = rows.map((row) => {
      const customRow = rgProps.customRows?.find((customColumn) => customColumn.rowIndex === row.rowIndex);

      if (!customRow) return row;

      return {
        ...row,
        ...customRow,
      };
    });

    store.setRows(updatedRows);
  }, [rgProps.customRows || []]);

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
        <GridWrapper reactGridId={id} style={{ position: "relative", ...rgProps.styles?.gridWrapper }}>
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
