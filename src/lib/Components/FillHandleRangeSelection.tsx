import * as React from 'react';
import { PaneContentChild } from '../Model/InternalModel';

export const FillHandleRangeSelection: React.FC<PaneContentChild> = ({ state, calculatedRange }) => {
    return <>
        {state.currentBehavior.renderPanePart(state, calculatedRange)}
    </>
}
