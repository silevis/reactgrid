import { CellMatrix } from "../types/CellMatrix";
import { Cell, Column, Row, SpanMember } from "../types/PublicModel";

// type AddRowsFn<TRowId extends string> = (...newRows: Array<Row<TRowId>>) => void;

// type AddColumnsFn<TColumnId extends string> = (...newColumns: Column<TColumnId>[]) => void;

// Type `any` is required to use React.ComponentType here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SetCellFn = <TComponent extends React.ComponentType<any>>(
  rowIndex: number,
  colIndex: number,
  Template: TComponent,
  props?: React.ComponentPropsWithRef<TComponent>,
  { ...args }?: Omit<Cell, "rowIndex" | "colIndex" | "Template" | "props">
) => void;

// type InsertColumnsFn<TColumnId extends string> = (newColumns: Array<Column<TColumnId>>, id: TColumnId, position: 'before' | 'after') => void;

interface CellMatrixBuilderTools<TRowIdx extends number, TColumnIdx extends number> {
  // addRows: AddRowsFn<TRowId>;
  // addColumns: AddColumnsFn<TColumnId>;
  setCell: SetCellFn;
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
export const cellMatrixBuilder = <TRowIdx extends number = number, TColumnIdx extends number = number>(
  rows: Row[],
  columns: Column[],

  builder: ({ ...tools }: CellMatrixBuilderTools<TRowIdx, TColumnIdx>) => void
): CellMatrix<TRowIdx, TColumnIdx> => {
  const cells: (Cell | SpanMember)[][] = [];

  // Initialize each row in cells array to ensure it's not undefined
  for (let i = 0; i < rows.length; i++) {
    cells[i] = [];
  }

  const setCell: SetCellFn = (baseRowIndex, baseColIndex, Template, props, { ...args } = {}) => {
    if (baseRowIndex === -1) throw new Error(`Row with id "${baseRowIndex}" isn't defined in rows array`);
    if (baseColIndex === -1) throw new Error(`Column with id "${baseColIndex}" isn't defined in columns array`);

    if (process.env.NODE_ENV === "development" && cells[baseRowIndex][baseColIndex]) {
      // console.warn(`Cell with coordinates [${baseRowIndex}, ${baseColIndex}] already exists and will be overwritten!`);
    }

    const cell = { rowIndex: baseRowIndex, colIndex: baseColIndex, Template, props, ...args };

    const rowSpan = cell.rowSpan ?? 1;
    const colSpan = cell.colSpan ?? 1;

    for (let rowOffset = 0; rowOffset < rowSpan; rowOffset++) {
      const currentRowIndex = baseRowIndex + rowOffset;

      // Ensure the row exists before trying to access a column
      if (!cells[currentRowIndex]) {
        cells[currentRowIndex] = [];
      }

      for (let colOffset = 0; colOffset < colSpan; colOffset++) {
        const currentColIndex = baseColIndex + colOffset;

        if (rowOffset === 0 && colOffset === 0) continue;

        const spanMember: SpanMember = {
          originRowIndex: baseRowIndex,
          originColIndex: baseColIndex,
        };

        cells[currentRowIndex][currentColIndex] = spanMember;
      }
    }

    cells[baseRowIndex][baseColIndex] = cell;
  };

  builder({ setCell });

  return {
    rows,
    columns,
    cells,
  };
};
