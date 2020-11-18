import * as React from 'react';
import { Location } from '../Model/InternalModel';

interface CellFocusProps {
    location: Location;
    isHighlight?: boolean;
    borderColor?: string;
    className?: string;
}

// TODO make HOC for highlights 
export const CellFocus: React.FC<CellFocusProps> = ({ borderColor, isHighlight, location, className }) => (
    <div
        key={borderColor}
        data-cy={!isHighlight ? 'rg-cell-focus' : 'rg-cell-highlight'}
        className={`rg-cell-focus ${className || ''}`}
        style={{
            top: location.row.top - (location.row.top === 0 ? 0 : 1),
            left: location.column.left - (location.column.left === 0 ? 0 : 1),
            width: location.column.width + (location.column.left === 0 ? 0 : 1),
            height: location.row.height + (location.row.top === 0 ? 0 : 1),
            borderColor: `${borderColor}`,
        }}
    />
);
