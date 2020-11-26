import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { ExtTestGrid } from './test/TestGrid';
import { ReactGrid } from './lib/Components/ReactGrid';
// import './test/theming-test.scss';
import { config } from './test/testEnvConfig';

const props = {
  component: ReactGrid,
  config
}
let component = <ExtTestGrid {...props} />;
ExtTestGrid.displayName = 'TestGrid';
switch (window.location.pathname) {
  case '/enableSticky':
    component = <ExtTestGrid
      {...props}
      enableSticky
    />;
    ExtTestGrid.displayName = 'TestGridWithEnabledSticky';
    break;
  case '/enableFrozenFocus':
    component = <ExtTestGrid
      {...props}
      enableFrozenFocus
    />;
    ExtTestGrid.displayName = 'TestGridWithEnabledFrozenFocus';
    break;
  default:
    break;
}

ReactDOM.render(component, document.getElementById('root') as HTMLElement);