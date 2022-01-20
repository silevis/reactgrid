import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { ExtTestGrid } from './test/TestGrid';
import { ReactGrid } from './lib/Components/ReactGrid';
import './test/theming-test.scss';
import {
    config, enablePinnedToBodyConfig, disabledInitialFocusLocationConfig, enableAdditionalContentConfig,
    enableAdditionalContentWithFlexRowConfig, enableSymetric, enableResponsiveSticky, enableResponsiveStickyPinnedToBody,
    enableResponsiveStickyPro, enableResponsiveStickyPinnedToBodyPro, enableSpannedCells
} from './test/testEnvConfig';

let component = <ExtTestGrid
    component={ReactGrid}
    config={config}
/>;
ExtTestGrid.displayName = 'TestGridPro';
switch (window.location.pathname) {
    case '/enableColumnAndRowSelection':
        component = <ExtTestGrid
            component={ReactGrid}
            config={config}
            enableColumnAndRowSelection
        />;
        ExtTestGrid.displayName = 'TestGridProWithEnableColumnAndRowSelection';
        break;
    case '/enableColumnAndRowSelectionWithSticky':
        component = <ExtTestGrid
            component={ReactGrid}
            config={config}
            enableColumnAndRowSelection
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridProWithStickyAndEnableColumnAndRowSelection';
        break;
    case '/enableSticky':
        component = <ExtTestGrid
            component={ReactGrid}
            config={config}
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridProWithEnabledSticky';
        break;
    case '/enableHeaders':
        component = <ExtTestGrid
            component={ReactGrid}
            config={disabledInitialFocusLocationConfig}
            firstRowType={'header'}
            firstColType={'header'}
            cellType={'header'}
            enableColumnAndRowSelection
        />;
        ExtTestGrid.displayName = 'TestGridProWithHeaderRow';
        break;
    case '/enableFrozenFocus':
        component = <ExtTestGrid
            component={ReactGrid}
            config={config}
            enableFrozenFocus
        />;
        ExtTestGrid.displayName = 'TestGridProWithEnabledFrozenFocus';
        break;
    case '/enablePinnedToBody':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enablePinnedToBodyConfig}
        />;
        ExtTestGrid.displayName = 'TestGridProWithEnabledPinnedToBody';
        break;
    case '/enableStickyPinnedToBody':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enablePinnedToBodyConfig}
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridProWithEnabledStickyPinnedToBody';
        break;
    case '/enableAdditionalContent':
        component = <ExtTestGrid
            component={ReactGrid}
            config={window.location.search.includes('flexRow=true')
                ? enableAdditionalContentWithFlexRowConfig
                : enableAdditionalContentConfig}
        />;
        ExtTestGrid.displayName = 'TestGridProWithEnabledAdditionalContent';
        break;
    case '/enableSymetric':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enableSymetric}
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridProWithEnabledSymetric';
        break;
    case '/enableResponsiveSticky':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enableResponsiveSticky}
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridProWithEnabledResponsiveSticky';
        break;
    case '/enableResponsiveStickyPro':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enableResponsiveStickyPro}
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridProWithEnabledResponsiveSticky';
        break;
    case '/enableResponsiveStickyPinnedToBody':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enableResponsiveStickyPinnedToBody}
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridProWithResponsiveStickyPinnedToBody';
        break;
    case '/enableResponsiveStickyPinnedToBodyPro':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enableResponsiveStickyPinnedToBodyPro}
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridProWithResponsiveStickyPinnedToBody';
        break;
    case '/enableSpannedCells':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enableSpannedCells}
            cellType={'header'}
        />;
        ExtTestGrid.displayName = 'TestGridWithSpannedCells';
        break;
    default:
        break;
}

ReactDOM.render(
    component,
    document.getElementById('root') as HTMLElement
);
