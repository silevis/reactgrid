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

function getPropValBegin(borders: Borders, defaultBorderProp: string, cell : Compatible<Cell>, defaultValue: string, prop: 'color' | 'style' | 'thickness', borderEdge: 'left' | 'top') {
    if (borders[borderEdge]) {
        return cell.style?.border?.[prop]?.[borderEdge] ? cell.style.border[prop]?.[borderEdge] : defaultBorderProp;
    } else if (cell.style?.border?.[prop]?.[borderEdge]) {
        return cell.style.border[prop]?.[borderEdge];
    } return defaultValue;
}

function getPropValEnd(borders: Borders, state: State, location: Location, cell : Compatible<Cell>, defaultBorderColor: string, defaultValue: string, prop: 'color' | 'style' | 'thickness',  axis: 'row' | 'column', borderEdge: 'right' | 'bottom') {
    if (borders[borderEdge] || !(state.cellMatrix.scrollableRange.last[axis].idx === location[axis].idx)) {
        return cell.style?.border?.[prop]?.[borderEdge] ? cell.style.border[prop]?.[borderEdge] : defaultBorderColor;
    } else if (cell.style?.border?.[prop]?.[borderEdge]) {
        return cell.style?.border?.[prop]?.[borderEdge];
    } return defaultValue;
}

export const CellRenderer: React.FunctionComponent<CellRendererProps> = ({ state, location, children, borders }) => {
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocused = state.focusedLocation !== undefined && areLocationsEqual(state.focusedLocation, location);
    const customClass = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false)) ?? '';
    const defaultBorderColor = '#E8E8E8';
    const defaultBorderThickness = '1px';
    const defaultBorderStyle = 'solid';
    const bordersColors = {
        left: getPropValBegin(borders, defaultBorderColor, cell, 'none', 'color', 'left'),
        right: getPropValEnd(borders, state, location, cell, defaultBorderColor, 'none', 'color', 'column', 'right'),
        top: getPropValBegin(borders, defaultBorderColor,  cell, 'none', 'color', 'top'),
        bottom: getPropValEnd(borders, state, location, cell, defaultBorderColor, 'none', 'color', 'row', 'bottom'),
    }
    const bordersThickness = {
        left: getPropValBegin(borders, defaultBorderThickness, cell, 'unset', 'thickness', 'left'),
        right: getPropValEnd(borders, state, location, cell, defaultBorderThickness, 'unset', 'thickness', 'column', 'right'),
        top: getPropValBegin(borders, defaultBorderThickness, cell, 'unset', 'thickness', 'top'),
        bottom: getPropValEnd(borders, state, location, cell, defaultBorderThickness, 'unset', 'thickness', 'row', 'bottom'),

    }
    const bordersStyle = {
        left: getPropValBegin(borders, defaultBorderStyle, cell, 'unset', 'style', 'left'),
        right: getPropValEnd(borders, state, location, cell, defaultBorderStyle, 'unset', 'style', 'column', 'right'),
        top: getPropValBegin(borders, defaultBorderStyle,  cell, 'unset', 'style', 'top'),
        bottom: getPropValEnd(borders, state, location, cell, defaultBorderStyle, 'unset', 'style', 'row', 'bottom'),
    }
    const bordersProps = {
        borderLeft: `${bordersThickness.left} ${bordersStyle.left} ${bordersColors.left}`,
        borderRight: `${bordersThickness.right} ${bordersStyle.right} ${bordersColors.right}`,
        borderTop: `${bordersThickness.top} ${bordersStyle.top} ${bordersColors.top}`,
        borderBottom: `${bordersThickness.bottom} ${bordersStyle.bottom} ${bordersColors.bottom}`,
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
