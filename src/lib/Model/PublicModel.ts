/**
 * This is the public API for ReactGrid
 * PLEASE ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE IN THIS FILE
 * THANKS!
 * 
 * Michael Matejko
 */

import {
    TextCell, HeaderCell, CheckboxCell, DateCell, EmailCell, ChevronCell, NumberCell, TimeCell, DropdownCell
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
 * `ReactGrid`'s component props
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/1-reactgrid-props/
 */
export interface ReactGridProps {
    /** Array of `Column`s */
    readonly columns: Column[];
    /** Array of `Row`s  */
    readonly rows: Row<Cell>[];
    /** Object that contains available custom cell templates */
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
    /** Amount of columns which are sticky on the left side */
    readonly stickyLeftColumns?: number;
    /** Amount of columns which are sticky on the right side */
    readonly stickyRightColumns?: number;
    /** Set `true` to enable cell fill handle feature (by default `false`) */
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
    /** 
     * Horizontal breakpoint in percents (%) of ReactGrid scrollable parent element width. 
     * Disables sticky when the sum of the sizes of sticky panes overflows
     * given breakpoint value (by default `50`).
    */
    readonly horizontalStickyBreakpoint?: number;
    /** 
     * Vertical breakpoint in percents (%) of ReactGrid scrollable parent element height. 
     * Disables sticky when the sum of the sizes of sticky panes overflows
     * given breakpoint value (by default `50`).
    */
    readonly verticalStickyBreakpoint?: number;

    /** 
     * Called when cell was changed (e.g. property `value`)
     * 
     * @param {CellChange[]} cellChanges Array of cell changes
     * @returns {void}
     */
    readonly onCellsChanged?: (cellChanges: CellChange[]) => void;

    /** 
     * Focus position has been changed
     * 
     * @param {CellLocation} location New focus location
     * @returns {void}
     */
    readonly onFocusLocationChanged?: (location: CellLocation) => void;

    /** 
     * Called when trying to change focus location.
     * You are able to prevent position changing.
     * 
     * @param {CellLocation} location New focus location
     * @returns {boolean} Return `false` to prevent position changing
     */
    readonly onFocusLocationChanging?: (location: CellLocation) => boolean;

    /** 
     * Called when column resize action was finished
     * 
     * @param {Id} columnId Resized column `Id`
     * @param {number} width New column width
     * @param {Id[]} selectedColIds Array of selected column `Id`s
     * @returns {void}
     */
    readonly onColumnResized?: (columnId: Id, width: number, selectedColIds: Id[]) => void;

    /** 
     * Called when row reorder action was finished
     * 
     * @param {Id} targetRowId Row's `Id` on which action was finished
     * @param {Id[]} rowIds Array of reordered row's `Id`s  
     * @param {DropPosition} dropPosition Indicated where row was dropped relatively to it's origin position
     * @returns {void}
     */
    readonly onRowsReordered?: (targetRowId: Id, rowIds: Id[], dropPosition: DropPosition) => void;

    /** 
     * Called when column reorder action was finished
     * 
     * @param {Id} targetRowId Column's `Id` on which action was finished
     * @param {Id[]} columnIds Array of reordered column's `Id`s  
     * @param {DropPosition} dropPosition Indicated where row was dropped relatively to it's origin position
     * @returns {void}
     */
    readonly onColumnsReordered?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => void;

    /** 
     * Called when user opens context menu inside grid, used to compose own menu options 
     * 
     * @param {Id[]} selectedRowIds Array of selected column's `Id`s
     * @param {Id[]} selectedColIds Array of selected rows's `Id`s
     * @param {SelectionMode} selectionMode Current selection mode
     * @param {MenuOption[]} menuOptions Array of built-in menu options e.g. copy/cut/paste
     * @returns {MenuOption[]} Returns array of context menu options
     */
    readonly onContextMenu?: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[]) => MenuOption[];

    /** 
     * Allow or not to change specific columns order
     * 
     * @param {Id} targetColumnId Target column `Id`
     * @param {Id[]} columnIds Column's `Id`s that are currently being reordering
     * @param {DropPosition} dropPosition Drop position relatively to it's origin position
     * @returns {boolean} Return `true` to allow droping column at specific column
     */
    readonly canReorderColumns?: (targetColumnId: Id, columnIds: Id[], dropPosition: DropPosition) => boolean;

    /** 
     * Allow or not to change specific rows order
     * @param {Id} targetRowId Target row `Id`
     * @param {Id[]} rowIds Row's `Id`s that are currently being reordering
     * @param {DropPosition} dropPosition Drop position relatively to it's origin position
     * @returns {boolean} Return `true` to allow droping column at specific column
     */
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
    | TimeCell
    | DropdownCell

/**
 * `CellChange` type is used by `onCellsChanged`. It represents mutually exclusive changes on a single cell.
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/2-cell-change/
 */
export type CellChange<TCell extends Cell = DefaultCellTypes & Cell> = TCell extends Cell
    ? {
        /** Row's `Id` where the change ocurred */
        readonly rowId: Id;
        /** Column's `Id` where the change ocurred */
        readonly columnId: Id;
        /** Extracted cell type of `TCell` (e.g. `text`, `chevron` and so on) */
        readonly type: TCell['type'];
        /** Previous content of the cell */
        readonly previousCell: TCell;
        /** New content of the cell */
        readonly newCell: TCell;
    }
    : never;

/**
 * This interface is used for the communication between ReactGrid and a cell
 * 
 * How to create new cell template:
 * @see https://reactgrid.com/docs/3.1/5-create-your-own-cell-template/
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/5-cell-template/
 */
export interface CellTemplate<TCell extends Cell = Cell> {
    /** 
     * Validates and converts `uncertainCell` to compatible cell type
     * 
     * @param {Uncertain<TCell>} uncertainCell Cell with all optional fields of its base (`TCell`)
     * @returns {Compatible<TCell>} Compatible cell of its base (`TCell`)
     */
    getCompatibleCell(uncertainCell: Uncertain<TCell>): Compatible<TCell>;

    /**
     * Returns `true` if the cell is focusable
     * 
     * @param {Compatible<TCell>} cell Current cell as `Compatible` cell 
     * @returns {boolean} `true` if cell should be focusable, by default returns `true`
     */
    isFocusable?(cell: Compatible<TCell>): boolean;

    /**
     * Updates cell based on new props. If not implemented, cell will be read-only
     * 
     * @param {Compatible<TCell>} cell Current cell
     * @param {UncertainCompatible<TCell>} cellToMerge Incoming cell
     * @returns {Compatible<TCell>} Merged cell as `Compatible` cell
     */
    update?(cell: Compatible<TCell>, cellToMerge: UncertainCompatible<TCell>): Compatible<TCell>;

    /** 
     * Handles keydown event on cell template and double click (opening cell in edit mode)
     * Default: cell => { cell, enableEditMode: false }
     * 
     * @param {Compatible<TCell>} cell Incoming `Compatible` cell
     * @param {number} keyCode Represents the key pressed on the keyboard, or 1 for a pointer event (double click).
     * @param {boolean} ctrl Is `ctrl` pressed when event is called ()
     * @param {boolean} shift Is `shift` pressed when event is called
     * @param {boolean} alt Is `alt` pressed when event is called
     * @returns {{ cell: Compatible<TCell>; enableEditMode: boolean }} Cell data and edit mode either affected by the event or not
    */
    handleKeyDown?(
        cell: Compatible<TCell>,
        keyCode: number,
        ctrl: boolean,
        shift: boolean,
        alt: boolean
    ): { cell: Compatible<TCell>; enableEditMode: boolean };

    /**
     * Returns custom styles based on cell data applied to the cells `div` element
     * Default: _ => cell.style | {}
     * 
     * @param {Compatible<TCell>} cell Incoming `Compatible` cell
     * @param {boolean} isInEditMode Flag is set to `true`, if cell is rendered in edit mode
     * @returns {CellStyle} Custom cell styling properties
     */
    getStyle?(cell: Compatible<TCell>, isInEditMode: boolean): CellStyle;

    /**
     *  Returns CSS classes based on cell data applied to the cells `div` element
     * 
     * @param {Compatible<TCell>} cell Incoming `Compatible` cell
     * @param {boolean} isInEditMode Flag is set to `true`, if cell is rendered in edit mode
     * @returns {string} Cells CSS class names
     */
    getClassName?(cell: Compatible<TCell>, isInEditMode: boolean): string;

    /** 
     * Renders the cell content
     * 
     * @param {Compatible<TCell>} cell Incoming `Compatible` cell
     * @param {boolean} isInEditMode Flag is set to `true`, if cell is rendered in edit mode
     * @param {(cell: Compatible<TCell>, commit: boolean) => void} onCellChanged Callback used for commiting changes on a cell. For example: typing on html `input` element 
     * @returns {React.ReactNode} Content of a cell
    */
    render(
        cell: Compatible<TCell>,
        isInEditMode: boolean,
        onCellChanged: (cell: Compatible<TCell>, commit: boolean) => void
    ): React.ReactNode;
}

/**
 * `Id` is a common type to identify many ReactGrids objects
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/4-id/
 */
export type Id = number | string;

/**
 * Indicates where row/column was dropped relatively to its origin and target object
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/5-drop-position/
 */
export type DropPosition =
    | 'before'
    | 'on'
    | 'after'

/**
 * Represents column in the grid
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/3-column/
 */
export interface Column {
    /** Unique `Id` in all columns array */
    readonly columnId: Id;
    /** Width of each grid column (in default set to `150px`) */
    readonly width?: number;
    /** Allow column to change its position in grid, 
     * default: `false` (row reorder implementation is on the developers side) 
     */
    readonly reorderable?: boolean;
    /** Allow column to change is width in grid, 
     * default: `false` (row resize implementation is on the developers side) 
     */
    readonly resizable?: boolean;
}

/**
 * This interface styles single cells border
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/7-cell-style/
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
 * This interface styles single cell and prevents passing unwanted CSS properties that could break down grid rendering
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
 * Defines quantity of rows and columns to span. 
 * At this moment span feature is available only for `HeaderCell`.
 * 
 * @see https://reactgrid.com/docs/3.1/2-implementing-core-features/9e-cell-span/
 */
export interface Span {
    /** Specifies the number of columns a cell should span */
    colspan?: number;
    /** Specifies the number of rows a cell should span */
    rowspan?: number;
}

/**
 * A base for built-in cell types (e.g. `HeaderCell`) and your own
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/4-cell/
 */
export interface Cell {
    /** Name of cell type, must be unique */
    type: string;
    /** Marks cell as non editable (by default: `false`) */
    nonEditable?: boolean;
    /** `Id` of group to which this cell belongs to */
    groupId?: Id;
    /** Allowed style properties contained in `CellStyle` interface */
    style?: CellStyle;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Cell type marker - every field of `TCell` is optional.
 * Cell of this type will have only one essential field provided by `Cell` interface - `type`.
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/2-uncertain-cell/
 */
export type Uncertain<TCell extends Cell> = Partial<TCell> & Cell;

/**
 * Cell type marker - extended & exchangeable cell (compatible with different types)
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/1-compatible-cell/
 */
export type Compatible<TCell extends Cell> = TCell & {
    /** Text value of a cell */
    text: string;
    /**  Numeric value of a cell, if there is no numeric value representation use `NaN` */
    value: number;
}

/**
 * `UncertainCompatible` is a cell type that is compatible with other cell types 
 * that can be instances of various cell types (e.g. `DataCell` and `TimeCell`).
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/3-uncertain-compatible-cell/
 */
export type UncertainCompatible<TCell extends Cell> = Uncertain<TCell> & {
    /** Text value of a cell */
    text: string;
    /** Numeric value of a cell, if there is no numeric value representation use `NaN` */
    value: number;
}

/**
 * `Row` contains essential information about the grid row. 
 * `cells` field allows you to declare an array of objects that extends `Cell` base interface.
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/2-row/
 */
export interface Row<TCell extends Cell = DefaultCellTypes> {
    /** Unique `Id` in all rows array */
    readonly rowId: Id;
    /** Array of `Cell` objects */
    readonly cells: TCell[];
    /** Height of each grid row (in default set to `25` in px) */
    readonly height?: number;
    /** 
     * Property that allows row to change is position in grid, 
     * default: `false` (row reorder implementation is on the developer's side) 
     */
    readonly reorderable?: boolean;
}

/**
 * Menu option element displayed in context menu
 * 
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/8-menuoption/
 */
export interface MenuOption {
    /** Text that identifies each menu option */
    id: string;
    /** Text label displayed as its title */
    label: string;
    /** 
     * Function that is called when an option is clicked
     * 
     * @param {Id[]} selectedRowIds `Id`s of selected rows.
     * @param {Id[]} selectedColIds `Id`s of selected columns.
     * @param {SelectionMode} selectionMode Current selection mode.
     * @returns {void}
     */
    handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode) => void;
}
