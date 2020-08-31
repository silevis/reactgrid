import * as React from 'react';
import { State, Borders, Location, Compatible, Cell } from '../Model';
import { tryAppendChange } from '../Functions';
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';

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

export const CellRenderer: React.FunctionComponent<CellRendererProps> = ({ state, location, children }) => {
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocused = state.focusedLocation !== undefined && (state.focusedLocation.column.idx === location.column.idx &&
        state.focusedLocation.row.idx === location.row.idx);
    const customClass = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false)) ?? '';

    // TODO custom style
    const style: React.CSSProperties = {
        ...(cellTemplate.getStyle && (cellTemplate.getStyle(cell, false) || {})),
        ...cell.style,
        left: location.column.left,
        top: location.row.top,
        width: location.column.width,
        height: location.row.height,
        ...((isFocused || cell.type === 'header') && { touchAction: 'none' }) // prevent scrolling
    };

    return (
        <div className={`rg-cell rg-${cell.type}-cell ${cell.groupId ? `rg-groupId-${cell.groupId}` : ''} ${customClass}`}
            style={style} data-cell-colidx={location.column.idx} data-cell-rowidx={location.row.idx} >
            {cellTemplate.render(cell, false, (cell, commit) => {
                if (!commit) throw new Error('commit should be set to true in this case.');
                state.update(state => tryAppendChange(state, location, cell));
            })}
            {cell?.groupId !== undefined && <span className='rg-groupId'>
                {cell.groupId}
            </span>}
            {children}
        </div >
    );
};
