import { CellMatrix, GridColumn, GridRow, StickyAmount } from "../types/CellMatrix";
import { Row, Column, Cell, CellMap } from "../types/PublicModel";

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

type SetStickyAmountFn = (newStickyAmount: Partial<StickyAmount>) => void;

// type InsertRowsFn<TRowId extends string> = (newRows: Array<Row<TRowId>>, id: TRowId, position: 'before' | 'after') => void;

// type InsertColumnsFn<TColumnId extends string> = (newColumns: Array<Column<TColumnId>>, id: TColumnId, position: 'before' | 'after') => void;

interface CellMatrixBuilderTools<TRowId extends string, TColumnId extends string> {
  addRows: AddRowsFn<TRowId>;
  addColumns: AddColumnsFn<TColumnId>;
  setCell: SetCellFn<TRowId, TColumnId>;

  setStickyAmount: SetStickyAmountFn;

  // insertRows: InsertRowsFn<TRowId>;
  // insertColumns: InsertColumnsFn<TColumnId>;

  // removeRowsAndTheirCells: (ids: TRowId[]) => void;
  // removeColumnsAndTheirCells: (ids: TColumnId[]) => void;
  // removeCells: (ids: [TRowId, TColumnId][]) => void;
}

/**
 * Utility which helps you build your cell matrix in easy and type-safe way.
 * _You don't really have to use this if you don't need type safety 
 * as long as you keep proper structure of your cellMatrix._
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
  const rows: GridRow<TRowId>[] = [];
  const columns: GridColumn<TColumnId>[] = [];
  const cells: CellMap<TRowId, TColumnId> = new Map();
  const stickyAmount: StickyAmount = { top: 0, right: 0, bottom: 0, left: 0 };

  let totalHeight = 0;
  let totalWidth = 0;

  const getTop = (rowIndex: number) => {
    if (rowIndex === 0) return 0;
    return rows[rowIndex - 1].top - rows[rowIndex - 1].height;
  }

  const getLeft = (colIndex: number) => {
    if (colIndex === 0) return 0;
    return columns[colIndex - 1].left - columns[colIndex - 1].width;
  }

  const addRows: AddRowsFn<TRowId> = (...newRows) => {
    newRows.forEach((row, idx) => {
      if (rows.some(r => r.id === row.id)) throw new Error(`Duplicate IDs!: Row with id "${row.id}" already exists!`);

      const top = getTop(idx);
      totalHeight += row.height;
      rows.push({ ...row, top, bottom: top + row.height });
    });
  }

  const addColumns: AddColumnsFn<TColumnId> = (...newColumns) => {
    newColumns.forEach((col, idx) => {
      if (columns.some(c => c.id === col.id)) throw new Error(`Duplicate IDs!: Column with id "${col.id}" already exists!`);

      const left = getLeft(idx);
      totalWidth += col.width;
      columns.push({ ...col, left, right: left + col.width });
    });
  }

  const setCell: SetCellFn<TRowId, TColumnId> = (rowId, colId, Template, props, { ...args } = {}) => {
    if (!rows.some(row => row.id === rowId)) throw new Error(`Row with id "${rowId}" isn't defined in rows array`);
    if (!columns.some(col => col.id === colId)) throw new Error(`Column with id "${colId}" isn't defined in columns array`);    

    let rowMap = cells.get(rowId);
    if (!rowMap) {
      rowMap = new Map<TColumnId, Cell<TRowId, TColumnId> | null>();
    } else if (rowMap.has(colId) && process.env.NODE_ENV === 'development') {
      console.warn(`Cell with coordinates [${rowId}, ${colId}] already exists and will be overwritten!`);
    }

    const cell = { rowId, colId, Template, props, ...args };
    rowMap.set(colId, cell);
    cells.set(rowId, rowMap);
  }

  const setStickyAmount: SetStickyAmountFn = (newStickyAmount) => {
    stickyAmount.top = newStickyAmount.top ?? stickyAmount.top;
    stickyAmount.right = newStickyAmount.right ?? stickyAmount.right;
    stickyAmount.bottom = newStickyAmount.bottom ?? stickyAmount.bottom;
    stickyAmount.left = newStickyAmount.left ?? stickyAmount.left;
  }

  builder({ addRows, addColumns, setCell, setStickyAmount });

  return {
    rows,
    columns,
    cells,
    stickyAmount,
    totalHeight,
    totalWidth,
  }
}
