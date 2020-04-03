import * as React from 'react'
import * as ReactDOM from 'react-dom';
import { TestGrid } from './TestGrid';
// DO NOT MOVE
// this index.tsx is required by react-scripts-ts

let component = <TestGrid />;
switch (window.location.pathname) {
  case '/enableSticky':
    component = <TestGrid
      enableSticky
    />;
    break;
  case '/enableColumnAndRowSelection':
    component = <TestGrid
      enableColumnAndRowSelection
    />;
    break;
  case '/enableColumnAndRowSelectionWithSticky':
    component = <TestGrid
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