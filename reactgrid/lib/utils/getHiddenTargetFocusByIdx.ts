export const getHiddenTargetFocusByIdx = (storeId: string, rowIdx: number, colIdx: number) => {
  const container = document.getElementById(`ReactGrid-${storeId}`);

  if (!container) return null;

  const className = `rgHiddenFocusTarget rgFocusRowIdx-${rowIdx} rgFocusColIdx-${colIdx}`;

  const elements = container.getElementsByClassName(className);

  if (elements.length > 0) {
    return elements[0] as HTMLInputElement;
  }
  return null;
};
