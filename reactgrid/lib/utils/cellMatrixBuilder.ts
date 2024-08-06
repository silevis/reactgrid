import { CellMatrix } from "../types/CellMatrix";
import { Cell, SpanMember } from "../types/PublicModel";

// Type `any` is required to use React.ComponentType here
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SetCellFn = <TComponent extends React.ComponentType<any>>(
  rowIndex: number,
  colIndex: number,
  Template: TComponent,
  props?: React.ComponentPropsWithRef<TComponent>,
  { ...args }?: Omit<Cell, "rowIndex" | "colIndex" | "Template" | "props">
) => void;

interface CellMatrixBuilderTools {
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
 * @param builder Function which receives {@link CellMatrixBuilderTools} as an argument and is used to build your cell matrix
 * @returns cells
 */
export const cellMatrixBuilder = (builder: ({ ...tools }: CellMatrixBuilderTools) => void): CellMatrix => {
  const cells: CellMatrix = [];

  const setCell: SetCellFn = (baseRowIndex, baseColIndex, Template, props, { ...args } = {}) => {
    if (baseRowIndex === -1) throw new Error(`Row with id "${baseRowIndex}" isn't defined in rows array`);
    if (baseColIndex === -1) throw new Error(`Column with id "${baseColIndex}" isn't defined in columns array`);

    if (process.env.NODE_ENV === "development" && cells[baseRowIndex]?.[baseColIndex]) {
      console.warn(`Cell with coordinates [${baseRowIndex}, ${baseColIndex}] already exists and will be overwritten!`);
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

  return cells;
};
