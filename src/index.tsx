import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { TestGrid } from './TestGrid';
import { ReactGrid } from './lib/Components/ReactGrid';
import { config } from './testEnvConfig';

const props = {
  component: ReactGrid,
  isPro: false,
  config
}
let component = <TestGrid {...props} />;
switch (window.location.pathname) {
  case '/enableSticky':
    component = <TestGrid {...props}
      enableSticky
    />;
    break;
  case '/enableColumnAndRowSelection':
    component = <TestGrid {...props}
      enableColumnAndRowSelection
    />;
    break;
  case '/enableColumnAndRowSelectionWithSticky':
    component = <TestGrid {...props}
      enableColumnAndRowSelection
      enableSticky
    />;
    break;
  default:
    break;
}

ReactDOM.render(
  component,
  document.getElementById('root') as HTMLElement
);