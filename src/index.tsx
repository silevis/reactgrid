import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { ExtTestGrid } from './test/TestGrid';
import { ReactGrid } from './lib/Components/ReactGrid';
// import './test/theming-test.scss';
import { config, enablePinnedToBodyConfig } from './test/testEnvConfig';

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
  case '/enableHeaderRow':
    component = <ExtTestGrid
      component={ReactGrid}
      config={config}
      firstRowType={'header'}
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
  default:
    break;
}

ReactDOM.render(component, document.getElementById('root') as HTMLElement);
