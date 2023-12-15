import { CellMatrix } from "../Model/CellMatrix";
import { State } from "../Model/State";

/**
 * Expand the grid if needed
 * @param state State object
 * @param endRow End line
 * @param endColumn End column number
 * @returns Updated status object
 */
export const expandGridIfNeeded = (
  state: State,
  endRow: number,
  endColumn: number
): State => {
  const { cellMatrix } = state;
  let updated = false;

  // Determines the current number of rows and columns
  const currentRowCount = cellMatrix.rows.length;
  const currentColumnCount = cellMatrix.columns.length;

  // Add new rows if needed
  if (endRow >= currentRowCount) {
    const rowsToAdd = endRow - currentRowCount + 1;
    const prefix = cellMatrix.rows[currentRowCount - 1];
    for (let i = 0; i < rowsToAdd; i++) {
      cellMatrix.rows.push({
        ...prefix,
        idx: currentRowCount + i,
        rowId: `row-${currentRowCount + i}`,
        top: prefix.bottom,
        bottom: prefix.bottom + prefix.height || CellMatrix.DEFAULT_ROW_HEIGHT,
      });
    }
    updated = true;
  }

  // Add new columns if needed
  if (endColumn >= currentColumnCount) {
    const columnsToAdd = endColumn - currentColumnCount + 1;
    const prefix = cellMatrix.columns[currentColumnCount - 1];
    for (let i = 0; i < columnsToAdd; i++) {
      cellMatrix.columns.push({
        ...prefix,
        columnId: `col-${currentColumnCount + i}`,
        idx: currentColumnCount + i,
        left: prefix.right,
        right: prefix.right + prefix.width || CellMatrix.DEFAULT_COLUMN_WIDTH,
      });
      cellMatrix.rows.map((_row) => {
        _row.cells.push({
          type: "text",
          text: "",
        });
        return _row;
      });
    }
    updated = true;
  }

  // If needed, add a new status column that returns only when the grid is actually updated
  return updated ? { ...state, cellMatrix } : state;
};
