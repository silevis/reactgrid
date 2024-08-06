import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ReactGrid, DefaultCellTypes, CellChange, Id, DropPosition, MenuOption, SelectionMode } from '@silevis/reactgrid';
import { DropdownNumberCellTemplate, DropdownNumberCell } from '../../cellTemplates/dropdownNumberCell/DropdownNumberCellTemplate';
import { FlagCellTemplate, FlagCell } from '../../cellTemplates/flagCell/FlagCellTemplate';
import { columns as crmColumns } from '../../data/crm/columns';
import { rows as crmRows } from '../../data/crm/rows';
import './styling.scss';
import { VirtualEnv, IDatagridState } from './VirtualEnv';
import { VirtualUser } from './VirtualUser';
import useInterval from '@use-it/interval';


const ReactGridContainer = styled.div`
  overflow: scroll;
`;

export type VirtualEnvCellChange = CellChange<DefaultCellTypes | FlagCell | DropdownNumberCell>;

export const DatagridSample: React.FC = () => {

  const [state, setState] = useState<IDatagridState>(() => ({
    columns: [...crmColumns(true, true)],
    rows: [...crmRows(true)],
    stickyTopRows: 1,
    stickyLeftColumns: 2,
    highlights: []
  }));

  const handleChanges = (changes: VirtualEnvCellChange[]) => {
    const newState = { ...state };
    changes.forEach(change => {
      const changeRowIdx = newState.rows.findIndex(el => el.rowId === change.rowId);
      const changeColumnIdx = newState.columns.findIndex(el => el.columnId === change.columnId);
      newState.rows[changeRowIdx].cells[changeColumnIdx] = change.newCell;
    })
    setState(newState);
  }

  const [virtualEnv] = useState(() => new VirtualEnv());

  useEffect(() => {
    virtualEnv
      .addUser(new VirtualUser('darkolivegreen', 12, 3))
      .addUser(new VirtualUser('mediumpurple', 0, 0))
      .addUser(new VirtualUser('red', 10, 12))
      .addUser(new VirtualUser('orange', 0, 18))

    setState(st => virtualEnv.updateView(st));
  }, [virtualEnv]);

  const handleCanReorderColumns = (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition): boolean => {
    const columnInside = columnIds.includes(targetColumnId);
    if (columnInside) return false;
    return true;
  }

  const handleColumnsReorder = (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => {
    const to = state.columns.findIndex(column => column.columnId === targetColumnId);
    const columnIdxs = columnIds.map((id: Id, idx: number) => state.columns.findIndex(c => c.columnId === id));
    setState({
      ...state,
      columns: reorderArray(state.columns, columnIdxs, to),
      rows: state.rows.map(row => ({ ...row, cells: reorderArray(row.cells, columnIdxs, to) })),
    });
  }

  useInterval(() => {
    setState(virtualEnv.updateView(state))
  }, 250);

  const reorderArray = <T extends {}>(arr: T[], idxs: number[], to: number) => {
    const movedElements: T[] = arr.filter((_: T, idx: number) => idxs.includes(idx));
    to = Math.min(...idxs) < to ? to += 1 : to -= idxs.filter(idx => idx < to).length;
    const leftSide: T[] = arr.filter((_: T, idx: number) => idx < to && !idxs.includes(idx));
    const rightSide: T[] = arr.filter((_: T, idx: number) => idx >= to && !idxs.includes(idx));
    return [...leftSide, ...movedElements, ...rightSide];
  }

  const handleRowsReorder = (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => {
    const newState = { ...state };
    const to = state.rows.findIndex(row => row.rowId === targetRowId);
    const ids = rowIds.map(id => state.rows.findIndex(r => r.rowId === id));
    setState({ ...newState, rows: reorderArray(state.rows, ids, to) });
  }

  const handleCanReorderRows = (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition): boolean => {
    const rowIndex = state.rows.findIndex(row => row.rowId === targetRowId);
    const rowInside = rowIds.includes(targetRowId);
    if (rowIndex === 0 || rowInside) return false;
    return true;
  }

  const handleColumnResize = (columnId: Id, width: number, selectedColIds: Id[]) => {
    const newState = { ...state };

    const setColumnWidth = (columnIndex: number) => {
      const resizedColumn = newState.columns[columnIndex];
      newState.columns[columnIndex] = { ...resizedColumn, width };
    }

    if (selectedColIds.includes(columnId)) {
      const stateColumnIndexes = newState.columns
        .filter(col => selectedColIds.includes(col.columnId))
        .map(col => newState.columns.findIndex(el => el.columnId === col.columnId));
      stateColumnIndexes.forEach(setColumnWidth);
    } else {
      const columnIndex = newState.columns.findIndex(col => col.columnId === columnId);
      setColumnWidth(columnIndex);
    }
    setState(newState);
  }

  const handleContextMenu = (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]): MenuOption[] => {
    if (selectionMode === 'row') {
      menuOptions = [
        ...menuOptions,
        {
          id: 'removeRow', label: 'Remove row', handler: () => {
            const highlights = state.highlights.filter(h => !selectedRowIds.includes(h.rowId));
            setState({ ...state, rows: state.rows.filter(row => !selectedRowIds.includes(row.rowId)), highlights });
          }
        },
      ]
    }
    if (selectionMode === 'column') {
      menuOptions = [
        ...menuOptions,
        {
          id: 'removeColumn', label: 'Remove column', handler: () => {
            const columns = state.columns.filter(column => !selectedColIds.includes(column.columnId));
            const columnsIdxs = state.columns.map((column, idx) => {
              if (!columns.includes(column)) return idx;
              return undefined;
            }).filter(idx => idx !== undefined);
            const rows = state.rows.map(row => ({ ...row, cells: row.cells.filter((_, idx) => !columnsIdxs.includes(idx)) }));
            const highlights = state.highlights.filter(h => !selectedColIds.includes(h.columnId));
            setState({ ...state, columns, rows, highlights });
          }
        },
      ]
    }
    return menuOptions;
  }

  return (
    <ReactGridContainer id="multiuser-sample">
      <ReactGrid
        rows={state.rows}
        columns={state.columns}
        customCellTemplates={{
          'flag': new FlagCellTemplate(),
          'dropdownNumber': new DropdownNumberCellTemplate(),
        }}
        highlights={state.highlights}
        stickyTopRows={state.stickyTopRows}
        stickyLeftColumns={state.stickyLeftColumns}
        onCellsChanged={handleChanges}
        canReorderRows={handleCanReorderRows}
        onRowsReordered={handleRowsReorder}
        canReorderColumns={handleCanReorderColumns}
        onColumnsReordered={handleColumnsReorder}
        onContextMenu={handleContextMenu}
        onColumnResized={handleColumnResize}
        enableColumnSelection
        enableRowSelection
        enableFillHandle
        enableRangeSelection
      />
    </ReactGridContainer>
  )
}
