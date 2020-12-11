import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { ExtTestGrid } from './test/TestGrid';
import { ReactGrid } from './lib/Components/ReactGrid';
// import './test/theming-test.scss';
import {
  config, enablePinnedToBodyConfig, disabledInitialFocusLocationConfig, enableAdditionalContentConfig,
  enableAdditionalContentWithFlexRowConfig, enableSymetric
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
  default:
    break;
}

ReactDOM.render(component, document.getElementById('root') as HTMLElement);
