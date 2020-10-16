import * as React from 'react';
import { areLocationsEqual } from '../Functions/areLocationsEqual';
import { noBorder } from '../Functions/excludeObjectProperties';
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { tryAppendChange } from '../Functions/tryAppendChange';
import { Borders } from '../Model/InternalModel';
import { BorderProps, Cell, Compatible } from '../Model/PublicModel';
import { State } from '../Model/State';
import { Location } from '../Model/InternalModel';

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

const unset = 'unset';

function storeBorderAndCell(borders: Borders, cell: Compatible<Cell>) {
    return (property: keyof BorderProps, defaultProp: string) => {
        return (borderEdge: keyof Borders) => {
            if (borders[borderEdge]) {
                return cell.style?.border?.[borderEdge]?.[property] ? cell.style.border[borderEdge]?.[property] : defaultProp;
            } else if (cell.style?.border?.[borderEdge]?.[property]) {
                return cell.style.border[borderEdge]?.[property];
            } return unset;
        }
    }
}

function getBorderProperties(getPropertyOnBorderFn: (borderEdge: keyof Borders) => string | undefined) {
    return {
        left: getPropertyOnBorderFn('left'),
        right: getPropertyOnBorderFn('right'),
        top: getPropertyOnBorderFn('top'),
        bottom: getPropertyOnBorderFn('bottom'),
    }
}

export const CellRenderer: React.FC<CellRendererProps> = ({ state, location, children, borders }) => {
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocused = state.focusedLocation !== undefined && areLocationsEqual(state.focusedLocation, location);
    const customClass = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false)) ?? '';

    const storePropertyAndDefaultValue = storeBorderAndCell(borders, cell);
    const bordersColor = getBorderProperties(storePropertyAndDefaultValue('color', '#E8E8E8')),
        bordersWidth = getBorderProperties(storePropertyAndDefaultValue('width', '1px')),
        bordersStyle = getBorderProperties(storePropertyAndDefaultValue('style', 'solid'));
    const bordersProps = {
        borderLeft: bordersWidth.left === unset && bordersStyle.left === unset && bordersColor.left === unset ? unset
            : `${bordersWidth.left} ${bordersStyle.left} ${bordersColor.left}`,
        borderRight: bordersWidth.right === unset && bordersStyle.right === unset && bordersColor.right === unset ? unset
            : `${bordersWidth.right} ${bordersStyle.right} ${bordersColor.right}`,
        borderTop: bordersWidth.top === unset && bordersStyle.top === unset && bordersColor.top === unset ? unset
            : `${bordersWidth.top} ${bordersStyle.top} ${bordersColor.top}`,
        borderBottom: bordersWidth.bottom === unset && bordersStyle.bottom === unset && bordersColor.bottom === unset ? unset
            : `${bordersWidth.bottom} ${bordersStyle.bottom} ${bordersColor.bottom}`,
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
            style={style} data-cell-colidx={process.env.NODE_ENV === "development" ? location.column.idx : null}
            data-cell-rowidx={process.env.NODE_ENV === "development" ? location.row.idx : null} >
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
