import * as React from 'react';
import { GridRendererProps } from '../Model/InternalModel';
import { HiddenElement } from './HiddenElement';
import { ErrorBoundary } from './ErrorBoundary';
import { useReactGridState } from './StateProvider';

export const GridRenderer: React.FC<GridRendererProps> = ({ eventHandlers, children }) => {
    const { cellMatrix, props } = useReactGridState();
    return (<ErrorBoundary>
        <div
            className='reactgrid'
            style={{
                position: 'relative',
                width: props?.enableFullWidthHeader ? '100%' : cellMatrix.width,
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
                onBlur={eventHandlers.blurHandler}
                style={{
                    width: props?.enableFullWidthHeader ? '100%' : cellMatrix.width,
                    height: cellMatrix.height,
                }}
            >
                {children}
                <HiddenElement hiddenElementRefHandler={eventHandlers.hiddenElementRefHandler} />
            </div>
        </div>
    </ErrorBoundary>)
}