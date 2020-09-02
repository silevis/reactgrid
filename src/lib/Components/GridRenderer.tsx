import * as React from 'react';
import { GridRendererProps } from '../Model';
import { HiddenElement } from './HiddenElement';

export const GridRenderer: React.FunctionComponent<GridRendererProps> = props => {
    const { state, eventHandlers, children } = props;
    const { cellMatrix } = state;
    return (
        <div
            className='reactgrid'
            data-cy="reactgrid"
            style={{
                position: 'relative',
                width: state.props?.enableFullWidthHeader ? '100%' : cellMatrix.width,
                height: cellMatrix.height
            }}
            ref={eventHandlers.reactgridRefHandler}
        >
            <div
                className='reactgrid-content'
                onKeyDown={eventHandlers.keyDownHandler}
                onKeyUp={eventHandlers.keyUpHandler}
                onPointerDown={eventHandlers.pointerDownHandler}
                onPasteCapture={eventHandlers.pasteCaptureHandler}
                onPaste={eventHandlers.pasteHandler}
                onCopy={eventHandlers.copyHandler}
                onCut={eventHandlers.cutHandler}
                data-cy='reactgrid-content'
                style={{
                    width: state.props?.enableFullWidthHeader ? '100%' : cellMatrix.width,
                    height: cellMatrix.height,
                }}
            >
                {children}
                <HiddenElement hiddenElementRefHandler={eventHandlers.hiddenElementRefHandler} state={state} />
            </div>
        </div>)
}