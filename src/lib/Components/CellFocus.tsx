import * as React from 'react';
import { Location } from '../Model/InternalModel';

interface CellFocusProps {
    location: Location;
    isHighlight?: boolean;
    borderColor?: string;
    className?: string;
}

// TODO make HOC for highlights 
export const CellFocus: React.FunctionComponent<CellFocusProps> = props => (
    <div
        key={props.borderColor}
        data-cy={!props.isHighlight ? 'rg-cell-focus' : 'rg-cell-highlight'}
        className={`rg-cell-focus ${props.className || ''}`}
        style={{
            top: props.location.row.top - (props.location.row.top === 0 ? 0 : 1),
            left: props.location.column.left - (props.location.column.left === 0 ? 0 : 1),
            width: props.location.column.width + (props.location.column.left === 0 ? 0 : 1),
            height: props.location.row.height + (props.location.row.top === 0 ? 0 : 1),
            borderColor: `${props.borderColor}`,
        }}
    />
);
