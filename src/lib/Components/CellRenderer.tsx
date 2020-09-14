import * as React from 'react';
import { State, Location, Compatible, Cell, Borders, BorderProps } from '../Model';
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

const defaultValue = 'unset';

function storeBorderAndCell(borders: Borders, cell: Compatible<Cell>) {
    return (property: keyof BorderProps, defaultProp: string) => {
        return (borderEdge: keyof Borders) => {
            if (borders[borderEdge]) {
                return cell.style?.border?.[borderEdge]?.[property] ? cell.style.border[borderEdge]?.[property] : defaultProp;
            } else if (cell.style?.border?.[borderEdge]?.[property]) {
                return cell.style.border[borderEdge]?.[property];
            } return defaultValue;
        }
    }
}

export const CellRenderer: React.FC<CellRendererProps> = ({ state, location, children, borders }) => {
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocused = state.focusedLocation !== undefined && areLocationsEqual(state.focusedLocation, location);
    const customClass = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false)) ?? '';

    const getPropertyValue = storeBorderAndCell(borders, cell);
    const getColorOnBorder = getPropertyValue('color', '#E8E8E8');
    const getWidthOnBorder = getPropertyValue('width', '1px');
    const getStyleOnBorder = getPropertyValue('style', 'solid');
    const bordersColors = {
        left: getColorOnBorder('left'),
        right: getColorOnBorder('right'),
        top: getColorOnBorder('top'),
        bottom: getColorOnBorder('bottom'),
    };
    const bordersWidth = {
        left: getWidthOnBorder('left'),
        right: getWidthOnBorder('right'),
        top: getWidthOnBorder('top'),
        bottom: getWidthOnBorder('bottom'),
    };
    const bordersStyle = {
        left: getStyleOnBorder('left'),
        right: getStyleOnBorder('right'),
        top: getStyleOnBorder('top'),
        bottom: getStyleOnBorder('bottom'),
    };
    const bordersProps = {
        borderLeft: `${bordersWidth.left} ${bordersStyle.left} ${bordersColors.left}`,
        borderRight: `${bordersWidth.right} ${bordersStyle.right} ${bordersColors.right}`,
        borderTop: `${bordersWidth.top} ${bordersStyle.top} ${bordersColors.top}`,
        borderBottom: `${bordersWidth.bottom} ${bordersStyle.bottom} ${bordersColors.bottom}`,
    };
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
