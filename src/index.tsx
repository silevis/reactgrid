import * as React from 'react'
import { createRoot } from 'react-dom/client';
import { ExtGrid } from './grid/Grid';
import { ReactGrid } from './lib/Components/ReactGrid';
import './grid/theming-test.scss';
import {
    config, 
} from './grid/envConfig';

const headerDataNames = ["", "商品コード*", "商品名", "メーカー", "入数単位", "入数"]
const headerData = [
    {},
    {
      name: headerDataNames[0],
      type: "alphanumeric",
      notNull: true,
      maxLength: 16
    },
    {
      name: headerDataNames[1],
      type: "text",
      notNull: false,
      maxLength: 256,
      errorMessages: [
        "max lenghth is 256"
      ]
    },
    {
      name: headerDataNames[2],
      type: "dropdown",
      notNull: false,
      maxLength: 16,
      values: [
        {value: "makera", label: "makerA"},
        {value: "makerb", label: "makerB"}
      ]
    },
    {
      name: headerDataNames[3],
      type: "text",
      notNull: false,
      maxLength: 8,
      errorMessages: [
        "max lenghth is 8",
        "should be unit"
      ]
    },
    {
      name: headerDataNames[4],
      type: "number",
      notNull: false,
      maxLength: 256
    },
  ]
const component = <ExtGrid
    component={ReactGrid}
    config={config}
    headerDataNames={headerDataNames}
    headerData={headerData}
/>;

const container = document.getElementById('root') as HTMLElement;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(<React.StrictMode>{component}</React.StrictMode>);
