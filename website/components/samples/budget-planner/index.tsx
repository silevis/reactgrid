"use client";

import * as React from "react";
import {
  ReactGrid,
  Row,
  CellChange,
  DefaultCellTypes,
  NumberCell,
  Id,
  DropPosition,
  MenuOption,
  SelectionMode,
} from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import "./styling.scss";
import {
  getDataFromRows,
  createIndents,
  getExpandedRows,
  getDataFromColumns,
  fillCellMatrixHorizontally,
  fillCellMatrixVertically,
  getChevronCell,
  getDirectChildrenRows,
  getParentRow,
  extendWithColIds,
  getExpandedCells,
  getColumnsIdsxToRender,
  filterCellsOnRows,
  resetAggregatedMonthFields,
} from "./helpers-functions";
import { dataRows, topHeaderRow, filledYear, emptyYear } from "./rows";
import { dataColumns, BPColumn } from "./columns";
import {
  HorizontalChevronCell,
  HorizontalChevronCellTemplate,
} from "../cell-templates/horizontal-chevron-cell-template/horizontal-chevron-cell-template";
import { reorderArray } from "./reorder-array";
import {
  nonEditableNumberCellTemplate,
  NonEditableNumberCell,
} from "./cell-templates";

export type RowCells =
  | DefaultCellTypes
  | HorizontalChevronCell
  | NonEditableNumberCell;
export type BPRow = Row<RowCells>;

export type RowPair = { from: BPRow; to: BPRow };

interface BPState {
  columns: BPColumn[];
  rows: BPRow[];
}

export const BPSample: React.FC = () => {
  const [state, setState] = React.useState<BPState>(() => {
    let rows = [...dataRows];
    let columns = [...dataColumns];
    columns = getDataFromColumns(columns);
    rows = getDataFromRows(rows);
    rows = fillCellMatrixHorizontally(rows);
    fillCellMatrixVertically(rows);
    rows = createIndents(rows);
    return {
      columns: [dataColumns[0], ...columns],
      rows: [topHeaderRow, ...rows],
    };
  });

  const [columnsToRender, setColumnsToRender] = React.useState<BPColumn[]>(
    () => {
      const extendedTopHeaderRow = extendWithColIds(topHeaderRow, [
        ...dataColumns,
      ]);
      const expandedCells = getExpandedCells(extendedTopHeaderRow.cells);
      return state.columns.filter((col) =>
        expandedCells.find(
          (expCell) =>
            (expCell as HorizontalChevronCell).columnId === col.columnId
        )
      );
    }
  );

  const [rowsToRender, setRowsToRender] = React.useState<BPRow[]>(() => {
    const topHeaderRowWithColumnIds = extendWithColIds(topHeaderRow, [
      ...dataColumns,
    ]);
    const expandedRows = getExpandedRows(state.rows);
    const idxs = getColumnsIdsxToRender(
      topHeaderRowWithColumnIds.cells,
      columnsToRender
    );
    return filterCellsOnRows(expandedRows, idxs);
  });

  const handleChanges = (changes: CellChange<RowCells>[]) => {
    const newState = { ...state };
    changes.forEach((change) => {
      const changeRowIdx = newState.rows.findIndex(
        (el) => el.rowId === change.rowId
      );
      const changeColumnIdx = newState.columns.findIndex(
        (el) => el.columnId === change.columnId
      );
      if (changeRowIdx === 0) {
        newState.rows[changeRowIdx].cells[changeColumnIdx] = {
          ...change.newCell,
          text: (change.previousCell as HorizontalChevronCell).text,
        } as HorizontalChevronCell;
      } else {
        if (
          (change.newCell.type === "number" ||
            change.newCell.type === "nonEditableNumber") &&
          change.newCell.className?.includes("quarter")
        ) {
          const chevronCell = getChevronCell(newState.rows[changeRowIdx]);
          if (!chevronCell.hasChildren) {
            updateNodeQuarter(
              newState,
              change.newCell.value,
              changeRowIdx,
              changeColumnIdx
            );
          }
        } else {
          newState.rows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
        }
      }
    });
    newState.rows.forEach((row) => {
      resetAggregatedMonthFields(row);
    });
    const rows = fillCellMatrixHorizontally(newState.rows);
    fillCellMatrixVertically(rows);
    const expandedCells = getExpandedCells(topHeaderRow.cells);
    const columnsToRender = newState.columns.filter((col) =>
      expandedCells.find(
        (expandedCell) =>
          (expandedCell as HorizontalChevronCell).columnId === col.columnId
      )
    );
    const idxs = getColumnsIdsxToRender(topHeaderRow.cells, columnsToRender);
    const expandedRows = getExpandedRows(rows);
    setColumnsToRender([...columnsToRender]);
    setState({ ...state, rows: createIndents(rows) });
    setRowsToRender([...filterCellsOnRows(expandedRows, idxs)]);
  };

  const updateNodeQuarter = (
    state: BPState,
    valueToDivide: number,
    changeRowIdx: number,
    changeColumnIdx: number
  ) => {
    const partialValue = valueToDivide / 3;
    for (let i = 1; i < 4; i++) {
      (
        state.rows[changeRowIdx].cells[changeColumnIdx + i] as NumberCell
      ).value = partialValue;
    }
  };

  const handleRowsReorder = (
    targetRowId: Id,
    rowIds: Id[],
    dropPosition: DropPosition
  ) => {
    const newState = { ...state };
    let to = newState.rows.findIndex((row) => row.rowId === targetRowId);
    let rowIdxs = rowIds.map((id) =>
      state.rows.findIndex((r) => r.rowId === id)
    );

    if (rowIdxs.length === 1) {
      const row = newState.rows[rowIdxs[0]];
      rowIdxs = [
        row,
        ...Array.from(new Set(getRowChildren(newState.rows, [], row))),
      ].map((item) =>
        newState.rows.findIndex((r) => r.rowId === (item as BPRow).rowId)
      );

      const onRow = newState.rows.find((row) => row.rowId === targetRowId);
      if (onRow) {
        const movingRowRoot = getChevronCell(row);
        if (dropPosition === "on") {
          movingRowRoot.parentId = onRow.rowId;
          const onRowIndex = newState.rows.indexOf(onRow);
          const rowIndex = newState.rows.indexOf(row);
          if (rowIndex >= onRowIndex) {
            to += 1;
          }
        } else {
          const parentRow = getParentRow(newState.rows, onRow);
          if (dropPosition === "after") {
            movingRowRoot.parentId = onRow.rowId;
          }
          if (parentRow) {
            movingRowRoot.parentId = parentRow.rowId;
            if (dropPosition === "after") {
              movingRowRoot.parentId = onRow.rowId;
            }
          } else {
            if (dropPosition === "before") {
              movingRowRoot.parentId = undefined;
              movingRowRoot.indent = undefined;
            }
          }
        }
      }
    }

    const reorderedRows = reorderArray(newState.rows, rowIdxs, to);

    setState({ ...newState, rows: createIndents(reorderedRows) });
    setRowsToRender([...getExpandedRows(reorderedRows)]);
  };

  const handleCanReorderRows = (
    targetRowId: Id,
    rowIds: Id[],
    dropPosition: DropPosition
  ): boolean => {
    const newState = { ...state };
    const rowIdxs = rowIds.map((id) =>
      newState.rows.findIndex((row) => row.rowId === id)
    );
    if (rowIdxs.length === 1 && targetRowId !== topHeaderRow.rowId) {
      const row = newState.rows[rowIdxs[0]];
      const rowChildren = Array.from(
        new Set(getRowChildren(newState.rows, [], row))
      );
      if (rowChildren.some((item) => item.rowId === targetRowId)) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  };

  const getRowChildren = (rows: BPRow[], acc: BPRow[], row: BPRow) => {
    const rowsChildren = getDirectChildrenRows(rows, row);
    if (!rowsChildren) return [];

    rowsChildren.forEach((childRow) => {
      acc.push(...getRowChildren(rows, rowsChildren, childRow));
    });
    return acc;
  };

  const handleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[]
  ): MenuOption[] => {
    if (
      selectionMode === "row" &&
      selectedRowIds.length === 1 &&
      selectedRowIds[0] !== "topHeader"
    ) {
      const newState = { ...state };
      menuOptions = [
        ...menuOptions,
        {
          id: "addRow",
          label: "Add child row",
          handler: (
            selectedRowIds: Id[],
            selectedColIds: Id[],
            selectionMode: SelectionMode
          ) => {
            if (selectedRowIds.length === 1) {
              const selectedRowIdx = newState.rows.findIndex(
                (row) => row.rowId === selectedRowIds[0]
              );
              const selectedRow = newState.rows[selectedRowIdx];
              const emptyRow: BPRow = {
                rowId: Date.now(),
                reorderable: true,
                cells: [
                  {
                    type: "chevron",
                    text: `New row`,
                    parentId: selectedRowIds[0],
                    isExpanded: false,
                  },
                  ...filledYear(0, 0),
                  ...filledYear(0, 0),
                ],
              };

              const changedSelectedRow: BPRow = {
                ...selectedRow,
                cells: [selectedRow.cells[0], ...emptyYear(), ...emptyYear()],
              };

              const newRows = [
                ...newState.rows.slice(0, selectedRowIdx),
                changedSelectedRow,
                emptyRow,
                ...newState.rows.slice(
                  selectedRowIdx + 1,
                  newState.rows.length
                ),
              ];
              const expandedRows = getExpandedRows(newRows);
              const idxs = getColumnsIdsxToRender(
                topHeaderRow.cells,
                columnsToRender
              );
              const rows = fillCellMatrixHorizontally(newRows);
              fillCellMatrixVertically(rows);
              setState({ ...state, rows: createIndents(rows) });
              setRowsToRender([...filterCellsOnRows(expandedRows, idxs)]);
            }
          },
        },
        {
          id: "removeRow",
          label: "Remove row",
          handler: (
            selectedRowIds: Id[],
            selectedColIds: Id[],
            selectionMode: SelectionMode
          ) => {
            if (selectedRowIds.length === 1) {
              const selectedRowIdx = newState.rows.findIndex(
                (row) => row.rowId === selectedRowIds[0]
              );
              const selectedRow = newState.rows[selectedRowIdx];

              const rowsToRemove: BPRow[] = [
                selectedRow,
                ...Array.from(
                  new Set(getRowChildren(state.rows, [], selectedRow))
                ),
              ];

              const newRows = newState.rows.filter(
                (row) =>
                  !rowsToRemove.some(
                    (rowToRemove) => rowToRemove.rowId === row.rowId
                  )
              );
              newRows.forEach((row) => {
                resetAggregatedMonthFields(row);
              });
              const expandedRows = getExpandedRows(newRows);
              const idxs = getColumnsIdsxToRender(
                topHeaderRow.cells,
                columnsToRender
              );
              const rows = fillCellMatrixHorizontally(newRows);
              fillCellMatrixVertically(rows);
              setState({ ...state, rows: createIndents(rows) });
              setRowsToRender([...filterCellsOnRows(expandedRows, idxs)]);
            }
          },
        },
      ];
    }
    return menuOptions;
  };

  return (
    <div className="bp-sample">
      <ReactGrid
        rows={rowsToRender}
        columns={columnsToRender}
        onCellsChanged={handleChanges}
        stickyTopRows={1}
        stickyLeftColumns={1}
        customCellTemplates={{
          horizontalChevron: new HorizontalChevronCellTemplate(),
          nonEditableNumber: nonEditableNumberCellTemplate,
        }}
        onRowsReordered={handleRowsReorder}
        canReorderRows={handleCanReorderRows}
        onContextMenu={handleContextMenu}
        enableRangeSelection
        enableFillHandle
        enableRowSelection
      />
    </div>
  );
};
