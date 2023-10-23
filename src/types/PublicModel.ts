import React from "react";

interface Behavior {
  name: string;

  // state: ReactGridState;
  // stateUpdater: (state: ReactGridState) => ReactGridState;
}

export interface Row<Id = string> {
  id: Id;
  height: string | number;
}

export interface Column<Id = string> {
  id: Id;
  width: string | number;
}

export type Cell<RowIdType extends string = string, ColIdType extends string = string> = {
  rowId: RowIdType;
  colId: ColIdType;

  // Type `any` is required to use React.ComponentType here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Template: React.ComponentType<any>;
  props?: React.ComponentPropsWithRef<Cell['Template']>;

  // styles?: React.CSSProperties;
  // className?: string;

  rowSpan?: number;
  colSpan?: number;
}

export type CellMap<RowIdType extends string = string, ColIdType extends string = string> = Map<`${RowIdType} ${ColIdType}`, Cell<RowIdType, ColIdType> | null>;

export interface ReactGridProps {
  id: string;

  style?: React.CSSProperties;

  columns: Column[];
  rows: Row[];

  cells: CellMap;

  stickyTopRows?: number;
  stickyBottomRows?: number;
  stickyLeftColumns?: number;
  stickyRightColumns?: number;

  // enableVirtualization?: boolean;

  behaviors?: Behavior[]

  focusLocation?: [number, number]
  initialFocusLocation?: [number, number]

  onFocusLocationChanging?: ({ location }: { location: [number, number] }) => boolean;
  onFocusLocationChanged?: ({ location }: { location: [number, number] }) => void;
}
