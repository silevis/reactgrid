import * as React from 'react';
import { GridRendererProps } from '../Model';

export class LegacyBrowserGridRenderer extends React.Component<GridRendererProps> {

    render() {
        return (
            <>
                <h3>Please update to a modern browser.</h3>
                <p>Your current browser cannot run our content, please make sure you browser is fully updated or try a
                    different browser. We highly recommend using the most recent release of Google Chrome,
                    Microsoft Edge, Firefox, Safari, and Opera browser</p>
            </>
        );
    }

}