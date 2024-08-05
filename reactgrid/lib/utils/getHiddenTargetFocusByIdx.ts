export const getHiddenTargetFocusByIdx = (rowIdx: number, colIdx: number) => {
  const className = `rgHiddenFocusTarget rgFocusRowIdx-${rowIdx} rgFocusColIdx-${colIdx}`;

  const elements = document.getElementsByClassName(className);

  if (elements.length > 0) {
    return elements[0] as HTMLInputElement;
  }
};
