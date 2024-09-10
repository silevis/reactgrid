import { NonEditableCell } from "../cellTemplates/NonEditableCell";
import { CellMatrix } from "../types/CellMatrix";
import { Cell, CellMap, Column, Row, SpanMember } from "../types/PublicModel";

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
export const cellMatrixBuilder = (
  rows: Row[] | undefined,
  columns: Column[] | undefined,
  builder: ({ ...tools }: CellMatrixBuilderTools) => void
): CellMatrix => {
  const cells = new Map();
  const cellsLookup = new Map();

  const setCell: SetCellFn = (rowIndex, colIndex, Template, props, { ...args }) => {
    if (rowIndex === -1) throw new Error(`Row with id "${rowIndex}" isn't defined in rows array`);
    if (colIndex === -1) throw new Error(`Column with id "${colIndex}" isn't defined in columns array`);

    if (process.env.NODE_ENV === "development" && cells.has(`${rowIndex} ${colIndex}`)) {
      console.warn(`Cell with coordinates [${rowIndex}, ${colIndex}] already exists and will be overwritten!`);
      return;
    }

    const cell = {
      rowIndex,
      colIndex,
      Template,
      props,
      ...Object.fromEntries(Object.entries(args).filter(([_, value]) => value !== undefined)),
    };

    const rowSpan = args.rowSpan ?? 1;
    const colSpan = args.colSpan ?? 1;

    for (let rowOffset = 0; rowOffset < rowSpan; rowOffset++) {
      const currentRowIndex = rowIndex + rowOffset;

      for (let colOffset = 0; colOffset < colSpan; colOffset++) {
        const currentColIndex = colIndex + colOffset;

        if (rowOffset === 0 && colOffset === 0) continue;

        const spanMember: SpanMember = {
          originRowIndex: rowIndex,
          originColIndex: colIndex,
        };

        cellsLookup.set(`${currentRowIndex} ${currentColIndex}`, {});
        cells.set(`${currentRowIndex} ${currentColIndex}`, spanMember);
      }
    }

    cellsLookup.set(`${rowIndex} ${colIndex}`, {});
    cells.set(`${rowIndex} ${colIndex}`, cell);
  };

  builder({ setCell });

  // fill empty areas with NonEditableCell template
  const maxRowIndex = Math.max(...Array.from(cells.values()).map((cell) => cell.rowIndex));
  const maxColIndex = Math.max(...Array.from(cells.values()).map((cell) => cell.colIndex));

  for (let rowIndex = 0; rowIndex <= maxRowIndex; rowIndex++) {
    for (let colIndex = 0; colIndex <= maxColIndex; colIndex++) {
      const cellKey = `${rowIndex} ${colIndex}`;
      if (!cells.has(cellKey)) {
        cells.set(cellKey, {
          rowIndex,
          colIndex,
          Template: NonEditableCell,
          props: {
            value: "",
          },
        });
      }
    }
  }

  return {
    cellsLookup,
    cells,
    rows: initGridRows(cells || new Map(), rows),
    columns: initGridColumns(cells || new Map(), columns),
  };
};

const initGridRows = (cellMap: CellMap, rows?: Row[]): Row[] => {
  let maxRowIndex = 0;

  const customRowMap = new Map<number, Row>();
  if (rows) {
    rows.forEach((row) => {
      customRowMap.set(row.rowIndex, row);
    });
  }

  for (const key of cellMap.keys()) {
    const [rowIndexStr] = key.split(" ");
    const rowIndex = parseInt(rowIndexStr, 10);
    if (rowIndex > maxRowIndex) {
      maxRowIndex = rowIndex;
    }
  }

  return Array.from({ length: maxRowIndex + 1 }).map((_, idx) => {
    const customRow = customRowMap.get(idx);
    return {
      rowIndex: idx,
      height: customRow?.height ?? 25,
      reorderable: customRow?.reorderable ?? true,
    };
  });
};

const initGridColumns = (cellMap: CellMap, columns?: Column[]): Column[] => {
  let maxColIndex = 0;

  const customColumnMap = new Map<number, Column>();
  if (columns) {
    columns.forEach((col) => {
      customColumnMap.set(col.colIndex, col);
    });
  }

  for (const key of cellMap.keys()) {
    const [, colIndexStr] = key.split(" ");
    const colIndex = parseInt(colIndexStr, 10);
    if (colIndex > maxColIndex) {
      maxColIndex = colIndex;
    }
  }

  return Array.from({ length: maxColIndex + 1 }).map((_, idx) => {
    const customCol = customColumnMap.get(idx);
    return {
      colIndex: idx,
      resizable: customCol?.resizable ?? true,
      reorderable: customCol?.reorderable ?? true,
      width: customCol?.width ?? 150,
      minWidth: customCol?.minWidth ?? 150,
    };
  });
};
