export interface CellDataTransport {
  stringValue: string;
  type: string;
  payload: unknown;
}

export interface CellAttributes {
  stringValue: string;
  onDataRequest: () => CellDataTransport;
  // onDataCommit: (data: CellDataTransport) => void;
  // highlight: {
  //   width: string;
  //   color: string;
  // };
}

export interface CellContext {
  rowId: string;
  colId: string;
  realRowIndex: number;
  realColumnIndex: number;

  stringValue?: string;
  // newValue?: string;
  setNewValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  commitNewValueAndBlur: () => void;
  discardNewValueAndBlur: () => void;
  requestEditMode: () => void;
  requestFocus: () => void;
  requestBlur: () => void;

  isInEditMode: boolean;
  isFocused: boolean;
}

export interface StickyOffsets {
  topRows: number[];
  bottomRows: number[];
  leftColumns: number[];
  rightColumns: number[];
}

export interface IndexedLocation {
  rowIndex: number;
  colIndex: number;
}