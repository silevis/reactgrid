/**
 * This is the public API for ReactGrid
 * PLEASE ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE IN THIS FILE
 * THANKS!
 * 
 * Michael Matejko
 */
import {
    TextCell, HeaderCell, CheckboxCell, DateCell, EmailCell, ChevronCell, NumberCell, TimeCell
} from './../CellTemplates';

/**
 * `SelectionMode` is a marker for currect selection mode
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/7-selection-mode/
 */
export type SelectionMode =
    | 'row'
    | 'column'
    | 'range'

/**
 * `ReactGrid`s component props
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/1-reactgrid-props/
 */
export interface ReactGridProps {
    /** Column’s data */
    readonly columns: Column[];
    /** Row’s data */
    readonly rows: Row<Cell>[];
    /** Set of available custom cell templates */
    readonly customCellTemplates?: CellTemplates;
    /** Focus position (managed constantly by outer app) */
    readonly focusLocation?: CellLocation;
    /** Initial position of focus */
    readonly initialFocusLocation?: CellLocation;
    /** Array of highlight positions */
    readonly highlights?: Highlight[];
    /** Amount of rows which are sticky at the top */
    readonly stickyTopRows?: number;
    /** Amount of rows which are sticky at the bottom */
    readonly stickyBottomRows?: number;
    /** Amount of columns which are sticky on the left side  */
    readonly stickyLeftColumns?: number;
    /** Amount of columns which are sticky on the right side  */
    readonly stickyRightColumns?: number;
    /** Set `true` to enable cell fill feature (by default `false`) */
    readonly enableFillHandle?: boolean;
    /** Set `true` to enable range selection feature (by default `false`) */
    readonly enableRangeSelection?: boolean;
    /** Set `true` to enable row selection feature (by default `false`) */
    readonly enableRowSelection?: boolean;
    /** Set `true` to enable column selection feature (by default `false`) */
    readonly enableColumnSelection?: boolean;
    /** Object that contains labels of texts used by ReactGrid */
    readonly labels?: TextLabels;
    /** Set `true` to enable full width header (by default `false`, feature is experimental) */
    readonly enableFullWidthHeader?: boolean;
    /** Set `true` to enable groupId element rendering (by default `false`) */
    readonly enableGroupIdRender?: boolean;

    /** Called when cell property (e.g. `value`) was changed */
    readonly onCellsChanged?: (cellChanges: CellChange[]) => void;
    /** Focus position has been changed */
    readonly onFocusLocationChanged?: (location: CellLocation) => void;
    /** Called when trying to change focus location. Return `false` to prevent position changing */
    readonly onFocusLocationChanging?: (location: CellLocation) => boolean;
    /** Callback called when column resize action was ended */
    readonly onColumnResized?: (columnId: Id, width: number, selectedColIds: Id[]) => void;
    /** Callback called when row reorder action was ended */
    readonly onRowsReordered?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => void;
    /** Callback called when column reorder action was ended */
    readonly onColumnsReordered?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => void;
    /** Called when user opens context menu inside grid, used to compose own menu options */
    readonly onContextMenu?: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]) => MenuOption[];
    /** Allow or not to change specific columns order */
    readonly canReorderColumns?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => boolean;
    /** Allow or not to change specific rows order */
    readonly canReorderRows?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => boolean;
}

/**
 * Describes set of text labels used by ReactGrids internal i18n module.
 * Each text label has its own default value.
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/90-textlabels/
 */
export interface TextLabels {
    /** 
     * Label of text header when browser isn't supported, 
     * by default: `Please update to a modern browser.`
    */
    legacyBrowserHeader?: string,
    /** 
     * Label of text paragraph when browser isn't supported, 
     * by default: `Your current browser cannot run our content, please make sure you browser is fully updated
     * or try adifferent browser. We highly recommend using the most recent release of Google Chrome, Microsoft Edge, 
     * Firefox, Safari, and Opera browser`
    */
    legacyBrowserText?: string,
    /**
     * Label of copy action displayed inside context menu (just PRO), 
     * by default: `Copy`
     */
    copyLabel?: string,
    /**
     * Label of cut action displayed inside context menu (just PRO), 
     * by default: `Cut`
     */
    cutLabel?: string,
    /** 
     * Label of paste action displayed inside context menu (just PRO), 
     * by default: `Paste` 
     */
    pasteLabel?: string,
    /**
     * Alert label in use (e.g. MacOS) if access to the clipboard is denied (just PRO), 
     * by default: `Use ⌘ + c for copy, ⌘ + x for cut and ⌘ + v for paste.`
     */
    actionNotSupported?: string;
    /**
     *  Alert label in use (e.g. Firefox) if access to the clipboard is denied (just PRO), 
     * by default: ` Use ctrl + c for copy, ctrl + x for cut and ctrl + v for paste.`
     */
    appleMobileDeviceContextMenuPasteAlert?: string,
    /**
     * Alert label in use (e.g. Firefox) if access to the clipboard is denied (just PRO), 
     * by default: `This action is not supported in this browser.`
     */
    otherBrowsersContextMenuPasteAlert?: string,
}

/**
 * Describes your custom cell templates as key-value object
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/6a-cell-templates/
 */
export interface CellTemplates {
    [key: string]: CellTemplate;
}

/**
 * Describes focus position inside the grid.
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/6-cell-location/
 */
export interface CellLocation {
    /** Row id of cell location */
    readonly rowId: Id;
    /** Column id of cell location */
    readonly columnId: Id;
}

/**
 * Highlight is an element to mark any cell inside the grid 
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/9-highlight/
 */
export interface Highlight {
    /**  Row id of the cell to highlight */
    readonly rowId: Id;
    /** Column id of the cell to highlight */
    readonly columnId: Id;
    /** Optional border color */
    readonly borderColor?: string;
    /** Optional CSS classname of the highlighted cell */
    readonly className?: string;
}


/**
 * Union of basic cells usually used for consuming changes and marking cells array inside the data row
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/6-default-cells/
 */
export type DefaultCellTypes =
    | CheckboxCell
    | DateCell
    | EmailCell
    | ChevronCell
    | HeaderCell
    | NumberCell
    | TextCell
    | TimeCell;


/**
 * `CellChange` type is used by `onCellsChanged` callback in `ReactGrid` component. 
 * It represents mutually exclusive changes to a single cell.
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/2-cell-change/
 */
export type CellChange<TCell extends Cell = DefaultCellTypes & Cell> = TCell extends Cell ? Change<TCell> : never;

/**
 * Generic `Change` interface represents a particullar change on single cell on concrete cell template.
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/2-cell-change/
 */
export interface Change<TCell extends Cell = DefaultCellTypes> {
    readonly rowId: Id;
    readonly columnId: Id;
    readonly type: TCell['type'];
    readonly previousCell: TCell;
    readonly newCell: TCell;
}

/**
 * ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
 * 
 * This interface is used for the communication between ReactGrid and a cell
 */
export interface CellTemplate<TCell extends Cell = Cell> {
    /** 
     *  Validate and convert to compatible cell type
     */
    getCompatibleCell(uncertainCell: Uncertain<TCell>): Compatible<TCell>
    /**
     * Returns true if the data in the cell is not replacable
     * Default: _ => true
     */
    isFocusable?(cell: Compatible<TCell>): boolean;
    /**
     * Update cell based on new props
     * If not implemented, cell will be read-only
     */
    update?(cell: Compatible<TCell>, cellToMerge: UncertainCompatible<TCell>): Compatible<TCell>;
    /** 
     * The keyCode represents the key pressed on the keyboard, or 1 for a pointer event (double click).
     * Returns the cell data either affected by the event or not.
     * Default: cell => { cell, enableEditMode: false }
    */
    handleKeyDown?(cell: Compatible<TCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): { cell: Compatible<TCell>; enableEditMode: boolean };
    /**
     * Custom styles based on cell data applied to the cells div element
     * Default: _ => cell.style | {}
     */
    getStyle?(cell: Compatible<TCell>, isInEditMode: boolean): CellStyle;
    /**
     * 
     */
    getClassName?(cell: Compatible<TCell>, isInEditMode: boolean): string;
    /** 
     * Render the cell content 
    */
    render(cell: Compatible<TCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TCell>, commit: boolean) => void): React.ReactNode;
}

/**
 * `Id` is a common type to identify many ReactGrids objects
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/4-id/
 */
export type Id = number | string;

/**
 * Indicates where row/column was dropped
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/5-drop-position/
 */
export type DropPosition =
    | 'before'
    | 'on'
    | 'after';

/**
 * ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
 */
export interface Column {
    /** Unique Id in all columns array */
    readonly columnId: Id;
    /** Width of each grid column (in default set to `150px`) */
    readonly width?: number;
    /** Allow column to change its position in grid, default: `false` (row reorder implementation is on the developers side) */
    readonly reorderable?: boolean;
    /** Allow column to change is width in grid, default: `false` (row resize implementation is on the developers side) */
    readonly resizable?: boolean;
}

/**
 * This interface styles single cells border
 */
export interface BorderProps {
    /** Color of border - e.g. `#eee`/`red` */
    readonly color?: string;
    /** Style of border - e.g. `dotted`/`solid` */
    readonly style?: string;
    /** Width of border - e.g. `2px` */
    readonly width?: string;
}

/**
 * Styles single cell and prevents passing unwanted CSS properties that could break down grid rendering
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/7-cell-style/
 */
export interface CellStyle {
    /** CSS `color` property */
    readonly color?: string;
    /** CSS `background` property */
    readonly background?: string;
    /** CSS `overflow` property */
    readonly overflow?: string;
    /** CSS `padding-left` property */
    readonly paddingLeft?: string;
    /** Object that contains all cell's borders properties */
    readonly border?: {
        readonly left?: BorderProps;
        readonly top?: BorderProps;
        readonly right?: BorderProps;
        readonly bottom?: BorderProps;
    }
}

/**
 * 
 */
export interface Cell {
    type: string;
    groupId?: Id;
    style?: CellStyle;
    className?: string;
}

/**
 * 
 */
export type Uncertain<TCell extends Cell> = Partial<TCell> & Cell;

/**
 * 
 * 
 * Extended & excangable cell (compatible between different types)
 */
export type Compatible<TCell extends Cell> = TCell & {
    text: string;
    value: number;
}

/**
 * 
 */
export type UncertainCompatible<TCell extends Cell> = Uncertain<TCell> & {
    text: string;
    value: number;
}

/**
 * 
 */
export interface Row<TCell extends Cell = DefaultCellTypes> {
    readonly rowId: Id;
    readonly cells: TCell[];
    // default: 25 (px)
    readonly height?: number;
    // default: false
    readonly reorderable?: boolean;
};

/**
 * 
 * 
 * 
 */
export interface MenuOption {
    id: string;
    label: string;
    handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => void;
}
