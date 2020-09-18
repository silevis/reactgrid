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
    const bordersColors = getBorderProperties(storePropertyAndDefaultValue('color', '#E8E8E8'));
    const bordersWidth = getBorderProperties(storePropertyAndDefaultValue('width', '1px'));
    const bordersStyle = getBorderProperties(storePropertyAndDefaultValue('style', 'solid'));
    let bordersProps = {
        borderLeft: `${bordersWidth.left} ${bordersStyle.left} ${bordersColors.left}`,
        borderRight: `${bordersWidth.right} ${bordersStyle.right} ${bordersColors.right}`,
        borderTop: `${bordersWidth.top} ${bordersStyle.top} ${bordersColors.top}`,
        borderBottom: `${bordersWidth.bottom} ${bordersStyle.bottom} ${bordersColors.bottom}`,
    };

    if (cell.text === '4 - 0') {
        bordersProps = {
            ...bordersProps,
            borderTop: '4px dotted blue'
        }
        console.log('4 - 0', borders, bordersProps);
    }
    // if (cell.text === '4 - 1') {
    //     bordersProps = {
    //         ...bordersProps,
    //         borderTop: '4px dotted green'
    //     }
    //     console.log('4 - 1', borders, bordersProps);
    // }

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
