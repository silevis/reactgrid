import * as React from 'react';
import { areLocationsEqual } from '../Functions/areLocationsEqual';
import { noBorder } from '../Functions/excludeObjectProperties';
import { getCompatibleCellAndTemplate } from '../Functions/getCompatibleCellAndTemplate';
import { tryAppendChange } from '../Functions/tryAppendChange';
import { Borders, Location } from '../Model/InternalModel';
import { Range } from '../Model/Range';
import { BorderProps, Cell, Compatible } from '../Model/PublicModel';
import { State } from '../Model/State';
import { isMobileDevice } from '../Functions/isMobileDevice';
import { ResizeHandle } from './ResizeHandle';
import { handleCompositionEnd } from '../Functions/handleCompositionEnd';
import { validateCellContext } from '../Functions/validateCellContext';
import debounce from 'debounce';

export interface CellRendererProps {
    state: State;
    location: Location;
    borders: Borders;
    range: Range;
    update: State['update'];
    currentlyEditedCell: State['currentlyEditedCell'];
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
                return cell.style?.border?.[borderEdge]?.[property]
                    ? cell.style.border[borderEdge]?.[property]
                    : defaultProp;
            } else if (cell.style?.border?.[borderEdge]?.[property]) {
                return cell.style.border[borderEdge]?.[property];
            }
            return unset;
        };
    };
}

function getBorderProperties(getPropertyOnBorderFn: (borderEdge: keyof Borders) => string | undefined) {
    return {
        left: getPropertyOnBorderFn('left'),
        right: getPropertyOnBorderFn('right'),
        top: getPropertyOnBorderFn('top'),
        bottom: getPropertyOnBorderFn('bottom'),
    };
}

export const CellRenderer: React.FC<CellRendererProps> = ({
    state,
    location,
    range,
    borders,
    update,
    currentlyEditedCell,
}) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isValid, setIsValid] = React.useState(true)
    const { cell, cellTemplate } = getCompatibleCellAndTemplate(state, location);
    const isFocused = state.focusedLocation !== undefined && areLocationsEqual(state.focusedLocation, location);
    const customClass = (cellTemplate.getClassName && cellTemplate.getClassName(cell, false)) ?? '';

    const currentlyEditedCellRef = React.useRef(currentlyEditedCell);

    const storePropertyAndDefaultValue = storeBorderAndCell(borders, cell);
    const bordersWidth = getBorderProperties(storePropertyAndDefaultValue('width', '1px')),
        bordersStyle = getBorderProperties(storePropertyAndDefaultValue('style', 'solid')),
        bordersColor = getBorderProperties(storePropertyAndDefaultValue('color', '#e8e8e8'));

    const bordersProps = {
        borderLeftWidth: bordersWidth.left,
        borderLeftStyle: bordersStyle.left,
        borderLeftColor: bordersColor.left,
        borderRightWidth: bordersWidth.right,
        borderRightStyle: bordersStyle.right,
        borderRightColor: bordersColor.right,
        borderTopWidth: bordersWidth.top,
        borderTopStyle: bordersStyle.top,
        borderTopColor: bordersColor.top,
        borderBottomWidth: bordersWidth.bottom,
        borderBottomStyle: bordersStyle.bottom,
        borderBottomColor: bordersColor.bottom
    };

    const isMobile = isMobileDevice();
    const isFirstRowOrColumnWithSelection =
        (state.props?.enableRowSelection && location.row.idx === 0) ||
        (state.props?.enableColumnSelection && location.column.idx === 0);
    const style = {
        ...(cellTemplate.getStyle && (cellTemplate.getStyle(cell, false) || {})),
        ...(cell.style && noBorder(cell.style)),
        left: location.column.left,
        top: location.row.top,
        width: range.width,
        height: range.height,
        ...(!(isFocused && currentlyEditedCellRef.current) && bordersProps),
        ...((isFocused || cell.type === 'header' || isFirstRowOrColumnWithSelection) && { touchAction: 'none' }), // prevent scrolling
        borderColor: !isValid ? "red" : "",
        borderWidth: !isValid ? "1px" : "",
        borderTopStyle: !isValid ? "solid": "unset",
        borderLeftStyle: !isValid ? "solid": "unset",
    } as React.CSSProperties;

    const isInEditMode = isFocused && !!currentlyEditedCellRef.current;

    const groupIdClassName = cell.groupId ? ` rg-groupId-${cell.groupId}` : '';
    const nonEditableClassName = cell.nonEditable ? ' rg-cell-nonEditable' : '';
    const cellClassNames =
        isInEditMode && isMobile ? ` rg-celleditor rg-${cell.type}-celleditor` : ` rg-${cell.type}-cell`;
    const invalidClassName = !isValid ? `rg-invalid` : ``;
    const classNames = `rg-cell${cellClassNames}${groupIdClassName}${nonEditableClassName} ${customClass} ${invalidClassName}`;
    const cellToRender =
        isFocused && currentlyEditedCellRef.current && isMobile ? currentlyEditedCellRef.current : cell;

    const [isOpen, setIsOpen] = React.useState(false)
    const messageRef = React.useRef<any>(null)

    const onCellChanged = React.useCallback(
        (cell: Compatible<Cell>, commit: boolean) => {
            if (isInEditMode) {
                currentlyEditedCellRef.current = commit ? undefined : cell;
                if (commit) update((state) => tryAppendChange(state, location, cell));
            } else {
                if (!commit) throw new Error('commit should be set to true in this case.');
                update((state) => tryAppendChange(state, location, cell));
            }
        },
        [isInEditMode, location, update, currentlyEditedCellRef]
    );
    
    const handleMouseEnter = debounce(() =>{
        if(isOpen || isInEditMode) return
        setIsHovered(true)
        setIsOpen(true)
    }, 1000)

    const handleMouseLeave = React.useCallback(() => {
        setIsHovered(false)
        handleMouseEnter.clear()
        setIsOpen(false)
    },[handleMouseEnter])

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen]);

    React.useEffect(()=>{
        if (validateCellContext(cell.type, cell.maxLength, cell.restraintType, cell.text)){
            cell.isValid = true
            setIsValid(true)
        } else {
            cell.isValid = false
            setIsValid(false)
        }
    }, [isValid, cell])

    React.useEffect(()=>{
        if(isInEditMode){
            handleMouseLeave()
        }
    }, [isInEditMode, handleMouseLeave])

    return (
        <>
        <div
            className={classNames}
            style={style}
            {...(process.env.NODE_ENV === 'development' && {
                'data-cell-colidx': location.column.idx,
                'data-cell-rowidx': location.row.idx,
            })}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {cellTemplate.render(cellToRender, isMobile ? isInEditMode : false, onCellChanged)}
            {location.row.idx === 0 && location.column.resizable && <ResizeHandle />}
            {state.enableGroupIdRender && cell?.groupId !== undefined && !(isInEditMode && isMobile) && (
                <span className="rg-groupId">{cell.groupId}</span>
            )}
            
        </div>
        {isHovered && isOpen && cell.restraintMessages &&
        <div
            className='rg-restraint-container'
            ref={messageRef}
            style={{ 
                     top:`${location.row.top + range.height}px`,
                     left: location.column.left
                    }}
        >
            {cell.restraintMessages.map((message: string, index: number)=>(
                <React.Fragment key={message}>
                <span>
                   - {message}
                </span>
                {cell.restraintMessages && index < cell.restraintMessages.length - 1 &&
                <br />
                }
                </React.Fragment>
                
            ))}
        </div>
        }
        </>
        
    );
};
