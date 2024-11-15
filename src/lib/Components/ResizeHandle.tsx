import * as React from 'react';

export const ResizeColumnHandle: React.FC = () => {
    return (
        <div className="rg-touch-column-resize-handle" data-cy="rg-touch-column-resize-handle">
            <div className="rg-resize-handle" data-cy="rg-resize-handle" />
        </div>
    );
};

export const ResizeRowHandle: React.FC = () => {
    return (
        <div className="rg-touch-row-resize-handle" data-cy="rg-touch-row-resize-handle">
            <div className="rg-resize-handle" data-cy="rg-resize-handle" />
        </div>
    );
};
