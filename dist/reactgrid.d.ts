/// <reference types="react" />
import * as React$1 from 'react';
import { CSSObjectWithLabel } from 'react-select';

interface CheckboxCell extends Cell {
    type: "checkbox";
    checked: boolean;
    checkedText?: string;
    uncheckedText?: string;
}
declare class CheckboxCellTemplate implements CellTemplate<CheckboxCell> {
    getCompatibleCell(uncertainCell: Uncertain<CheckboxCell>): Compatible<CheckboxCell>;
    handleKeyDown(cell: Compatible<CheckboxCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean): {
        cell: Compatible<CheckboxCell>;
        enableEditMode: boolean;
    };
    private toggleCheckboxCell;
    update(cell: Compatible<CheckboxCell>, cellToMerge: UncertainCompatible<CheckboxCell>): Compatible<CheckboxCell>;
    getClassName(cell: Compatible<CheckboxCell>): string;
    render(cell: Compatible<CheckboxCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<CheckboxCell>, commit: boolean) => void): React$1.ReactNode;
}

interface DateCell extends Cell {
    type: "date";
    date?: Date;
    format?: Intl.DateTimeFormat;
}
declare class DateCellTemplate implements CellTemplate<DateCell> {
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<DateCell>): Compatible<DateCell>;
    handleKeyDown(cell: Compatible<DateCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<DateCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<DateCell>, cellToMerge: UncertainCompatible<DateCell>): Compatible<DateCell>;
    getClassName(cell: Compatible<DateCell>, isInEditMode: boolean): string;
    render(cell: Compatible<DateCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DateCell>, commit: boolean) => void): React$1.ReactNode;
}

interface EmailCell extends Cell {
    type: "email";
    text: string;
    validator?: (text: string) => boolean;
    renderer?: (text: string) => React$1.ReactNode;
    errorMessage?: string;
}
declare class EmailCellTemplate implements CellTemplate<EmailCell> {
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<EmailCell>): Compatible<EmailCell>;
    handleKeyDown(cell: Compatible<EmailCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<EmailCell>;
        enableEditMode: boolean;
    };
    handleCompositionEnd(cell: Compatible<EmailCell>, eventData: any): {
        cell: Compatible<EmailCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<EmailCell>, cellToMerge: UncertainCompatible<EmailCell>): Compatible<EmailCell>;
    getClassName(cell: Compatible<EmailCell>, isInEditMode: boolean): string;
    render(cell: Compatible<EmailCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<EmailCell>, commit: boolean) => void): React$1.ReactNode;
}

interface ChevronCell extends Cell {
    type: "chevron";
    text: string;
    isExpanded?: boolean;
    hasChildren?: boolean;
    parentId?: Id;
    indent?: number;
}
declare class ChevronCellTemplate implements CellTemplate<ChevronCell> {
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<ChevronCell>): Compatible<ChevronCell>;
    update(cell: Compatible<ChevronCell>, cellToMerge: UncertainCompatible<ChevronCell>): Compatible<ChevronCell>;
    handleKeyDown(cell: Compatible<ChevronCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<ChevronCell>;
        enableEditMode: boolean;
    };
    handleCompositionEnd(cell: Compatible<ChevronCell>, eventData: any): {
        cell: Compatible<ChevronCell>;
        enableEditMode: boolean;
    };
    getClassName(cell: Compatible<ChevronCell>, isInEditMode: boolean): string;
    getStyle(cell: Compatible<ChevronCell>, isInEditMode: boolean): CellStyle;
    render(cell: Compatible<ChevronCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<ChevronCell>, commit: boolean) => void): React$1.ReactNode;
}

interface HeaderCell extends Cell, Span {
    type: 'header';
    text: string;
}
declare class HeaderCellTemplate implements CellTemplate<HeaderCell> {
    getCompatibleCell(uncertainCell: Uncertain<HeaderCell>): Compatible<HeaderCell>;
    render(cell: Compatible<HeaderCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<HeaderCell>, commit: boolean) => void): React$1.ReactNode;
    isFocusable: (cell: Compatible<HeaderCell>) => boolean;
    getClassName(cell: Compatible<HeaderCell>, isInEditMode: boolean): string;
    getStyle: (cell: Compatible<HeaderCell>) => CellStyle;
}

interface NumberCell extends Cell {
    type: "number";
    value: number;
    format?: Intl.NumberFormat;
    validator?: (value: number) => boolean;
    nanToZero?: boolean;
    hideZero?: boolean;
    errorMessage?: string;
}
declare class NumberCellTemplate implements CellTemplate<NumberCell> {
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<NumberCell>): Compatible<NumberCell>;
    handleKeyDown(cell: Compatible<NumberCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<NumberCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<NumberCell>, cellToMerge: UncertainCompatible<NumberCell>): Compatible<NumberCell>;
    private getTextFromCharCode;
    getClassName(cell: Compatible<NumberCell>, isInEditMode: boolean): string;
    render(cell: Compatible<NumberCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<NumberCell>, commit: boolean) => void): React$1.ReactNode;
}

interface TextCell extends Cell {
    type: "text";
    text: string;
    placeholder?: string;
    validator?: (text: string) => boolean;
    renderer?: (text: string) => React$1.ReactNode;
    errorMessage?: string;
}
declare class TextCellTemplate implements CellTemplate<TextCell> {
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<TextCell>): Compatible<TextCell>;
    update(cell: Compatible<TextCell>, cellToMerge: UncertainCompatible<TextCell>): Compatible<TextCell>;
    handleKeyDown(cell: Compatible<TextCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<TextCell>;
        enableEditMode: boolean;
    };
    handleCompositionEnd(cell: Compatible<TextCell>, eventData: any): {
        cell: Compatible<TextCell>;
        enableEditMode: boolean;
    };
    getClassName(cell: Compatible<TextCell>, isInEditMode: boolean): string;
    render(cell: Compatible<TextCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TextCell>, commit: boolean) => void): React$1.ReactNode;
}

interface TimeCell extends Cell {
    type: "time";
    time?: Date;
    format?: Intl.DateTimeFormat;
}
declare class TimeCellTemplate implements CellTemplate<TimeCell> {
    static dayInMillis: number;
    static defaultDate: string;
    private wasEscKeyPressed;
    getCompatibleCell(uncertainCell: Uncertain<TimeCell>): Compatible<TimeCell>;
    handleKeyDown(cell: Compatible<TimeCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string): {
        cell: Compatible<TimeCell>;
        enableEditMode: boolean;
    };
    update(cell: Compatible<TimeCell>, cellToMerge: UncertainCompatible<TimeCell>): Compatible<TimeCell>;
    getClassName(cell: Compatible<TimeCell>, isInEditMode: boolean): string;
    render(cell: Compatible<TimeCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TimeCell>, commit: boolean) => void): React$1.ReactNode;
}

type OptionType = {
    label: string;
    value: string;
    isDisabled?: boolean;
};
interface DropdownCell extends Cell {
    type: 'dropdown';
    selectedValue?: string;
    values: OptionType[];
    isDisabled?: boolean;
    isOpen?: boolean;
    inputValue?: string;
    styles?: {
        container?: CSSObjectWithLabel;
        control?: CSSObjectWithLabel;
        indicatorsContainer?: CSSObjectWithLabel;
        dropdownIndicator?: CSSObjectWithLabel;
        singleValue?: CSSObjectWithLabel;
        indicatorSeparator?: CSSObjectWithLabel;
        input?: CSSObjectWithLabel;
        valueContainer?: CSSObjectWithLabel;
    };
}
declare class DropdownCellTemplate implements CellTemplate<DropdownCell> {
    getCompatibleCell(uncertainCell: Uncertain<DropdownCell>): Compatible<DropdownCell>;
    update(cell: Compatible<DropdownCell>, cellToMerge: UncertainCompatible<DropdownCell>): Compatible<DropdownCell>;
    getClassName(cell: Compatible<DropdownCell>, isInEditMode: boolean): string;
    handleKeyDown(cell: Compatible<DropdownCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key: string, capsLock: boolean): {
        cell: Compatible<DropdownCell>;
        enableEditMode: boolean;
    };
    handleCompositionEnd(cell: Compatible<DropdownCell>, eventData: any): {
        cell: Compatible<DropdownCell>;
        enableEditMode: boolean;
    };
    render(cell: Compatible<DropdownCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<DropdownCell>, commit: boolean) => void): React$1.ReactNode;
}

/**
 * Checks that the pressed key's `keyCode` is one of alphanumeric keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of alpha numeric keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
declare const isAlphaNumericKey: (keyCode: number) => boolean;
/**
 * Similar to {@link isAlphaNumericKey} - checks that the provided `char` is one of alphanumeric characters
 *
 * @param {string} char character produced by `KeyboardEvent.key` field
 * @returns {boolean} Returns `true` if `char` is one of alphanumeric characters
 */
declare const isCharAlphaNumeric: (char: string) => boolean;
/**
 * Helper function to check that the provided `key` produces printable character
 * @param key field from `KeyboardEvent` interface
 * @returns Returns `true` if `key` is one of printable characters
 */
declare const isKeyPrintable: (key: string) => boolean;
/**
 * Checks that the pressed key's `keyCode` is one of numeric keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of numeric keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
declare const inNumericKey: (keyCode: number) => boolean;
/**
 * Checks that the pressed key's `keyCode` is one of numpad keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of numpad keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
declare const isNumpadNumericKey: (keyCode: number) => boolean;
/**
 * Checks that the pressed key's `keyCode` is allow while typing numeric value e.g. `-3.14`
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of allowed on typing numeric value
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
declare const isAllowedOnNumberTypingKey: (keyCode: number) => boolean;
/**
 * Similar to {@link isAllowedOnNumberTypingKey} - checks that the provided `char` is allowed while typing numeric value e.g. `-3.14`
 *
 * @param {string} char character produced by `KeyboardEvent.key` field
 * @returns {boolean} Returns `true` if `char` is one of allowed while typing numeric value
 */
declare const isCharAllowedOnNumberInput: (char: string) => boolean;
/**
 * Checks that the pressed key's `keyCode` is one of navigation keys
 *
 * @param {number} keyCode `keyCode` field from `KeyboardEvent` interface
 * @returns {boolean} Returns `true` if `keyCode` is one of navigation keys
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
declare const isNavigationKey: (keyCode: number) => boolean;

declare const getCharFromKeyCode: (keyCode: number, isShiftKey?: boolean) => string;
declare const getCharFromKey: (key: string, isShiftKey?: boolean, isCapsLock?: boolean) => string;

type SliceDirection = 'columns' | 'rows' | 'both';
declare class Range {
    readonly rows: GridRow[];
    readonly columns: GridColumn[];
    readonly width: number;
    readonly height: number;
    readonly first: Location;
    readonly last: Location;
    constructor(rows: GridRow[], columns: GridColumn[]);
    contains(location: Location): boolean;
    slice(range: Range, direction: SliceDirection): Range;
}

/**
 * This is the public API for ReactGrid
 * PLEASE ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE IN THIS FILE
 * THANKS!
 *
 * Michael Matejko
 */

/**
 * `SelectionMode` is a marker for currect selection mode
 *
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/7-selection-mode/
 */
type SelectionMode = 'row' | 'column' | 'range';
/**
 * `ReactGrid`'s component props
 *
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/1-reactgrid-props/
 */
interface ReactGridProps {
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
    /** Set `true` to disable virtual scrolling (by default `false`) */
    readonly disableVirtualScrolling?: boolean;
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
     * Defines a base for z-indexes used by ReactGrid.
     * Internally used as: zIndexBase + <value> (e.g. zIndexBase + 1)
     *
     * Why?: Chrome update v.117 broke sticky rows/columns feature
     * and because we're not sure what changed internally that caused this issue,
     * we decided the easiest way to fix this will be to use z-indexes.
     */
    readonly zIndexBase?: number;
    /**
     * When pressing `Enter` key, move focus to the next column (by default `false`)
     */
    readonly moveRightOnEnter?: boolean;
    /**
     * Minimum column width (by default `40`), in pixels
     * Used to limit the width column can be resized down to.
     */
    readonly minColumnWidth?: number;
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
     * Called when selection has been changed.
     *
     * @param {Range[]} selectedRanges array of selected cell locations
     * @returns {void}
     */
    readonly onSelectionChanged?: (selectedRanges: Range[]) => void;
    /**
     * Called when trying to change selection.
     * You are able to prevent selection changing.
     *
     * @param {Range[]} selectedRanges array of selected cell locations
     * @returns {boolean} Return `false` to prevent selection changing
     */
    readonly onSelectionChanging?: (selectedRanges: Range[]) => boolean;
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
     * @param {Array<CellLocation[]>} selectedRanges Returns array of selected cell locations
     * @returns {MenuOption[]} Returns array of context menu options
     */
    readonly onContextMenu?: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, menuOptions: MenuOption[], selectedRanges: Array<CellLocation[]>) => MenuOption[];
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
interface TextLabels {
    /**
     * Label of text header when browser isn't supported,
     * by default: `Please update to a modern browser.`
    */
    legacyBrowserHeader?: string;
    /**
     * Label of text paragraph when browser isn't supported,
     * by default: `Your current browser cannot run our content, please make sure you browser is fully updated
     * or try adifferent browser. We highly recommend using the most recent release of Google Chrome, Microsoft Edge,
     * Firefox, Safari, and Opera browser`
    */
    legacyBrowserText?: string;
    /**
     * Label of copy action displayed inside context menu (just PRO),
     * by default: `Copy`
     */
    copyLabel?: string;
    /**
     * Label of cut action displayed inside context menu (just PRO),
     * by default: `Cut`
     */
    cutLabel?: string;
    /**
     * Label of paste action displayed inside context menu (just PRO),
     * by default: `Paste`
     */
    pasteLabel?: string;
    /**
     * Alert label in use (e.g. MacOS) if access to the clipboard is denied (just PRO),
     * by default: `Use ⌘ + c for copy, ⌘ + x for cut and ⌘ + v for paste.`
     */
    actionNotSupported?: string;
    /**
     *  Alert label in use (e.g. Firefox) if access to the clipboard is denied (just PRO),
     * by default: ` Use ctrl + c for copy, ctrl + x for cut and ctrl + v for paste.`
     */
    appleMobileDeviceContextMenuPasteAlert?: string;
    /**
     * Alert label in use (e.g. Firefox) if access to the clipboard is denied (just PRO),
     * by default: `This action is not supported in this browser.`
     */
    otherBrowsersContextMenuPasteAlert?: string;
}
/**
 * Describes your custom cell templates as key-value object
 *
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/6a-cell-templates/
 */
interface CellTemplates {
    [key: string]: CellTemplate;
}
/**
 * Describes cell location inside the grid. Could describe e.g. focus.
 *
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/6-cell-location/
 */
interface CellLocation {
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
interface Highlight {
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
type DefaultCellTypes = CheckboxCell | DateCell | EmailCell | ChevronCell | HeaderCell | NumberCell | TextCell | TimeCell | DropdownCell;
/**
 * `CellChange` type is used by `onCellsChanged`. It represents mutually exclusive changes on a single cell.
 *
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/2-cell-change/
 */
type CellChange<TCell extends Cell = DefaultCellTypes & Cell> = TCell extends Cell ? {
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
} : never;
/**
 * This interface is used for the communication between ReactGrid and a cell
 *
 * How to create new cell template:
 * @see https://reactgrid.com/docs/3.1/5-create-your-own-cell-template/
 *
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/5-cell-template/
 */
interface CellTemplate<TCell extends Cell = Cell> {
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
     * @param {string} [key] Represents the value of the key pressed by the user. Optional for backwards compatibility.
     * @param {boolean} capsLock Is caps lock active when event is called. Optional for backwards compatibility.
     * @returns {{ cell: Compatible<TCell>; enableEditMode: boolean }} Cell data and edit mode either affected by the event or not
    */
    handleKeyDown?(cell: Compatible<TCell>, keyCode: number, ctrl: boolean, shift: boolean, alt: boolean, key?: string, capsLock?: boolean): {
        cell: Compatible<TCell>;
        enableEditMode: boolean;
    };
    /**
     * Handles compositionEnd event on cell template (opening cell in edit mode)
     *
     * @param {Compatible<TCell>} cell Incoming `Compatible` cell
     * @param {string} eventData The characters generated by the input method that raised the event
     * @returns {{ cell: Compatible<TCell>; enableEditMode: boolean }} Cell data and edit mode either affected by the event or not
    */
    handleCompositionEnd?(cell: Compatible<TCell>, eventData: string): {
        cell: Compatible<TCell>;
        enableEditMode: boolean;
    };
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
    render(cell: Compatible<TCell>, isInEditMode: boolean, onCellChanged: (cell: Compatible<TCell>, commit: boolean) => void): React.ReactNode;
}
/**
 * `Id` is a common type to identify many ReactGrids objects
 *
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/4-id/
 */
type Id = number | string;
/**
 * Indicates where row/column was dropped relatively to its origin and target object
 *
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/5-drop-position/
 */
type DropPosition = 'before' | 'on' | 'after';
/**
 * Represents column in the grid
 *
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/3-column/
 */
interface Column {
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
interface BorderProps {
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
interface CellStyle {
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
    };
}
/**
 * Defines quantity of rows and columns to span.
 * At this moment span feature is available only for `HeaderCell`.
 *
 * @see https://reactgrid.com/docs/3.1/2-implementing-core-features/9e-cell-span/
 */
interface Span {
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
interface Cell {
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
type Uncertain<TCell extends Cell> = Partial<TCell> & Cell;
/**
 * Cell type marker - extended & exchangeable cell (compatible with different types)
 *
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/1-compatible-cell/
 */
type Compatible<TCell extends Cell> = TCell & {
    /** Text value of a cell */
    text: string;
    /**  Numeric value of a cell, if there is no numeric value representation use `NaN` */
    value: number;
};
/**
 * `UncertainCompatible` is a cell type that is compatible with other cell types
 * that can be instances of various cell types (e.g. `DataCell` and `TimeCell`).
 *
 * @see https://reactgrid.com/docs/3.1/7-api/1-types/3-uncertain-compatible-cell/
 */
type UncertainCompatible<TCell extends Cell> = Uncertain<TCell> & {
    /** Text value of a cell */
    text: string;
    /** Numeric value of a cell, if there is no numeric value representation use `NaN` */
    value: number;
};
/**
 * `Row` contains essential information about the grid row.
 * `cells` field allows you to declare an array of objects that extends `Cell` base interface.
 *
 * @see https://reactgrid.com/docs/3.1/7-api/0-interfaces/2-row/
 */
interface Row<TCell extends Cell = DefaultCellTypes> {
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
interface MenuOption {
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
     * @param {Array<CellLocation[]>} selectedRanges Returns array of selected cell locations
     * @returns {void}
     */
    handler: (selectedRowIds: Id[], selectedColIds: Id[], selectionMode: SelectionMode, selectedRanges: Array<CellLocation[]>) => void;
}
interface ReactGridInstance extends React.Component<ReactGridProps, any, any> {
    /** This method is used to clear the selected item */
    clearSelections(): void;
}

type ClipboardEvent = React$1.ClipboardEvent<HTMLDivElement>;
type KeyboardEvent = React$1.KeyboardEvent<HTMLDivElement>;
type PointerEvent = React$1.PointerEvent<HTMLDivElement> | globalThis.PointerEvent;

declare abstract class Behavior<PointerUpEvent = PointerEvent | MouseEvent> {
    handleKeyDown(event: KeyboardEvent, state: State): State;
    handlePointerUp(event: PointerUpEvent, location: PointerLocation, state: State): State;
    handleKeyUp(event: KeyboardEvent, state: State): State;
    handleCompositionEnd(event: CompositionEvent, state: State): State;
    handleCopy(event: ClipboardEvent, state: State): State;
    handlePaste(event: ClipboardEvent, state: State): State;
    handleCut(event: ClipboardEvent, state: State): State;
    handlePointerDown(event: PointerEvent, location: PointerLocation, state: State): State;
    handleDoubleClick(event: PointerEvent, location: PointerLocation, state: State): State;
    handlePointerMove(event: PointerEvent, location: PointerLocation, state: State): State;
    handlePointerEnter(event: PointerEvent, location: PointerLocation, state: State): State;
    handleContextMenu(event: PointerEvent | MouseEvent, state: State): State;
    renderPanePart(state: State, pane: Range): React.ReactNode;
    autoScrollDirection: Direction;
}

interface IndexLookup {
    [id: string]: number;
}
interface CellMatrixProps {
    columns: Column[];
    rows: Row<Cell>[];
    stickyTopRows?: number;
    stickyLeftColumns?: number;
    stickyRightColumns?: number;
    stickyBottomRows?: number;
    minColumnWidth?: number;
}
interface StickyRanges {
    stickyTopRange: Range;
    stickyLeftRange: Range;
    stickyRightRange: Range;
    stickyBottomRange: Range;
}
interface SpanLookup {
    range?: Range;
}
declare class CellMatrix {
    ranges: StickyRanges;
    static DEFAULT_ROW_HEIGHT: number;
    static DEFAULT_COLUMN_WIDTH: number;
    static MIN_COLUMN_WIDTH: number;
    props: CellMatrixProps;
    scrollableRange: Range;
    width: number;
    height: number;
    columns: GridColumn[];
    rows: GridRow[];
    first: Location;
    last: Location;
    rowIndexLookup: IndexLookup;
    columnIndexLookup: IndexLookup;
    spanCellLookup: {
        [location: string]: SpanLookup;
    };
    rangesToRender: {
        [location: string]: SpanLookup;
    };
    constructor(ranges: StickyRanges);
    getRange(start: Location, end: Location): Range;
    getLocation(rowIdx: number, columnIdx: number): Location;
    getLocationById(rowId: Id, columnId: Id): Location;
    validateLocation(location: Location): Location;
    validateRange(range: Range): Range;
    getCell(location: Location): Cell;
}

type StateModifier<TState extends State = State> = (state: TState) => TState;
type StateUpdater = (modifier: StateModifier) => void;
interface State<TCellMatrix extends CellMatrix = CellMatrix, TBehavior extends Behavior = Behavior> {
    update: StateUpdater;
    readonly props?: ReactGridProps;
    readonly legacyBrowserMode: boolean;
    readonly cellMatrix: TCellMatrix;
    readonly currentBehavior: TBehavior;
    readonly focusedLocation?: Location;
    readonly cellTemplates: CellTemplates;
    hiddenFocusElement?: HTMLDivElement;
    readonly reactGridElement?: HTMLDivElement;
    readonly scrollableElement?: HTMLElement | (Window & typeof globalThis);
    readonly queuedCellChanges: CellChange[];
    currentlyEditedCell?: Compatible<Cell>;
    readonly highlightLocations: Highlight[];
    readonly visibleRange?: Range;
    readonly leftStickyColumns?: number;
    readonly topStickyRows?: number;
    readonly topScrollBoudary: number;
    readonly bottomScrollBoudary: number;
    readonly leftScrollBoudary: number;
    readonly rightScrollBoudary: number;
    readonly enableGroupIdRender: boolean;
    readonly enableFillHandle: boolean;
    readonly enableRangeSelection: boolean;
    readonly enableColumnSelection: boolean;
    readonly enableRowSelection: boolean;
    readonly disableVirtualScrolling: boolean;
    readonly contextMenuPosition: {
        top: number;
        left: number;
    };
    readonly lineOrientation: Orientation;
    readonly linePosition: number;
    readonly shadowSize: number;
    readonly shadowPosition: number;
    readonly shadowCursor: string;
    readonly selectionMode: SelectionMode;
    readonly selectedRanges: Range[];
    readonly selectedIndexes: number[];
    readonly selectedIds: Id[];
    readonly activeSelectedRangeIdx: number;
    readonly copyRange?: Range;
    readonly rightStickyColumns: number | undefined;
    readonly bottomStickyRows: number | undefined;
}

type Orientation = 'horizontal' | 'vertical';
type Direction = 'horizontal' | 'vertical' | 'both';
interface GridColumn extends Column {
    readonly idx: number;
    readonly left: number;
    readonly right: number;
    readonly width: number;
}
interface GridRow extends Row {
    readonly idx: number;
    readonly top: number;
    readonly bottom: number;
    readonly height: number;
}
interface Location {
    readonly row: GridRow;
    readonly column: GridColumn;
}
interface PointerLocation extends Location {
    readonly row: GridRow;
    readonly column: GridColumn;
    readonly viewportX: number;
    readonly viewportY: number;
    readonly cellX: number;
    readonly cellY: number;
}

/**
 * Gets property cell's value
 *
 * @param uncertainCell Cell to extract its property
 * @param propName Property name to extract
 * @param expectedType Expected `typeof` of extracted property from "uncertain" cell
 * @returns Value of property of given cell
 *
 * @see https://reactgrid.com/docs/3.1/7-api/2-functions/
 */
declare const getCellProperty: <TCell extends Cell, TKey extends keyof TCell>(uncertainCell: Uncertain<TCell>, propName: TKey, expectedType: 'string' | 'number' | 'boolean' | 'undefined' | 'function' | 'object' | 'symbol' | 'bigint') => any;

/**
 * Set of key codes.
 * `POINTER` is a ReactGrid addon
 *
 * @enum {number}
 */
declare enum keyCodes {
    POINTER = 1,
    BACKSPACE = 8,
    TAB = 9,
    ENTER = 13,
    SHIFT = 16,
    CTRL = 17,
    ALT = 18,
    PAUSE = 19,
    CAPS_LOCK = 20,
    ESCAPE = 27,
    SPACE = 32,
    PAGE_UP = 33,
    PAGE_DOWN = 34,
    END = 35,
    HOME = 36,
    LEFT_ARROW = 37,
    UP_ARROW = 38,
    RIGHT_ARROW = 39,
    DOWN_ARROW = 40,
    INSERT = 45,
    DELETE = 46,
    KEY_0 = 48,
    KEY_1 = 49,
    KEY_2 = 50,
    KEY_3 = 51,
    KEY_4 = 52,
    KEY_5 = 53,
    KEY_6 = 54,
    KEY_7 = 55,
    KEY_8 = 56,
    KEY_9 = 57,
    KEY_A = 65,
    KEY_B = 66,
    KEY_C = 67,
    KEY_D = 68,
    KEY_E = 69,
    KEY_F = 70,
    KEY_G = 71,
    KEY_H = 72,
    KEY_I = 73,
    KEY_J = 74,
    KEY_K = 75,
    KEY_L = 76,
    KEY_M = 77,
    KEY_N = 78,
    KEY_O = 79,
    KEY_P = 80,
    KEY_Q = 81,
    KEY_R = 82,
    KEY_S = 83,
    KEY_T = 84,
    KEY_U = 85,
    KEY_V = 86,
    KEY_W = 87,
    KEY_X = 88,
    KEY_Y = 89,
    KEY_Z = 90,
    LEFT_META = 91,
    RIGHT_META = 92,
    SELECT = 93,
    NUMPAD_0 = 96,
    NUMPAD_1 = 97,
    NUMPAD_2 = 98,
    NUMPAD_3 = 99,
    NUMPAD_4 = 100,
    NUMPAD_5 = 101,
    NUMPAD_6 = 102,
    NUMPAD_7 = 103,
    NUMPAD_8 = 104,
    NUMPAD_9 = 105,
    MULTIPLY = 106,
    ADD = 107,
    SUBTRACT = 109,
    DECIMAL = 110,
    DIVIDE = 111,
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
    NUM_LOCK = 144,
    SCROLL_LOCK = 145,
    FIREFOX_DASH = 173,
    SEMICOLON = 186,
    EQUALS = 187,
    COMMA = 188,
    DASH = 189,
    PERIOD = 190,
    FORWARD_SLASH = 191,
    GRAVE_ACCENT = 192,
    OPEN_BRACKET = 219,
    BACK_SLASH = 220,
    CLOSE_BRACKET = 221,
    SINGLE_QUOTE = 222
}

declare class ReactGrid extends React$1.Component<ReactGridProps, State> {
    private updateState;
    private stateUpdater;
    private pointerEventsController;
    private eventHandlers;
    private cellMatrixBuilder;
    state: State;
    static getDerivedStateFromProps(props: ReactGridProps, state: State): State | null;
    clearSelections: () => void;
    componentDidUpdate(prevProps: ReactGridProps, prevState: State): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React$1.ReactNode;
}

export { BorderProps, Cell, CellChange, CellLocation, CellStyle, CellTemplate, CellTemplates, CheckboxCell, CheckboxCellTemplate, ChevronCell, ChevronCellTemplate, Column, Compatible, DateCell, DateCellTemplate, DefaultCellTypes, DropPosition, DropdownCell, DropdownCellTemplate, EmailCell, EmailCellTemplate, HeaderCell, HeaderCellTemplate, Highlight, Id, MenuOption, NumberCell, NumberCellTemplate, OptionType, Range, ReactGrid, ReactGridInstance, ReactGridProps, Row, SelectionMode, Span, TextCell, TextCellTemplate, TextLabels, TimeCell, TimeCellTemplate, Uncertain, UncertainCompatible, getCellProperty, getCharFromKey, getCharFromKeyCode, inNumericKey, isAllowedOnNumberTypingKey, isAlphaNumericKey, isCharAllowedOnNumberInput, isCharAlphaNumeric, isKeyPrintable, isNavigationKey, isNumpadNumericKey, keyCodes };
