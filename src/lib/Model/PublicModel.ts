//
//  This is the public API for ReactGrid
//  PLEASE
//  ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE
//  THANKS!

//  Michael Matejko
import { TextCell, HeaderCell, CheckboxCell, DateCell, EmailCell, ChevronCell, NumberCell, TimeCell } from './../CellTemplates';
export type SelectionMode = 'row' | 'column' | 'range';

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
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
    readonly enableFillHandle?: boolean;
    readonly enableRangeSelection?: boolean;
    readonly enableRowSelection?: boolean;
    readonly enableColumnSelection?: boolean;
    readonly labels?: TextLabels;
    readonly enableFullWidthHeader?: boolean;
    readonly enableGroupIdRender?: boolean;

    readonly onCellsChanged?: (cellChanges: CellChange[]) => void;
    readonly onFocusLocationChanged?: (location: CellLocation) => void;
    readonly onFocusLocationChanging?: (location: CellLocation) => boolean;
    readonly onColumnResized?: (columnId: Id, width: number, selectedColIds: Id[]) => void;
    readonly onRowsReordered?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => void;
    readonly onColumnsReordered?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => void;
    readonly onContextMenu?: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]) => MenuOption[];
    readonly canReorderColumns?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => boolean;
    readonly canReorderRows?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => boolean;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface TextLabels {
    legacyBrowserHeader?: string,
    legacyBrowserText?: string,
    copyLabel?: string,
    cutLabel?: string,
    pasteLabel?: string,
    actionNotSupported?: string;
    appleMobileDeviceContextMenuPasteAlert?: string,
    otherBrowsersContextMenuPasteAlert?: string,
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface CellTemplates {
    [key: string]: CellTemplate;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface CellLocation {
    readonly rowId: Id;
    readonly columnId: Id;
}


// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Highlight {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly borderColor?: string;
    readonly className?: string;
}


// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export type DefaultCellTypes = CheckboxCell | DateCell | EmailCell | ChevronCell | HeaderCell | NumberCell | TextCell | TimeCell;


// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export type CellChange<TCell extends Cell = DefaultCellTypes & Cell> = TCell extends Cell ? Change<TCell> : never;

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Change<TCell extends Cell = DefaultCellTypes> {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly type: TCell['type'];
    readonly previousCell: TCell;
    readonly newCell: TCell;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// This interface is used for the communication between ReactGrid and a cell
export interface CellTemplate<TCell extends Cell = Cell> {
    // Validate and convert to compatible cell type
    getCompatibleCell(uncertainCell: Uncertain<TCell>): Compatible<TCell>
    // Returns true if the data in the cell is not replacable
    // Default: _ => true
    isFocusable?(cell: Compatible<TCell>): boolean;
    // Update cell based on new props
    // If not implemented, cell will be read-only
    update?(cell: Compatible<TCell>, cellToMerge: UncertainCompatible<TCell>): Compatible<TCell>;
    // The keyCode represents the key pressed on the keyboard, or 1 for a pointer event (double click).
    // Returns the cell data either affected by the event or not.
    // Default: cell => { cell, enableEditMode: false }
    handleKeyDown?(cell: Compatible<TCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<TCell>; enableEditMode: boolean };
    // Custom styles based on cell data applied to the cells div element
    // Default: _ => cell.style | {}
    getStyle?(cell: Compatible<TCell>, isInEditMode: boolean): CellStyle;
    //
    getClassName?(cell: Compatible<TCell>, isInEditMode: boolean): string;
    // Render the cell content
    render(cell: Compatible<TCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TCell>, commit: boolean) => void): React.ReactNode;
}

export type Id = number | string;

export type DropPosition = 'before' | 'on' | 'after';

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Column {
    readonly columnId: Id;
    // default: 150
    readonly width?: number;
    // default: false
    readonly reorderable?: boolean;
    // default: false
    readonly resizable?: boolean;
    //readonly canDrop?: (columnIds: Id[], position: DropPosition) => boolean;
    //readonly onDrop?: (columnIds: Id[], position: DropPosition) => void;
    // if onResize === undefined => not resizable
    //readonly onResize?: (newWidth: number) => void;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface BorderProps {
    readonly color?: string;
    readonly style?: string;
    readonly width?: string;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface CellStyle {
    readonly color?: string;
    readonly background?: string;
    readonly overflow?: string;
    readonly paddingLeft?: string;
    readonly border?: {
        readonly left?: BorderProps;
        readonly top?: BorderProps;
        readonly right?: BorderProps;
        readonly bottom?: BorderProps;
    }
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Cell {
    type: string;
    nonEditable?: boolean;
    groupId?: Id;
    style?: CellStyle;
    className?: string;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export type Uncertain<TCell extends Cell> = Partial<TCell> & Cell;

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// Extended & excangable cell (compatible between different types)
export type Compatible<TCell extends Cell> = TCell & {
    text: string;
    value: number;
}

export type UncertainCompatible<TCell extends Cell> = Uncertain<TCell> & {
    text: string;
    value: number;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface Row<TCell extends Cell = DefaultCellTypes> {
    readonly rowId: Id;
    readonly cells: TCell[];
    // default: 25 
    readonly height?: number;
    // default: false
    readonly reorderable?: boolean;
};

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
export interface MenuOption {
    id: string;
    label: string;
    handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => void;
}
