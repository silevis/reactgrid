import { Row, } from '@silevis/reactgrid';

const height = 25;

export const headerRow: Row = {
  rowId: 'header',
  reorderable: false,
  height,
  cells: [
    { type: 'header', text: `Id` },
    { type: 'header', text: `Branch Name` },
    { type: 'header', text: `Commit hash` },
    { type: 'header', text: `Added` },
    { type: 'header', text: `Removed` },
    { type: 'header', text: `Author` },
    { type: 'header', text: `Date` },
  ]
};

export const rows = (reorderable: boolean): Row[] => [
  {
    rowId: 1,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '1', isExpanded: true, },
      { type: 'text', text: 'fix/some-feature' },
      { type: 'text', text: 'e989109363ec42610966f85fe9b065e6017058f7' },
      { type: 'number', value: 890 },
      { type: 'number', value: 120 },
      { type: 'text', text: 'John Doe' },
      { type: 'date', date: new Date('2019-01-12') },
    ]
  },
  {
    rowId: 2,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '2', isExpanded: true, parentId: 1 },
      { type: 'text', text: 'fix/some-feature' },
      { type: 'text', text: 'ey5seefv1o8soch1q50ztl30bzhubtb1xg6oklup' },
      { type: 'number', value: 310 },
      { type: 'number', value: 490 },
      { type: 'text', text: 'Mike Ewans' },
      { type: 'date', date: new Date('2018-02-12') },
    ]
  },
  {
    rowId: 3,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '3', isExpanded: false },
      { type: 'text', text: 'fix/my-sample' },
      { type: 'text', text: 'u61x66unzgl9xd5gre3bj7g8za8cb7ve4t7otz0e' },
      { type: 'number', value: 280 },
      { type: 'number', value: 120 },
      { type: 'text', text: 'Stephanie McGregor' },
      { type: 'date', date: new Date('2019-01-11') },
    ]
  },
  {
    rowId: 4,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '4', isExpanded: true, parentId: 3 },
      { type: 'text', text: 'fix/my-sample' },
      { type: 'text', text: 'v2dwm51y0k874x596axt4uz1if5qcv7etavg76va' },
      { type: 'number', value: 400 },
      { type: 'number', value: 350 },
      { type: 'text', text: 'John Steward' },
      { type: 'date', date: new Date('2019-01-11') },
    ]
  },
  {
    rowId: 5,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '5', isExpanded: true, parentId: 4 },
      { type: 'text', text: 'fix/my-sample' },
      { type: 'text', text: 'jqk6nn3wktt2nwituttafuvpv7hlzo2grelvs7vo' },
      { type: 'number', value: 150 },
      { type: 'number', value: 900 },
      { type: 'text', text: 'Natalie Doe' },
      { type: 'date', date: new Date('2019-01-11') },
    ]
  },
  {
    rowId: 6,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '6', isExpanded: true, parentId: 4 },
      { type: 'text', text: 'fix/my-sample' },
      { type: 'text', text: 'ppsqily4doxz27uw6tznvc3qfvfhc37500k59jw9' },
      { type: 'number', value: 400 },
      { type: 'number', value: 200 },
      { type: 'text', text: 'John Doe' },
      { type: 'date', date: new Date('2019-06-12') },
    ]
  },
  {
    rowId: 7,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '7', isExpanded: true, },
      { type: 'text', text: 'fix/other-feature' },
      { type: 'text', text: 'uc75daha01rnk3dfcghvkgav13igsb87b0w1jzft' },
      { type: 'number', value: 600 },
      { type: 'number', value: 500 },
      { type: 'text', text: 'Mark Johnson' },
      { type: 'date', date: new Date('2019-06-12') },
    ]
  },
  {
    rowId: 8,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '8', isExpanded: true, parentId: 7 },
      { type: 'text', text: 'fix/other-feature' },
      { type: 'text', text: 'bmwz5y30ypjgixzh3aic3vpjlnh1q1hrie2pv5mg' },
      { type: 'number', value: 800 },
      { type: 'number', value: 120 },
      { type: 'text', text: 'John Doe' },
      { type: 'date', date: new Date('2019-02-1') },
    ]
  },
  {
    rowId: 9,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '9', isExpanded: true, parentId: 7 },
      { type: 'text', text: 'fix/other-feature' },
      { type: 'text', text: 'rc3hmvkwh4to6iq8mo68ju9vyx2zcmqbgn73zrw9' },
      { type: 'number', value: 220 },
      { type: 'number', value: 110 },
      { type: 'text', text: 'Jane Doe' },
      { type: 'date', date: new Date('2019-03-06') },
    ]
  },
  {
    rowId: 10,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '10', isExpanded: true, parentId: 7 },
      { type: 'text', text: 'fix/other-feature' },
      { type: 'text', text: '1ooxkvmvwotxicvawyh0wb1ur8jtin12egyayee8' },
      { type: 'number', value: 190 },
      { type: 'number', value: 70 },
      { type: 'text', text: 'John Doe' },
      { type: 'date', date: new Date('2019-01-21') },
    ]
  },
  {
    rowId: 11,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '11', isExpanded: true },
      { type: 'text', text: 'update/some-feature' },
      { type: 'text', text: 'fvgiizz61ysmiv2gn9por6izio575u557jyxz4xs' },
      { type: 'number', value: 120 },
      { type: 'number', value: 70 },
      { type: 'text', text: 'John Doe' },
      { type: 'date', date: new Date('2019-01-21') },
    ]
  },
  {
    rowId: 12,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '12', isExpanded: true, parentId: 11 },
      { type: 'text', text: 'update/some-feature' },
      { type: 'text', text: 'rbicj7u5qxvkpqv2ti2bkthlw4yg1by4ht4c1wom' },
      { type: 'number', value: 400 },
      { type: 'number', value: 250 },
      { type: 'text', text: 'Tommy Venitti' },
      { type: 'date', date: new Date('2019-03-11') },
    ]
  },
  {
    rowId: 13,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '13', isExpanded: true, parentId: 11 },
      { type: 'text', text: 'update/some-feature' },
      { type: 'text', text: 'cunj4bkbl2gow91atjtfcwko1zmqp6813l8x626v' },
      { type: 'number', value: 15 },
      { type: 'number', value: 60 },
      { type: 'text', text: 'John Doe' },
      { type: 'date', date: new Date('2018-12-21') },
    ]
  },
  {
    rowId: 14,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '14', isExpanded: true, parentId: 13 },
      { type: 'text', text: 'update/some-feature' },
      { type: 'text', text: 'iwpnwef8mtzsjyu1srihdwispyrjxvb5197ey6cz' },
      { type: 'number', value: 800 },
      { type: 'number', value: 300 },
      { type: 'text', text: 'John Doe' },
      { type: 'date', date: new Date('2018-02-21') },
    ]
  },
  {
    rowId: 15,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '15', isExpanded: true, parentId: 13 },
      { type: 'text', text: 'update/some-feature' },
      { type: 'text', text: '6wawna3wf02eggw27v8kgyclhla2c82apmdemay4' },
      { type: 'number', value: 200 },
      { type: 'number', value: 40 },
      { type: 'text', text: 'Jane Doe' },
      { type: 'date', date: new Date('2019-01-22') },
    ]
  },
  {
    rowId: 16,
    height,
    reorderable,
    cells: [
      { type: 'chevron', text: '16', isExpanded: true, parentId: 13 },
      { type: 'text', text: 'update/some-feature' },
      { type: 'text', text: 'iwpnwef8mtzsjyu1srihdwispyrjxvb5197ey6cz' },
      { type: 'number', value: 100 },
      { type: 'number', value: 90 },
      { type: 'text', text: 'Jane Doe' },
      { type: 'date', date: new Date('2019-01-23') },
    ]
  },

]