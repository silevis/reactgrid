import * as React from 'react';
import { State, Location, Compatible, Cell } from '../Model';
import { tryAppendChange } from '../Functions';
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { noBorderColors } from '../Functions/excludeObjectProperties';

export interface CellRendererProps {
    state: State;
    location: Location;
}

export interface CellRendererChildProps<TState extends State = State> {
    location?: Location;
    cell?: Compatible<Cell>;
    state?: TState;
}

export const CellRenderer: React.FunctionComponent<CellRendererProps> = ({ state, location, children }) => {
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocused = state.focusedLocation !== undefined && (state.focusedLocation.column.idx === location.column.idx &&
        state.focusedLocation.row.idx === location.row.idx);
    const customClass = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false)) ?? '';
    const bordersColors = {
        borderColorLeft:  cell.style?.borderColors?.left ? cell.style.borderColors.left : state.cellMatrix.first.column.idx === location.column.idx ? '#999' : 'none',
        borderColorRight: cell.style?.borderColors?.right ? cell.style.borderColors.right: '#999',
        borderColorTop: cell.style?.borderColors?.top ? cell.style.borderColors.top: state.cellMatrix.first.row.idx === location.row.idx ? '#999' : 'none',
        borderColorBottom: cell.style?.borderColors?.bottom ? cell.style.borderColors.bottom: '#999',
    }
    const borders = { 
        borderLeft: '1px solid ' + bordersColors.borderColorLeft,
        borderRight: '1px solid ' + bordersColors.borderColorRight,
        borderTop: '1px solid ' + bordersColors.borderColorTop,
        borderBottom: '1px solid ' + bordersColors.borderColorBottom,
    }

    // TODO custom style
    const style: React.CSSProperties = {
        ...(cellTemplate.getStyle && (cellTemplate.getStyle(cell, false) || {})),
        ...(cell.style && noBorderColors(cell.style)),
        left: location.column.left,
        top: location.row.top,
        width: location.column.width,
        height: location.row.height,
        ...borders,
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
