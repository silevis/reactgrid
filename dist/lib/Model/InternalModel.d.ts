import { Row, Column, State } from '.';
import { EventHandlers } from './EventHandlers';
export declare type Orientation = 'horizontal' | 'vertical';
export declare type Direction = 'horizontal' | 'vertical' | 'both';
export interface GridColumn extends Column {
    readonly idx: number;
    readonly left: number;
    readonly right: number;
    readonly width: number;
}
export interface GridRow extends Row {
    readonly idx: number;
    readonly top: number;
    readonly bottom: number;
    readonly height: number;
}
export interface Borders {
    top?: boolean;
    left?: boolean;
    bottom?: boolean;
    right?: boolean;
}
export interface Location {
    readonly row: GridRow;
    readonly column: GridColumn;
}
export interface PointerLocation extends Location {
    readonly row: GridRow;
    readonly column: GridColumn;
    readonly viewportX: number;
    readonly viewportY: number;
    readonly cellX: number;
    readonly cellY: number;
}
export interface GridRendererProps {
    state: State;
    eventHandlers: EventHandlers;
}
