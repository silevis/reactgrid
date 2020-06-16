import * as React from 'react';
import { GridRendererProps } from '../Model';
import { i18n } from '../Functions/i18n';

export const LegacyBrowserGridRenderer: React.FunctionComponent<GridRendererProps> = ({ state }) => {
    return (
        <>
            <h3>{i18n(state).legacyBrowserHeader}</h3>
            <p>{i18n(state).legacyBrowserParagraph}</p>
        </>
    );
}
