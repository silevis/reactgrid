import { Row, Column, Cell, CellMap } from "../types/PublicModel";

/**
 * Small utility which whole purpose is to help you define your rows 
 * (and cell's rowId's) in a type-safe way. <br />
 * 
 * **Downside!: can't use mutable arrays :(** <br />
 * 
 * If you need to use mutable arrays you can:
 * - define a type for your row ids manually (e.g. `type RowIds = 'gasBills' | 'salaries'`) [optional]
 * - use {@link Row `Row<RowIds>[]`} as the type of your rows array and ignore this utility
 * (see {@link Row} type for more info)
 * 
 * @example
 * const rows = Rows([
 *   { id: 'Jane', height: 100 },
 *   { id: 'Joe', height: 50 },
 * ] as const); // ! as const is required
 * 
 * type RowId = typeof rows[number]['id']; // 'Jane' | 'Joe'
 * 
 * @param rows Your array of row definitions 
 * @returns readonly array of row definitions
 */
export const Rows = <T>(rows: readonly Row<T>[]) => rows;

/**
 * Small utility which whole purpose is to help you define your columns 
 * (and cell's colId's) in a type-safe way. <br />
 * 
 * **Downside!: can't use mutable arrays :(** <br />
 * 
 * If you need to use mutable arrays you can:
 * - define a type for your column ids manually (e.g. `type ColIds = 'gasBills' | 'salaries'`) [optional]
 * - use {@link Column `Column<ColIds>[]`} as the type of your columns array and ignore this utility
 * (see {@link Column} type for more info)
 * 
 * @example
 * const columns = Columns([
 *   { id: 'name', width: 100 },
 *   { id: 'age', width: 50 },
 * ] as const); // ! as const is required
 * 
 * type ColumnId = typeof columns[number]['id']; // 'name' | 'age'
 * @param columns Your array of column definitions 
 * @returns readonly array of column definitions
 */
export const Columns = <T>(columns: readonly Column<T>[]) => columns;

// Type `any` is required to use React.ElementType
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SetCellFn<TRowId extends string, TColumnId extends string> = <TComponent extends React.ComponentType<any>>(
  rowId: TRowId,
  colId: TColumnId,
  Template: TComponent,
  props?: React.ComponentPropsWithRef<TComponent>,
  { ...args }?: Omit<Cell<TRowId, TColumnId>, 'rowId' | 'colId' | 'Template' | 'props'>,
) => void;

type AddRowsFn<TRowId extends string> = (...newRows: Array<Row<TRowId>>) => void;

type AddColumnsFn<TColumnId extends string> = (...newColumns: Column<TColumnId>[]) => void;

// type InsertRowsFn<TRowId extends string> = (newRows: Array<Row<TRowId>>, id: TRowId, position: 'before' | 'after') => void;

// type InsertColumnsFn<TColumnId extends string> = (newColumns: Array<Column<TColumnId>>, id: TColumnId, position: 'before' | 'after') => void;

interface CellMatrixBuilderTools<TRowId extends string, TColumnId extends string> {
  addRows: AddRowsFn<TRowId>;
  addColumns: AddColumnsFn<TColumnId>;
  setCell: SetCellFn<TRowId, TColumnId>;

  // insertRows: InsertRowsFn<TRowId>;
  // insertColumns: InsertColumnsFn<TColumnId>;

  // removeRowsAndTheirCells: (ids: TRowId[]) => void;
  // removeColumnsAndTheirCells: (ids: TColumnId[]) => void;
  // removeCells: (ids: [TRowId, TColumnId][]) => void;
}

/**
 * Utility which helps you build your cell matrix in easy and type-safe way. <br />
 * 
 * You don't really have to use this if you don't need type safety 
 * as long as you keep proper structure of your rows, columns and cells.
 * 
 * It's `setCell` method infers the `props` type based on the provided `Template` 
 * so you don't have to specify it manually. <br />
 * 
 * You can also provide `RowId` and `ColumnId` types to make sure you don't make any typos
 * when providing coordinates for your cells and definitions for rows and columns. <br />
 * 
 * To get those types you can use {@link Rows} and {@link Columns} utilities if you use immutable arrays,
 * or define them manually (e.g. `type RowId = 'gasBills' | 'salaries'`).
 * 
 * @example
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
export const cellMatrixBuilder = <TRowId extends string, TColumnId extends string>(
  builder: ({ ...tools }: CellMatrixBuilderTools<TRowId, TColumnId>) => void,
) => { 
  const rows: Row<TRowId>[] = [];
  const columns: Column<TColumnId>[] = [];
  const cellMatrix: CellMap<TRowId, TColumnId> = new Map();

  const addRows: AddRowsFn<TRowId> = (...newRows) => {
    const duplicates = newRows.filter(newRow => rows.some(row => row.id === newRow.id));
    if (duplicates.length > 0) throw new Error(`Duplicate IDs!: Rows with ids "${duplicates.map(row => row.id).join(', ')}" already exist!`);

    rows.push(...newRows);
  }

  const addColumns: AddColumnsFn<TColumnId> = (...newColumns) => {
    const duplicates = newColumns.filter(newCol => columns.some(col => col.id === newCol.id));
    if (duplicates.length > 0) throw new Error(`Duplicate IDs!: Columns with ids "${duplicates.map(col => col.id).join(', ')}" already exist!`);

    columns.push(...newColumns);
  }

  const setCell: SetCellFn<TRowId, TColumnId> = (rowId, colId, Template, props, { ...args } = {}) => {
    if (!rows.some(row => row.id === rowId)) throw new Error(`Row with id "${rowId}" isn't defined in rows array`);
    if (!columns.some(col => col.id === colId)) throw new Error(`Column with id "${colId}" isn't defined in columns array`);    

    let rowMap = cellMatrix.get(rowId);
    if (!rowMap) {
      rowMap = new Map<TColumnId, Cell<TRowId, TColumnId> | null>();
    } else if (rowMap.has(colId) && process.env.NODE_ENV === 'development') {
      console.warn(`Cell with coordinates [${rowId}, ${colId}] already exists and will be overwritten!`);
    }

    const cell = { rowId, colId, Template, props, ...args };
    rowMap.set(colId, cell);
    cellMatrix.set(rowId, rowMap);
  }

  builder({ addRows, addColumns, setCell });

  return {
    rows,
    columns,
    cellMatrix,
  }
}
