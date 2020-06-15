import * as React from 'react';
import { GridRendererProps } from '../Model';
import { i18n } from '../Functions/i18n';

export const LegacyBrowserGridRenderer: React.FunctionComponent<GridRendererProps> = props => {
    return (
        <>
            <h3>{i18n(props.state).legacyBrowserHeader}</h3>
            <p>{i18n(props.state).legacyBrowserParagraph}</p>
        </>
    );
}
