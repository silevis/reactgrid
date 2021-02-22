import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { ExtTestGrid } from './test/TestGrid';
import { ReactGrid } from './lib/Components/ReactGrid';
// import './test/theming-test.scss';
import {
  config, enablePinnedToBodyConfig, disabledInitialFocusLocationConfig, enableAdditionalContentConfig,
  enableAdditionalContentWithFlexRowConfig, enableSymetric, enableResponsiveSticky, enableResponsiveStickyPinnedToBody,
  enableSpannedCells
} from './test/testEnvConfig';

let component = <ExtTestGrid
  component={ReactGrid}
  config={config}
/>;
ExtTestGrid.displayName = 'TestGrid';
switch (window.location.pathname) {
  case '/enableSticky':
    component = <ExtTestGrid
      component={ReactGrid}
      config={config}
      enableSticky
    />;
    ExtTestGrid.displayName = 'TestGridWithEnabledSticky';
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
    ExtTestGrid.displayName = 'TestGridWithHeaderRow';
    break;
  case '/enableFrozenFocus':
    component = <ExtTestGrid
      component={ReactGrid}
      config={config}
      enableFrozenFocus
    />;
    ExtTestGrid.displayName = 'TestGridWithEnabledFrozenFocus';
    break;
  case '/enablePinnedToBody':
    component = <ExtTestGrid
      component={ReactGrid}
      config={enablePinnedToBodyConfig}
    />;
    ExtTestGrid.displayName = 'TestGridWithEnabledPinnedToBody';
    break;
  case '/enableStickyPinnedToBody':
    component = <ExtTestGrid
      component={ReactGrid}
      config={enablePinnedToBodyConfig}
      enableSticky
    />;
    ExtTestGrid.displayName = 'TestGridWithEnabledStickyPinnedToBody';
    break;
  case '/enableAdditionalContent':
    component = <ExtTestGrid
      component={ReactGrid}
      config={window.location.search.includes('flexRow=true') ? enableAdditionalContentWithFlexRowConfig : enableAdditionalContentConfig}
    />;
    ExtTestGrid.displayName = 'TestGridWithEnabledAdditionalContent';
    break;
  case '/enableSymetric':
    component = <ExtTestGrid
      component={ReactGrid}
      config={enableSymetric}
      enableSticky
    />;
    ExtTestGrid.displayName = 'TestGridWithEnabledSymetric';
    break;
  case '/enableResponsiveSticky':
    component = <ExtTestGrid
      component={ReactGrid}
      config={enableResponsiveSticky}
      enableSticky
    />;
    ExtTestGrid.displayName = 'TestGridWithResponsiveSticky';
    break;
  case '/enableResponsiveStickyPinnedToBody':
    component = <ExtTestGrid
      component={ReactGrid}
      config={enableResponsiveStickyPinnedToBody}
      enableSticky
    />;
    ExtTestGrid.displayName = 'TestGridWithResponsiveStickyPinnedToBody';
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

ReactDOM.render(component, document.getElementById('root') as HTMLElement);
