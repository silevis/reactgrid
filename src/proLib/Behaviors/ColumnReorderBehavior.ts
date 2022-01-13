import {
    Direction, PointerLocation, getScrollOfScrollableElement,
} from '../../core';
import { PointerEvent } from '../Model/domEventsTypes';
import { handleContextMenu } from '../Functions/handleContextMenu';
import { ProBehavior } from '../Model/ProBehavior';
import { ProState } from '../Model/ProState';

export class ColumnReorderBehavior extends ProBehavior {
    private initialColumnIdx!: number;
    private lastPossibleDropLocation?: PointerLocation;
    private pointerOffset!: number;
    private selectedIdxs!: number[];
    autoScrollDirection: Direction = 'horizontal';

    handlePointerDown(event: PointerEvent, location: PointerLocation, state: ProState): ProState {
        this.initialColumnIdx = location.column.idx;
        this.lastPossibleDropLocation = location;
        this.selectedIdxs = state.selectedIndexes.sort();
        const columns = this.selectedIdxs.map(i => state.cellMatrix.columns[i]);
        const leftIndexes = this.selectedIdxs.filter(i => i < location.column.idx);
        const leftColumns = leftIndexes.map(i => state.cellMatrix.columns[i]);
        const leftColumnsWidth = leftColumns.reduce((sum, col) => sum + col.width, 0);
        this.pointerOffset = leftColumnsWidth + location.cellX;
        return {
            ...state,
            lineOrientation: 'vertical',
            shadowSize: columns.reduce((sum, col) => sum + col.width, 0),
            shadowPosition: this.getShadowPosition(location, state)
        }
    }

    handlePointerMove(event: PointerEvent, location: PointerLocation, state: ProState): ProState {
        return {
            ...state,
            shadowPosition: this.getShadowPosition(location, state)
        }
    }

    getShadowPosition(location: PointerLocation, state: ProState): number {
        const x = location.viewportX - this.pointerOffset;
        const max = state.cellMatrix.width - state.shadowSize;
        if (x < 0) {
            return 0;
        } else if (x > max) {
            return max;
        }
        return x;
    }

    handlePointerEnter(event: PointerEvent, location: PointerLocation, state: ProState): ProState {
        const dropLocation = this.getLastPossibleDropLocation(location, state);
        const { scrollLeft } = getScrollOfScrollableElement(state.scrollableElement);
        if (!dropLocation) return state;
        const drawRight = dropLocation.column.idx > this.initialColumnIdx;
        const linePosition = Math.min(dropLocation.viewportX - dropLocation.cellX + (drawRight ? dropLocation.column.width : 0),
            (state.visibleRange?.width || 0) + state.cellMatrix.ranges.stickyLeftRange.width + state.cellMatrix.ranges.stickyRightRange.width + scrollLeft
        )
        this.lastPossibleDropLocation = dropLocation;
        return {
            ...state,
            linePosition
        }
    }

    getLastPossibleDropLocation(currentLocation: PointerLocation, state: ProState): PointerLocation | undefined {
        const position = currentLocation.column.idx <= this.initialColumnIdx ? 'before' : 'after';
        const columnIds = this.selectedIdxs.map(i => state.cellMatrix.columns[i].columnId);
        if (!state.props?.canReorderColumns || state.props.canReorderColumns(currentLocation.column.columnId, columnIds, position)) {
            return currentLocation;
        }
        return this.lastPossibleDropLocation;
    }

    handlePointerUp(event: PointerEvent, location: PointerLocation, state: ProState): ProState {
        if (location.column.idx !== this.initialColumnIdx && this.lastPossibleDropLocation && state.props?.onColumnsReordered) {
            const isBefore = this.lastPossibleDropLocation.column.idx <= this.initialColumnIdx;
            const columnIds = this.selectedIdxs.map(i => state.cellMatrix.columns[i].columnId);
            state.props?.onColumnsReordered(this.lastPossibleDropLocation.column.columnId, columnIds, isBefore ? 'before' : 'after');
        }
        return {
            ...state,
            linePosition: -1,
            shadowPosition: -1,
            shadowCursor: 'default'
        };
    }

    handleContextMenu(event: PointerEvent, state: ProState): ProState {
        return handleContextMenu(event, state);
    }

}
