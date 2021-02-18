import * as React from 'react';
import { Location } from '../Model/InternalModel';
import { State } from '../Model/State';

interface CellFocusProps {
    state?: State;
    location: Location;
    isHighlight?: boolean;
    borderColor?: string;
    className?: string;
}
export const Highlight: React.FC<CellFocusProps> = ({ borderColor, isHighlight, location, className, state }) => {
    const colIdx = location.column.idx;
    const rowIdx = location.row.idx;
    const range = state?.cellMatrix.rangesToRender[state.cellMatrix.getLocationToFindRangeByIds(colIdx, rowIdx)]?.range;
    if (!range) {
        return null;
    }
    return (
        <div
            key={borderColor}
            className={`${isHighlight ? 'rg-cell-highlight' : 'rg-cell-focus'} ${className || ''}`}
            style={{
                top: location.row.top - (location.row.top === 0 ? 0 : 1),
                left: location.column.left - (location.column.left === 0 ? 0 : 1),
                width: range.width + (location.column.left === 0 ? 0 : 1),
                height: range.height + (location.row.top === 0 ? 0 : 1),
                borderColor: `${borderColor}`,
            }}
        />
    );
}

// TODO make HOC for highlights 
export const CellFocus: React.FC<CellFocusProps> = ({ borderColor, isHighlight, location, className }) => {

    return (
        <div
            key={borderColor}
            className={`${isHighlight ? 'rg-cell-highlight' : 'rg-cell-focus'} ${className || ''}`}
            style={{
                top: location.row.top - (location.row.top === 0 ? 0 : 1),
                left: location.column.left - (location.column.left === 0 ? 0 : 1),
                width: location.column.width + (location.column.left === 0 ? 0 : 1),
                height: location.row.height + (location.row.top === 0 ? 0 : 1),
                borderColor: `${borderColor}`,
            }}
        />
    );
}