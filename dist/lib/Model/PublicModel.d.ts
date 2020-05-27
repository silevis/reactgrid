/// <reference types="react" />
import { TextCell, HeaderCell, CheckboxCell, DateCell, EmailCell, GroupCell, NumberCell, TimeCell } from './../CellTemplates';
export declare type SelectionMode = 'row' | 'column' | 'range';
export interface ReactGridProps {
    readonly columns: Column[];
    readonly rows: Row<Cell>[];
    readonly customCellTemplates?: CellTemplates;
    readonly focusLocation?: CellLocation;
    readonly initialFocusLocation?: CellLocation;
    readonly highlights?: Highlight[];
    readonly stickyTopRows?: number;
    readonly stickyBottomRows?: number;
    readonly stickyLeftColumns?: number;
    readonly stickyRightColumns?: number;
    readonly disableFillHandle?: boolean;
    readonly disableRangeSelection?: boolean;
    readonly enableRowSelection?: boolean;
    readonly enableColumnSelection?: boolean;
    readonly disableFloatingCellEditor?: boolean;
    readonly onCellsChanged?: (cellChanges: CellChange<Cell>[]) => void;
    readonly onFocusLocationChanged?: (location: CellLocation) => void;
    readonly onFocusLocationChanging?: (location: CellLocation) => boolean;
    readonly onColumnResized?: (columnId: Id, width: number) => void;
    readonly onRowsReordered?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => void;
    readonly onColumnsReordered?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => void;
    readonly onContextMenu?: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]) => MenuOption[];
    readonly canReorderColumns?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => boolean;
    readonly canReorderRows?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => boolean;
}
export interface CellTemplates {
    [key: string]: CellTemplate;
}
export interface CellLocation {
    readonly rowId: Id;
    readonly columnId: Id;
}
export interface Highlight {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly borderColor?: string;
    readonly className?: string;
}
export declare type DefaultCellTypes = CheckboxCell | DateCell | EmailCell | GroupCell | HeaderCell | NumberCell | TextCell | TimeCell;
declare type CellTypes<TCell> = TCell extends Cell ? TCell['type'] : never;
export declare type CellChange<TCell extends Cell = DefaultCellTypes & Cell> = TCell extends Cell ? CellChangeOnCellType<TCell> : never;
export interface CellChangeOnCellType<TCell extends Cell = DefaultCellTypes> {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly type: CellTypes<TCell>;
    readonly initialCell: TCell;
    readonly newCell: TCell;
}
export interface CellTemplate<TCell extends Cell = Cell> {
    getCompatibleCell(uncertainCell: Uncertain<TCell>): Compatible<TCell>;
    isFocusable?(cell: Compatible<TCell>): boolean;
    update?(cell: Compatible<TCell>, cellToMerge: UncertainCompatible<TCell>): Compatible<TCell>;
    handleKeyDown?(cell: Compatible<TCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<TCell>;
        enableEditMode: boolean;
    };
    getStyle?(cell: Compatible<TCell>, isInEditMode: boolean): CellStyle;
    getClassName?(cell: Compatible<TCell>, isInEditMode: boolean): string;
    render(cell: Compatible<TCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TCell>, commit: boolean) => void): React.ReactNode;
}
export declare type Id = number | string;
export declare type DropPosition = 'before' | 'on' | 'after';
export interface Column {
    readonly columnId: Id;
    readonly width?: number;
    readonly reorderable?: boolean;
    readonly resizable?: boolean;
}
export interface CellStyle {
    readonly color?: string;
    readonly background?: string;
    readonly overflow?: string;
    readonly paddingLeft?: string;
}
export interface Cell {
    type: string;
    style?: CellStyle;
    className?: string;
}
export declare type Uncertain<TCell extends Cell> = Partial<TCell> & Cell;
export declare type Compatible<TCell extends Cell> = TCell & {
    text: string;
    value: number;
};
export declare type UncertainCompatible<TCell extends Cell> = Uncertain<TCell> & {
    text: string;
    value: number;
};
export interface Row<TCell extends Cell = DefaultCellTypes> {
    readonly rowId: Id;
    readonly cells: TCell[];
    readonly height?: number;
    readonly reorderable?: boolean;
}
export interface MenuOption {
    id: string;
    label: string;
    handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => void;
}
export {};
