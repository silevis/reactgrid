
export function getRowAndColumns(cellContainer: Element): { rowIndex: number; colIndex: number; } | false {
  const rowIdxMatch = /rgRowIdx-(\d+)/.exec(cellContainer.classList.value);
  const colIdxMatch = /rgColIdx-(\d+)/.exec(cellContainer.classList.value);

  if (!rowIdxMatch || !colIdxMatch) return false;

  const rowIndex = parseInt(rowIdxMatch[1]);
  const colIndex = parseInt(colIdxMatch[1]);

  return { rowIndex, colIndex };
}
