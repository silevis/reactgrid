import { Behavior } from "../types/Behavior.ts";
import { ReactGridStore } from "../types/ReactGridStore.ts";
import { calcSelectedAreaWidth } from "../utils/calcSelectedAreaWidth.ts";
import { getCellContainer } from "../utils/getCellContainer.ts";
import { getCellContainerFromPoint } from "../utils/getCellContainerFromPoint.ts";
import { getCellIndexesFromContainerElement } from "../utils/getCellIndexes.ts";
import { getLastColumnMetrics } from "../utils/getLastColumnMetrics.ts";
import isDevEnvironment from "../utils/isDevEnvironment.ts";

const devEnvironment = isDevEnvironment();

let initialMouseXPos = 0;

export const ColumnReorderBehavior: Behavior = {
  id: "ColumnReorder",
  handlePointerDown: function (event, store): ReactGridStore {
    devEnvironment && console.log("CRB/handlePointerDown");

    return store;
  },

  handlePointerMove: (event, store) => {
    devEnvironment && console.log("CRB/handlePointerMove");

    if (!initialMouseXPos) {
      initialMouseXPos = event.clientX;
    }

    const selectedAreaWidth = calcSelectedAreaWidth(store);

    const { lastColumnRelativeffsetLeft, lastColumnWidth } = getLastColumnMetrics(store);

    const firstSelectedHeaderCell = store.getCellByIndexes(0, store.selectedArea.startColIdx);

    if (!firstSelectedHeaderCell) return store;

    const cellContainer = getCellContainer(store, firstSelectedHeaderCell);

    const cellContainerOffsetLeft = (cellContainer as HTMLElement).offsetLeft;

    let shadowPosition = cellContainerOffsetLeft + (event.clientX - initialMouseXPos);

    let linePosition = undefined;

    const element = getCellContainerFromPoint(event.clientX, event.clientY);

    if (!element) return store;

    if (event.clientX > (cellContainer as HTMLElement).getBoundingClientRect().left + selectedAreaWidth) {
      linePosition = element!.offsetLeft + element.offsetWidth;
    } else if (event.clientX < (cellContainer as HTMLElement).getBoundingClientRect().left - 1) {
      linePosition = element.offsetLeft;
    }

    // Ensure the shadow doesn't go beyond the first column
    if (shadowPosition < 0) {
      shadowPosition = 0;
    }

    // Ensure the shadow doesn't go beyond the last column
    if (shadowPosition + selectedAreaWidth >= lastColumnRelativeffsetLeft + lastColumnWidth) {
      shadowPosition = lastColumnRelativeffsetLeft + lastColumnWidth - selectedAreaWidth;
    }

    return {
      ...store,
      shadowSize: selectedAreaWidth,
      shadowPosition: shadowPosition,
      linePosition,
    };
  },

  handlePointerUp: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerUp");

    initialMouseXPos = 0;

    const selectedArea = store.selectedArea;
    const cols = store.columns;

    // const selectedColIds = cols.slice(selectedArea.startColIdx, selectedArea.endColIdx).map((col) => col.id);

    const selectedColIndexes = Array.from(
      { length: selectedArea.endColIdx - selectedArea.startColIdx },
      (_, i) => i + selectedArea.startColIdx
    );

    const element = getCellContainerFromPoint(event.clientX, event.clientY);

    if (!element) return store;

    const destinationIdx = getCellIndexesFromContainerElement(element);

    if (!destinationIdx) return store;

    if (!element || !destinationIdx) return store;

    store.onColumnReorder?.(selectedColIndexes, destinationIdx.colIndex);

    // --------------------------------------------------------------------------------------------

    const { lastColumnWidth, lastColumnClientOffsetLeft } = getLastColumnMetrics(store);

    if (event.clientX > lastColumnClientOffsetLeft + lastColumnWidth) {
      console.log("beyond last column");

      // TODO
      // return {
      //   ...store,
      //   currentBehavior: store.getBehavior("Default"),
      //   selectedArea: {
      //     startRowIdx: 0,
      //     endRowIdx: store.rows.length,
      //     startColIdx: destinationIdx.colIndex,
      //     endColIdx: destinationIdx.colIndex + store.selectedArea.endColIdx - store.selectedArea.startColIdx,
      //   },
      //   shadowPosition: undefined,
      //   linePosition: undefined,
      //   shadowSize: undefined,
      // };
    }

    // --------------------------------------------------------------------------------------------

    return {
      ...store,
      currentBehavior: store.getBehavior("Default"),
      selectedArea: {
        startRowIdx: 0,
        endRowIdx: store.rows.length,
        startColIdx: destinationIdx.colIndex,
        endColIdx: destinationIdx.colIndex + store.selectedArea.endColIdx - store.selectedArea.startColIdx,
      },
      shadowPosition: undefined,
      linePosition: undefined,
      shadowSize: undefined,
    };
  },

  handlePointerHold: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerHold");
    return store;
  },

  handlePointerHoldTouch: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerHoldTouch");
    return store;
  },

  handlePointerDownTouch: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerDownTouch");

    return store;
  },

  handlePointerMoveTouch: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerMoveTouch");

    return store;
  },

  handlePointerUpTouch: function (event, store) {
    devEnvironment && console.log("CRB/handlePointerUpTouch");

    return store;
  },
};
