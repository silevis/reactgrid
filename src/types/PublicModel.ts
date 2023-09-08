interface Behavior {
  name: string;
  order: number;

  state: ReactGridState;
  stateUpdater: (state: ReactGridState) => ReactGridState;
}

type CellTemplates = {
  // Type `any` is required to use React.ElementType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: React.ComponentType<any>;
}

interface Column {
  width: number;
  sticky?: boolean;
}

interface Row {
  height: number;
  sticky?: boolean;
}

export type Cell = {
  // Type `any` is required to use React.ElementType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Template: React.ComponentType<any>;
  props?: React.ComponentPropsWithRef<Cell['Template']>;
  value: string;

  // styles?: React.CSSProperties;
  // className?: string;

  rowSpan?: number;
  colSpan?: number;
  // cellSpanMember?: [number, number];
}

export interface ReactGridProps {
  id: string;

  columns: Column[];
  rows: Row[];
  /**
   * 2D array of cells - contains their values and templates
   * Access: `cells[rowIndex][columnIndex]`
   */
  cells: Cell[][];

  // templates?: CellTemplates;
  behaviors?: Behavior[]

  focusLocation?: [number, number]
  initialFocusLocation?: [number, number]

  onFocusLocationChanging?: ({ location }: { location: [number, number] }) => boolean;
  onFocusLocationChanged?: ({ location }: { location: [number, number] }) => void;
}


// type Cells2 = {
//   // "0-0": Cell;
//   [{x: number, y: number}]: Cell;
// }

// type Cells2 = Map<[number, number], Cell>;

// const z: Cells2 = new Map();
// z.set([0, 0], { value: "0-0", Template: () => <div>0-0</div> });