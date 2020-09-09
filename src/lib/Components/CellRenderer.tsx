import * as React from 'react';
import { State, Location, Compatible, Cell, Borders } from '../Model';
import { tryAppendChange } from '../Functions';
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { noBorderColors } from '../Functions/excludeObjectProperties';
import { areLocationsEqual } from '../Functions/areLocationsEqual';

export interface CellRendererProps {
    state: State;
    location: Location;
    borders: Borders;	
    children?: React.ReactNode;
}

export interface CellRendererChildProps<TState extends State = State> {
    location?: Location;
    cell?: Compatible<Cell>;
    state?: TState;
}

function getPropValBegin(borders: Borders, borderEdge: 'left' | 'top', cell : Compatible<Cell>, defaultBorderColor: string, defaultValue: string) {
    if (borders[borderEdge]) {
        return cell.style?.borderColors?.[borderEdge] ? cell.style.borderColors[borderEdge] : defaultBorderColor;
    } else if (cell.style?.borderColors?.[borderEdge]) {
        return cell.style.borderColors[borderEdge];
    } return defaultValue;
}

function getPropValEnd(borders: Borders, borderEdge: 'right' | 'bottom', axis: 'row' | 'column', state: State, location: Location, cell : Compatible<Cell>, defaultBorderColor: string, defaultValue: string) {
    if (borders[borderEdge] || !(state.cellMatrix.scrollableRange.last[axis].idx === location[axis].idx)) {
        return cell.style?.borderColors?.[borderEdge] ? cell.style.borderColors[borderEdge] : defaultBorderColor;
    } else if (cell.style?.borderColors?.[borderEdge]) {
        return cell.style?.borderColors?.[borderEdge];
    } return defaultValue;
}

export const CellRenderer: React.FunctionComponent<CellRendererProps> = ({ state, location, children, borders }) => {
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocused = state.focusedLocation !== undefined && areLocationsEqual(state.focusedLocation, location);
    const customClass = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false)) ?? '';
    const defaultBorderColor = '#E8E8E8';
    const bordersColors = {
        borderColorLeft: getPropValBegin(borders, 'left', cell, defaultBorderColor, 'none'),
        borderColorRight: getPropValEnd(borders, 'right', 'column', state, location, cell, defaultBorderColor, 'none'),
        borderColorTop: getPropValBegin(borders, 'top', cell, defaultBorderColor, 'none'),
        borderColorBottom: getPropValEnd(borders, 'bottom', 'row', state, location, cell, defaultBorderColor, 'none'),
    }
    const bordersStyle = {
        borderLeft: '1px solid ' + bordersColors.borderColorLeft,
        borderRight: '1px solid ' + bordersColors.borderColorRight,
        borderTop: '1px solid ' + bordersColors.borderColorTop,
        borderBottom: '1px solid ' + bordersColors.borderColorBottom,
    }

    const style: React.CSSProperties = {
        ...(cellTemplate.getStyle && (cellTemplate.getStyle(cell, false) || {})),
        ...(cell.style && noBorderColors(cell.style)),
        left: location.column.left,
        top: location.row.top,
        width: location.column.width,
        height: location.row.height,
        ...bordersStyle,
        ...((isFocused || cell.type === 'header') && { touchAction: 'none' }) // prevent scrolling
    };

    return (
        <div className={`rg-cell rg-${cell.type}-cell ${cell.groupId ? `rg-groupId-${cell.groupId}` : ''} ${customClass}`}
            style={style} data-cell-colidx={location.column.idx} data-cell-rowidx={location.row.idx} >
            {cellTemplate.render(cell, false, (cell, commit) => {
                if (!commit) throw new Error('commit should be set to true in this case.');
                state.update(state => tryAppendChange(state, location, cell));
            })}
            {children}
            {state.enableGroupIdRender && cell?.groupId !== undefined &&
                <span className='rg-groupId'>
                    {cell.groupId}
                </span>
            }
        </div >
    );
};
