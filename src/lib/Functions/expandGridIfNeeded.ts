import { CellMatrix } from "../Model/CellMatrix";
import { State } from "../Model/State";

export const expandGridIfNeeded = (
  state: State,
  endRow: number,
  endColumn: number
): State => {
  const { cellMatrix } = state;
  let updated = false;

  // 确定当前的行数和列数
  const currentRowCount = cellMatrix.rows.length;
  const currentColumnCount = cellMatrix.columns.length;

  // 如果需要，添加新的行
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

  // 如果需要，添加新的列
  if (endColumn >= currentColumnCount) {
    const columnsToAdd = endColumn - currentColumnCount + 1;
    const prefix = cellMatrix.columns[currentColumnCount - 1];
    for (let i = 0; i < columnsToAdd; i++) {
      cellMatrix.columns.push({
        ...prefix,
        columnId: `column-${currentColumnCount + i}`,
        idx: currentColumnCount + i,
        left: prefix.right,
        right: prefix.right + prefix.width || CellMatrix.DEFAULT_COLUMN_WIDTH,
      });
    }
    updated = true;
  }

  // 只有在确实更新了网格时才返回新的状态
  return updated ? { ...state, cellMatrix } : state;
};
