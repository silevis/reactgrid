import * as React from 'react';

export const ResizeColumnHandle: React.FC = () => {
    return (
        <div className="rg-touch-resize-handle" data-cy="rg-touch-resize-handle">
            <div className="rg-resize-handle" data-cy="rg-resize-handle" />
        </div>
    );
};

export const ResizeRowHandle: React.FC = () => {
    return (
        <div className="rg-touch-resize-handle-vertical" data-cy="rg-touch-resize-handle-vertical">
            <div className="rg-resize-handle" data-cy="rg-resize-handle" />
        </div>
    );
};
