import * as React from 'react';
import { GridRendererProps, Range } from '../Model';
import { CellEditor } from './CellEditor';
import { HiddenElement } from './HiddenElement';
import { isBrowserFirefox } from '../Functions';
import { Pane } from './Pane';


export const GridRenderer: React.FunctionComponent<GridRendererProps> = props => {
    const { state, eventHandlers } = props;
    const cellMatrix = state.cellMatrix;

    const renderTopSticky = cellMatrix.stickyTopRange.height > 0,
        renderMiddleRange = cellMatrix.scrollableRange.height > 0 && cellMatrix.scrollableRange.first.column &&
            cellMatrix.scrollableRange.first.row && cellMatrix.scrollableRange.last.row &&
            state.visibleRange && state.visibleRange.height > 0;

    const renderLeftSticky = cellMatrix.stickyLeftRange.width > 0,
        renderCenterRange = state.visibleRange && state.visibleRange.width > 0;

    const visibleScrollableRange = renderMiddleRange && cellMatrix.scrollableRange.slice(state.visibleRange, 'rows');

    return (
        <div
            className='reactgrid'
            data-cy="reactgrid"
            style={{
                position: 'relative',
                width: cellMatrix.width,
                height: cellMatrix.height
            }}
            ref={eventHandlers.reactgridRefHandler}
        >
            <div
                className="reactgrid-content"
                onKeyDown={eventHandlers.keyDownHandler}
                onKeyUp={eventHandlers.keyUpHandler}
                onPointerDown={eventHandlers.pointerDownHandler}
                onPasteCapture={eventHandlers.pasteCaptureHandler}
                onPaste={eventHandlers.pasteHandler}
                onCopy={eventHandlers.copyHandler}
                onCut={eventHandlers.cutHandler}
                data-cy="reactgrid-content"
                style={{
                    width: cellMatrix.width,
                    height: cellMatrix.height,
                }}
            >
                <Pane
                    state={state}
                    renderAsFrame={renderMiddleRange && renderCenterRange}
                    className={'rg-pane-center-middle'}
                    style={{
                        position: 'relative',
                        width: cellMatrix.scrollableRange.width,
                        height: cellMatrix.scrollableRange.height,
                        order: 3,
                    }}
                    range={() => (visibleScrollableRange as Range).slice(state.visibleRange, 'columns')}
                    borders={{ right: false, bottom: false }}
                />
                <Pane
                    state={state}
                    renderAsFrame={renderMiddleRange && renderLeftSticky}
                    className={'rg-pane-left'}
                    style={{
                        height: cellMatrix.scrollableRange.height,
                        width: cellMatrix.width - cellMatrix.scrollableRange.width,
                        order: 2,
                        ...(isBrowserFirefox() && { zIndex: 1 })
                    }}
                    range={() => cellMatrix.stickyLeftRange.slice((visibleScrollableRange as Range), 'rows')}
                    borders={{ bottom: true, right: true }}
                />
                <Pane
                    state={state}
                    renderAsFrame={renderTopSticky && renderCenterRange}
                    className={'rg-pane-top'}
                    style={{
                        width: cellMatrix.scrollableRange.width,
                        height: cellMatrix.stickyTopRange.height,
                        order: 1,
                        ...(isBrowserFirefox() && { zIndex: 1 })
                    }}
                    range={() => cellMatrix.stickyTopRange.slice(state.visibleRange, 'columns')}
                    borders={{ right: false, bottom: false }}
                />
                <Pane
                    state={state}
                    renderAsFrame={renderTopSticky && renderLeftSticky}
                    className={'rg-pane-top rg-pane-left'}
                    style={{
                        height: cellMatrix.stickyTopRange.height,
                        width: cellMatrix.width - cellMatrix.scrollableRange.width,
                        order: 0,
                        ...(isBrowserFirefox() && { zIndex: 2 })
                    }}
                    range={() => cellMatrix.stickyLeftRange.slice(cellMatrix.stickyTopRange, 'rows')}
                    borders={{ bottom: true, right: true }}
                />
                <HiddenElement hiddenElementRefHandler={eventHandlers.hiddenElementRefHandler} state={state} />
                {state.currentlyEditedCell && <CellEditor state={state} />}
            </div>
        </div>)
}