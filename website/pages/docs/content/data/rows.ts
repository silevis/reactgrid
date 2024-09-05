import { Row, DefaultCellTypes } from '@silevis/reactgrid';
import { FlagCell } from '../cell-templates/flagCell/FlagCellTemplate';
import { RateCell } from '../cell-templates/rateCell/RateCellTemplate';

export const rows = (reorderable: boolean): Row<DefaultCellTypes | FlagCell | RateCell>[] => [
  {
    rowId: 'header',
    height: 25,
    reorderable,
    cells: [
      { type: 'header', text: 'Company' },
      { type: 'header', text: 'Country' },
      { type: 'header', text: 'Creation date' },
      { type: 'header', text: 'Revenues ($ Mil.)' },
      { type: 'header', text: 'Rating' }
    ]
  },
  {
    rowId: '1',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Walmart' },
      { type: 'flag', text: 'US' },
      { type: 'date', date: new Date('1962-09-04') },
      { type: 'number', value: 514.405 },
      { type: 'rate', value: 2 }
    ]
  },
  {
    rowId: '2',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Sinopec Group' },
      { type: 'flag', text: 'CH' },
      { type: 'date', date: new Date('2000-06-25') },
      { type: 'number', value: 414.649 },
      { type: 'rate', value: 3.5 }
    ]
  },
  {
    rowId: '3',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Royal Dutch Shell' },
      { type: 'flag', text: 'NL' },
      { type: 'date', date: new Date('1907-04-19') },
      { type: 'number', value: 396.556 },
      { type: 'rate', value: 4.5 }
    ]
  },
  {
    rowId: '4',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'ExxonMobil' },
      { type: 'flag', text: 'US' },
      { type: 'date', date: new Date('1999-02-12') },
      { type: 'number', value: 343.427 },
      { type: 'rate', value: 3.5 }
    ]
  },
  {
    rowId: '5',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Saudi Aramco' },
      { type: 'flag', text: 'SA' },
      { type: 'date', date: new Date('1933-11-09') },
      { type: 'number', value: 355.905 },
      { type: 'rate', value: 5 }
    ]
  },
  {
    rowId: '6',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Volkswagen' },
      { type: 'flag', text: 'DE' },
      { type: 'date', date: new Date('1937-05-28') },
      { type: 'number', value: 278.342 },
      { type: 'rate', value: 5 }
    ]
  },
  {
    rowId: '7',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Toyota' },
      { type: 'flag', text: 'JP' },
      { type: 'date', date: new Date('1937-08-28') },
      { type: 'number', value: 192.724 },
      { type: 'rate', value: 3 }
    ]
  },

  {
    rowId: '8',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Visa' },
      { type: 'flag', text: 'US' },
      { type: 'date', date: new Date('1958-06-15') },
      { type: 'number', value: 351.913 },
      { type: 'rate', value: 4 }
    ]
  },
  {
    rowId: '9',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Taiwan Semiconductor' },
      { type: 'flag', text: 'CH' },
      { type: 'date', date: new Date('1987-11-17') },
      { type: 'number', value: 264.256 },
      { type: 'rate', value: 5 }
    ]
  },
  {
    rowId: '10',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Samsung Electronics' },
      { type: 'flag', text: 'KR' },
      { type: 'date', date: new Date('1969-01-13') },
      { type: 'number', value: 221.569 },
      { type: 'rate', value: 5 }
    ]
  },
  {
    rowId: '11',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Glencore' },
      { type: 'flag', text: 'CH' },
      { type: 'date', date: new Date('1974-07-17') },
      { type: 'number', value: 219.754 },
      { type: 'rate', value: 4 }
    ]
  },
  {
    rowId: '12',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Total' },
      { type: 'flag', text: 'FR' },
      { type: 'date', date: new Date('1924-03-28') },
      { type: 'number', value: 184.106 },
      { type: 'rate', value: 3 }
    ]
  },
  {
    rowId: '13',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Trafigura' },
      { type: 'flag', text: 'SP' },
      { type: 'date', date: new Date('1993-06-15') },
      { type: 'number', value: 180.744 },
      { type: 'rate', value: 3 }
    ]
  },
  {
    rowId: '14',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Daimler' },
      { type: 'flag', text: 'DE' },
      { type: 'date', date: new Date('1926-06-28') },
      { type: 'number', value: 197.515 },
      { type: 'rate', value: 4 }
    ]
  },
  {
    rowId: '15',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Exor' },
      { type: 'flag', text: 'IT' },
      { type: 'date', date: new Date('1927-07-27') },
      { type: 'number', value: 175.009 },
      { type: 'rate', value: 4 }
    ]
  },
  {
    rowId: '16',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'Chevron' },
      { type: 'flag', text: 'US' },
      { type: 'date', date: new Date('1879-09-10') },
      { type: 'number', value: 166.339 },
      { type: 'rate', value: 4 }
    ]
  },
  {
    rowId: '17',
    height: 25,
    reorderable,
    cells: [
      { type: 'text', text: 'BP' },
      { type: 'flag', text: 'GB' },
      { type: 'date', date: new Date('1909-04-14') },
      { type: 'number', value: 303.738 },
      { type: 'rate', value: 5 }
    ]
  },
];