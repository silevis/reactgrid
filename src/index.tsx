import * as React from 'react'
import { createRoot } from 'react-dom/client';
import { ExtTestGrid } from './test/TestGrid';
import { ReactGrid } from './lib/Components/ReactGrid';
import './test/theming-test.scss';
import {
    config, enablePinnedToBodyConfig, disabledInitialFocusLocationConfig, enableAdditionalContentConfig,
    enableAdditionalContentWithFlexRowConfig, enableSymetric, enableTopLeftResponsiveSticky, enableTopLeftResponsiveStickyPinnedToBody,
    enableBottomRightResponsiveSticky, enableBottomRightResponsiveStickyPinnedToBody, enableSpannedCells, disableVirtualScrolling
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
    case '/enableResponsiveStickyTopLeft':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enableTopLeftResponsiveSticky}
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridProWithEnabledResponsiveStickyTopLeft';
        break;
    case '/enableResponsiveStickyBottomRight':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enableBottomRightResponsiveSticky}
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridWithEnabledResponsiveStickyBottomRight';
        break;
    case '/enableResponsiveStickyPinnedToBodyTopLeft':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enableTopLeftResponsiveStickyPinnedToBody}
            enableSticky
        />;
        ExtTestGrid.displayName = 'TestGridProWithResponsiveStickyPinnedToBody';
        break;
    case '/enableResponsiveStickyPinnedToBodyBottomRight':
        component = <ExtTestGrid
            component={ReactGrid}
            config={enableBottomRightResponsiveStickyPinnedToBody}
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
    case '/disableVirtualScrolling':
        component = <ExtTestGrid
            component={ReactGrid}
            config={disableVirtualScrolling}
            cellType={'header'}
        />;
        ExtTestGrid.displayName = 'DisabledVirtualScrolling';
        break;
    default:
        break;
}

const container = document.getElementById('root') as HTMLElement;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<React.StrictMode>{component}</React.StrictMode>);
