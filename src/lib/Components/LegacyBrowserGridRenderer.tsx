import * as React from 'react';
import { i18n } from '../Functions/i18n';
import { GridRendererProps } from '../Model/InternalModel';

export const LegacyBrowserGridRenderer: React.FunctionComponent<GridRendererProps> = ({ state }) => {
    return (
        <>
            <h3>{i18n(state).legacyBrowserHeader}</h3>
            <p>{i18n(state).legacyBrowserText}</p>
        </>
    );
}
