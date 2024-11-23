import * as React from 'react';

interface HintColumnProps {
    linePosition: number;
    left: number;
    offset: number;
}

interface HintRowProps {
    linePosition: number;
    top: number;
    offset: number;
}

// TODO these component props should be calculated directly by behaviour (only integers) 
export const ResizeColumnHint: React.FC<HintColumnProps> = ({ left, linePosition, offset }) => {
    return (
        <>
            {linePosition !== -1 &&
                <div
                    className={`rg-column-resize-hint`}
                    style={{
                        left: linePosition - offset,
                    }}
                >
                    <span style={{ whiteSpace: 'nowrap' }}>Width: {Math.floor(linePosition - left - offset)}px</span>
                </div>
            }
        </>
    )
}

export const ResizeRowHint: React.FC<HintRowProps> = ({ top, linePosition, offset }) => {
    return (
        <>
            {linePosition !== -1 &&
                <div
                    className={`rg-row-resize-hint`}
                    style={{
                        top: linePosition - offset,
                    }}
                >
                    <span style={{ whiteSpace: 'nowrap' }}>Height: {Math.floor(linePosition - top - offset)}px</span>
                </div>
            }
        </>
    )
}
