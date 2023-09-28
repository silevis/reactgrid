import React, { FC } from "react";
import { CellMatrix, GridColumn, GridRow } from "./CellMatrix";

interface Behavior {
  name: string;
  order: number;

  state: ReactGridState;
  stateUpdater: (state: ReactGridState) => ReactGridState;
}

export interface Row<Id = string> {
  id: Id;
  /**
   * **Unit: px**
   * 
   * If you need to use other units, you'd need to disable virtualization
   * (because it's based on absolute, measured-in-pixels cell's dimensions) 
   * and provide different template in theme (grid.templates.rows)
   */
  height: number;
}

export interface Column<Id = string> {
  id: Id;
  /**
   * **Unit: px**
   * 
   * If you need to use other units, you'd need to disable virtualization
   * (because it's based on absolute, measured-in-pixels cell's dimensions)
   * and provide different template in theme (grid.templates.columns)
   */
  width: number;
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

export type CellMap<RowIdType extends string = string, ColIdType extends string = string> = Map<RowIdType, Map<ColIdType, Cell<RowIdType, ColIdType> | null>>;

export interface ReactGridProps {
  id: string;

  style?: React.CSSProperties;

  // columns: ReadonlyArray<GridColumn>;
  // rows: ReadonlyArray<GridRow>;

  // cells: CellMap;
  cellMatrix: CellMatrix;

  // templates?: CellTemplates;
  behaviors?: Behavior[]

  focusLocation?: [number, number]
  initialFocusLocation?: [number, number]

  onFocusLocationChanging?: ({ location }: { location: [number, number] }) => boolean;
  onFocusLocationChanged?: ({ location }: { location: [number, number] }) => void;
}
