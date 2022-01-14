import * as React from 'react';
import { ProPaneContentChild } from './HOCs';

export const FillHandleRangeSelection: React.FC<ProPaneContentChild> = ({ state, calculatedRange }) => {
    return <>
        {state.currentBehavior.renderPanePart(state, calculatedRange)}
    </>
}
