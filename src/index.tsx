import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { ExtTestGrid as TestGrid } from './test/TestGrid';
import { ReactGrid } from './lib/Components/ReactGrid';
// import './theming-test.scss';
import { config } from './test/testEnvConfig';

const props = {
  component: ReactGrid,
  isPro: false,
  config
}
let component = <TestGrid {...props} />;
TestGrid.displayName = 'TestGrid';
switch (window.location.pathname) {
  case '/enableSticky':
    component = <TestGrid {...props}
      enableSticky
    />;
    TestGrid.displayName = 'TestGridWithEnabledSticky';
    break;
  default:
    break;
}

ReactDOM.render(component, document.getElementById('root') as HTMLElement);