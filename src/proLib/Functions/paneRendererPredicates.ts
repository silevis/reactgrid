import { ProState } from '../Model/ProState';

export function shouldRenderBottomSticky(state: ProState): boolean {
    return !!(state.cellMatrix.ranges.stickyBottomRange.height > 0 && state.cellMatrix.rows.length > 0);
}

export function shouldRenderRightSticky(state: ProState): boolean {
    return !!(state.cellMatrix.ranges.stickyRightRange.width > 0);
}