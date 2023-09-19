import React, { FC } from "react";

interface Behavior {
  name: string;
  order: number;

  state: ReactGridState;
  stateUpdater: (state: ReactGridState) => ReactGridState;
}

export interface Row<Id = string> {
  id: Id;
  height: string;
}

export interface Column<Id = string> {
  id: Id;
  width: string;
}

export type Cell<RowIdType extends string = string, ColIdType extends string = string> = {
  rowId: RowIdType;
  colId: ColIdType;

  // Type `any` is required to use React.ElementType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Template: React.ComponentType<any>;
  props?: React.ComponentPropsWithRef<Cell['Template']>;

  // styles?: React.CSSProperties;
  // className?: string;

  rowSpan?: number;
  colSpan?: number;
  // cellSpanMember?: [number, number];
}

export type CellMap<RowIdType extends string = string, ColIdType extends string = string> = Map<RowIdType, Map<ColIdType, Cell<RowIdType, ColIdType> | null>>;

export interface ReactGridProps {
  id: string;

  style?: React.CSSProperties;

  columns: ReadonlyArray<Column>;
  rows: ReadonlyArray<Row>;

  cells: CellMap;

  // templates?: CellTemplates;
  behaviors?: Behavior[]

  focusLocation?: [number, number]
  initialFocusLocation?: [number, number]

  onFocusLocationChanging?: ({ location }: { location: [number, number] }) => boolean;
  onFocusLocationChanged?: ({ location }: { location: [number, number] }) => void;
}
