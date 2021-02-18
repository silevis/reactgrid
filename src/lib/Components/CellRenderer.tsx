import * as React from 'react';
import { areLocationsEqual } from '../Functions/areLocationsEqual';
import { noBorder } from '../Functions/excludeObjectProperties';
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { tryAppendChange } from '../Functions/tryAppendChange';
import { Borders, Location } from '../Model/InternalModel';
import { Range } from '../Model/Range'
import { BorderProps, Cell, Compatible } from '../Model/PublicModel';
import { State } from '../Model/State';
import { isMobileDevice } from '../Functions/isMobileDevice';

export interface CellRendererProps {
    state: State;
    location: Location;
    borders: Borders;
    range: Range;
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

export const CellRenderer: React.FC<CellRendererProps> = ({ state, location, range, children, borders }) => {
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

    const isMobile = isMobileDevice();
    const isFirstRowOrColumnWithSelection = (state.props?.enableRowSelection && location.row.idx === 0)
        || (state.props?.enableColumnSelection && location.column.idx === 0);
    const style = {
        ...(cellTemplate.getStyle && (cellTemplate.getStyle(cell, false) || {})),
        ...(cell.style && noBorder(cell.style)),
        left: location.column.left,
        top: location.row.top,
        width: range.width,
        height: range.height,
        ...(!(isFocused && state.currentlyEditedCell) && bordersProps),
        ...((isFocused || cell.type === 'header' || isFirstRowOrColumnWithSelection) && { touchAction: 'none' }) // prevent scrolling
    } as React.CSSProperties;

    const isInEditMode = isFocused && !!(state.currentlyEditedCell);

    const groupIdClassName = cell.groupId ? ` rg-groupId-${cell.groupId}` : '';
    const nonEditableClassName = cell.nonEditable ? ' rg-cell-nonEditable' : '';
    const cellClassNames = isInEditMode && isMobile ? ` rg-celleditor rg-${cell.type}-celleditor` : ` rg-${cell.type}-cell`;
    const classNames = `rg-cell${cellClassNames}${groupIdClassName}${nonEditableClassName} ${customClass}`;
    const cellToRender = isFocused && state.currentlyEditedCell && isMobile ? state.currentlyEditedCell : cell;

    const onCellChanged = (cell: Compatible<Cell>, commit: boolean) => {
        if (isInEditMode) {
            state.currentlyEditedCell = commit ? undefined : cell;
            if (commit) state.update(state => tryAppendChange(state, location, cell));
        } else {
            if (!commit) throw new Error('commit should be set to true in this case.');
            state.update(state => tryAppendChange(state, location, cell));
        }
    }
    return (
        <div className={classNames} style={style}
            data-cell-colidx={process.env.NODE_ENV === "development" ? location.column.idx : null}
            data-cell-rowidx={process.env.NODE_ENV === "development" ? location.row.idx : null}>
            {cellTemplate.render(cellToRender, isMobile ? isInEditMode : false, onCellChanged)}
            {children}
            {state.enableGroupIdRender && cell?.groupId !== undefined && !(isInEditMode && isMobile) &&
                <span className='rg-groupId'>
                    {cell.groupId}
                </span>
            }
        </div >
    );
};
