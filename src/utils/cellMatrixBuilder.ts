import { CellMatrix } from "../types/CellMatrix";
import { Cell, CellMap, Column, Row, SpanMember } from "../types/PublicModel";

type AddRowsFn<TRowId extends string> = (...newRows: Array<Row<TRowId>>) => void;

type AddColumnsFn<TColumnId extends string> = (...newColumns: Column<TColumnId>[]) => void;

// Type `any` is required to use React.ComponentType here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SetCellFn<TRowId extends string, TColumnId extends string> = <TComponent extends React.ComponentType<any>>(
  rowId: TRowId,
  colId: TColumnId,
  Template: TComponent,
  props?: React.ComponentPropsWithRef<TComponent>,
  { ...args }?: Omit<Cell<TRowId, TColumnId>, 'rowId' | 'colId' | 'Template' | 'props'>,
) => void;

// type InsertColumnsFn<TColumnId extends string> = (newColumns: Array<Column<TColumnId>>, id: TColumnId, position: 'before' | 'after') => void;

interface CellMatrixBuilderTools<TRowId extends string, TColumnId extends string> {
  addRows: AddRowsFn<TRowId>;
  addColumns: AddColumnsFn<TColumnId>;
  setCell: SetCellFn<TRowId, TColumnId>;
}

/**
 * Utility which helps you build your cell matrix in easy and type-safe way.
 * _You don't really have to use this if you don't need type safety 
 * as long as you **keep proper structure** of your cellMatrix._
 * 
 * It's `setCell` method infers the `props` type based on the provided `Template` 
 * so that you don't have to specify it manually.
 * 
 * You can also provide `RowId` and `ColumnId` types to make sure you don't make any typos
 * when defining rows and columns and providing coordinates for your cells.
 * 
 * @example
 * type RowId = 'Player1' | 'Player2';
 * type ColumnId = 'name' | 'score';
 * 
 * const [players, setPlayers] = useState<Map<RowId, { name: string, score: number }>>(new Map([
 *  ["Player1", { name: "John", score: 70 }],
 *  ["Player2", { name: "Jane", score: 45 }],
 * ]));
 * 
 * const { rows, columns, cellMatrix } = useMemo(
 *  () => cellMatrixBuilder<RowId, ColumnId>(({ addRows, addColumns, setCell }) => {
 *   addRows({ id: 'Player1', height: 100 }, { id: 'Player2', height: 50 });
 * 
 *   addColumns({ id: 'name', width: 100 }, { id: 'score', width: 50 });
 * 
 *   setCell('Player1', 'name', TextCell, { value: players.get('Player1')?.name || '' });
 *   setCell('Player1', 'score', TextCell, { value: players.get('Player1')?.score.toString() || '' });
 * 
 *   setCell('Player2', 'name', TextCell, { value: names.get('Player2')?.name || '' });
 *   setCell('Player2', 'score', TextCell, { value: players.get('Player2')?.score.toString() || '' });
 * }, [players]);
 * 
 * @param builder Function which receives {@link CellMatrixBuilderTools} as an argument and is used to build your cell matrix
 * @returns rows, columns and cellMap
 */
export const cellMatrixBuilder = <TRowId extends string = string, TColumnId extends string = string>(
  builder: ({ ...tools }: CellMatrixBuilderTools<TRowId, TColumnId>) => void,
): CellMatrix<TRowId, TColumnId> => { 
  const rows: Row<TRowId>[] = [];
  const columns: Column<TColumnId>[] = [];
  const cells: CellMap<TRowId, TColumnId> = new Map();

  const addRows: AddRowsFn<TRowId> = (...newRows) => {
    newRows.forEach((row) => {
      if (rows.some(r => r.id === row.id)) throw new Error(`Duplicate IDs!: Row with id "${row.id}" already exists!`);

      rows.push({ ...row });
    });
  }

  const addColumns: AddColumnsFn<TColumnId> = (...newColumns) => {
    newColumns.forEach((col) => {
      if (columns.some(c => c.id === col.id)) throw new Error(`Duplicate IDs!: Column with id "${col.id}" already exists!`);

      columns.push({ ...col });
    });
  }

  const setCell: SetCellFn<TRowId, TColumnId> = (rowId, colId, Template, props, { ...args } = {}) => {
    const baseRowIdIndex = rows.findIndex(row => row.id === rowId);
    const baseColIdIndex = columns.findIndex(col => col.id === colId);

    if (baseRowIdIndex === -1) throw new Error(`Row with id "${rowId}" isn't defined in rows array`);
    if (baseColIdIndex === -1) throw new Error(`Column with id "${colId}" isn't defined in columns array`);    

    if (process.env.NODE_ENV === 'development' && cells.has(`${rowId} ${colId}`)) {
      console.warn(`Cell with coordinates [${rowId}, ${colId}] already exists and will be overwritten!`);
    }

    const cell = { rowId, colId, Template, props, ...args };

    const rowSpan = cell.rowSpan ?? 1;
    const colSpan = cell.colSpan ?? 1;

    for (let rowIdx = 0; rowIdx < rowSpan; rowIdx++) {
      const rowIdIndex = baseRowIdIndex + rowIdx;

      for (let colIdx = 0; colIdx < colSpan; colIdx++) {
        const colIdIndex = baseColIdIndex + colIdx;

        if (rowIdx === 0 && colIdx === 0) continue;

        const spanMember: SpanMember = {
          originRowId: rowId,
          originColId: colId,
        };

        cells.set(`${rows[rowIdIndex].id} ${columns[colIdIndex].id}`, spanMember);
      }
    }

    cells.set(`${rowId} ${colId}`, cell);
  }

  builder({ addRows, addColumns, setCell });

  return {
    rows,
    columns,
    cells,
  }
}
