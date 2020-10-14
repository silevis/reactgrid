
import { EventHandlers } from './EventHandlers';
import { Column, Row } from './PublicModel';
import { State } from './State';

export type Orientation = 'horizontal' | 'vertical';

export type Direction = 'horizontal' | 'vertical' | 'both';

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// INTERNAL
export interface GridColumn extends Column {
    readonly idx: number;
    readonly left: number;
    readonly right: number;
    readonly width: number;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// INTERNAL
export interface GridRow extends Row {
    readonly idx: number;
    readonly top: number;
    readonly bottom: number;
    readonly height: number;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!	
// INTERNAL	
export interface Borders {
    top?: boolean;
    left?: boolean;
    bottom?: boolean;
    right?: boolean;
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// INTERNAL
export interface Location {
    readonly row: GridRow,
    readonly column: GridColumn
}

// ASK ARCHITECT BEFORE INTRODUCING ANY CHANGE!
// INTERNAL
export interface PointerLocation extends Location {
    readonly row: GridRow,
    readonly column: GridColumn,
    readonly viewportX: number,
    readonly viewportY: number,
    readonly cellX: number,
    readonly cellY: number
}

export interface GridRendererProps {
    state: State;
    eventHandlers: EventHandlers;
}
