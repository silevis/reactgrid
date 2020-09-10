import * as React from 'react';
import { State, Location, Compatible, Cell, Borders } from '../Model';
import { tryAppendChange } from '../Functions';
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { noBorder } from '../Functions/excludeObjectProperties';
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

function getPropValBegin(borders: Borders, defaultBorderProp: string, cell : Compatible<Cell>, defaultValue: string, prop: 'color' | 'style' | 'width', borderEdge: 'left' | 'top') {
    if (borders[borderEdge]) {
        return cell.style?.border?.[borderEdge]?.[prop] ? cell.style.border[borderEdge]?.[prop] : defaultBorderProp;
    } else if (cell.style?.border?.[borderEdge]?.[prop]) {
        return cell.style.border[borderEdge]?.[prop];
    } return defaultValue;
}

function getPropValEnd(borders: Borders, state: State, location: Location, cell : Compatible<Cell>, defaultBorderColor: string, defaultValue: string, prop: 'color' | 'style' | 'width',  axis: 'row' | 'column', borderEdge: 'right' | 'bottom') {
    if (borders[borderEdge] || !(state.cellMatrix.scrollableRange.last[axis].idx === location[axis].idx)) {
        return cell.style?.border?.[borderEdge]?.[prop] ? cell.style.border[borderEdge]?.[prop] : defaultBorderColor;
    } else if (cell.style?.border?.[borderEdge]?.[prop]) {
        return cell.style?.border?.[borderEdge]?.[prop];
    } return defaultValue;
}

export const CellRenderer: React.FunctionComponent<CellRendererProps> = ({ state, location, children, borders }) => {
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocused = state.focusedLocation !== undefined && areLocationsEqual(state.focusedLocation, location);
    const customClass = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false)) ?? '';
    const defaultBorderColor = '#E8E8E8';
    const defaultBorderWidth = '1px';
    const defaultBorderStyle = 'solid';
    const defaultValue = 'unset';
    const bordersColors = {
        left: getPropValBegin(borders, defaultBorderColor, cell, defaultValue, 'color', 'left'),
        right: getPropValEnd(borders, state, location, cell, defaultBorderColor, defaultValue, 'color', 'column', 'right'),
        top: getPropValBegin(borders, defaultBorderColor,  cell, defaultValue, 'color', 'top'),
        bottom: getPropValEnd(borders, state, location, cell, defaultBorderColor, defaultValue, 'color', 'row', 'bottom'),
    }
    const bordersWidth = {
        left: getPropValBegin(borders, defaultBorderWidth, cell, defaultValue, 'width', 'left'),
        right: getPropValEnd(borders, state, location, cell, defaultBorderWidth, defaultValue, 'width', 'column', 'right'),
        top: getPropValBegin(borders, defaultBorderWidth, cell, defaultValue, 'width', 'top'),
        bottom: getPropValEnd(borders, state, location, cell, defaultBorderWidth, defaultValue, 'width', 'row', 'bottom'),

    }
    const bordersStyle = {
        left: getPropValBegin(borders, defaultBorderStyle, cell, defaultValue, 'style', 'left'),
        right: getPropValEnd(borders, state, location, cell, defaultBorderStyle, defaultValue, 'style', 'column', 'right'),
        top: getPropValBegin(borders, defaultBorderStyle,  cell, defaultValue, 'style', 'top'),
        bottom: getPropValEnd(borders, state, location, cell, defaultBorderStyle, defaultValue, 'style', 'row', 'bottom'),
    }
    const bordersProps = {
        borderLeft: `${bordersWidth.left} ${bordersStyle.left} ${bordersColors.left}`,
        borderRight: `${bordersWidth.right} ${bordersStyle.right} ${bordersColors.right}`,
        borderTop: `${bordersWidth.top} ${bordersStyle.top} ${bordersColors.top}`,
        borderBottom: `${bordersWidth.bottom} ${bordersStyle.bottom} ${bordersColors.bottom}`,
    }
    const style = {
        ...(cellTemplate.getStyle && (cellTemplate.getStyle(cell, false) || {})),
        ...(cell.style && noBorder(cell.style)),
        left: location.column.left,
        top: location.row.top,
        width: location.column.width,
        height: location.row.height,
        ...bordersProps,
        ...((isFocused || cell.type === 'header') && { touchAction: 'none' }) // prevent scrolling
    } as React.CSSProperties;

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
