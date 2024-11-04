import * as React from 'react';

export const ResizeHandle: React.FC = () => {
    return (<>
        <div className="rg-touch-resize-handle" data-cy="rg-touch-resize-handle">
            <div className="rg-resize-handle" data-cy="rg-resize-handle" />
        </div>
        <div className="rg-touch-resize-handle-vertical" data-cy="rg-touch-resize-handle-vertical">
            <div className="rg-resize-handle" data-cy="rg-resize-handle" />
        </div>
    </>
    );
};
