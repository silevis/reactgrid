import { State } from '../Model/State';
import { Range } from '../Model/Range';
import { Location } from '../Model/InternalModel';
export declare function getDataToCopy(state: State, activeSelectedRange: Range, removeValues?: boolean): {
    div: HTMLDivElement;
    text: string;
};
export declare function processSingleCell(tableRow: HTMLTableRowElement, state: State, location: Location): void;
export declare function createHTMLElements(activeSelectedRange: Range): {
    div: HTMLDivElement;
    table: HTMLTableElement;
    location: Location;
};
export declare function setStyles(div: HTMLDivElement, table: HTMLTableElement): void;
export declare function clearCell(state: State, location: Location, removeValues: boolean): void;
