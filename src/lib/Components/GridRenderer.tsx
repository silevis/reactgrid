import * as React from 'react';
import { GridRendererProps } from '../Model/InternalModel';
import { HiddenElement } from './HiddenElement';
import { ErrorBoundary } from './ErrorBoundary';

export const GridRenderer: React.FC<GridRendererProps> = ({ state, eventHandlers, children }) => {
    const { cellMatrix } = state;
    return (<ErrorBoundary>
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
        </div>
    </ErrorBoundary>)
}