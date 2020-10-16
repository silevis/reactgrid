import * as React from 'react';
import { isBrowserFirefox } from '../Functions/firefox';

interface PaneShadowProps {
    renderCondition: boolean;
    className: string;
    style: React.CSSProperties;
    zIndex?: number;
}

export const PaneShadow: React.FC<PaneShadowProps> = ({ renderCondition, className, style, zIndex, children }) => {
    if (renderCondition) {
        return (
            <div className={`shadow ${className}`} style={{
                ...style,
                ...(isBrowserFirefox() && { zIndex: zIndex }),
            }} >{children}</div>
        )
    }
    return null;
}