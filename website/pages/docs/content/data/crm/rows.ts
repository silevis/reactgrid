import { Row, DefaultCellTypes } from '@silevis/reactgrid';
import { FlagCell } from '../../cell-templates/flagCell/FlagCellTemplate';
import { DropdownNumberCell } from '../../cell-templates/dropdownNumberCell/DropdownNumberCellTemplate';

export const rows = (reorderable: boolean, height: number = 25): Row<DefaultCellTypes | FlagCell | DropdownNumberCell>[] => [
  {
    rowId: 'header',
    height: height,
    reorderable,
    cells: [
      { type: 'header', text: 'Name' },
      { type: 'header', text: 'Surname' },
      { type: 'header', text: 'Sex' },
      { type: 'header', text: 'Email' },
      { type: 'header', text: 'Phone' },
      { type: 'header', text: 'City' },
      { type: 'header', text: 'Street' },
      { type: 'header', text: 'Registered' },
      { type: 'header', text: 'Country' },
      { type: 'header', text: 'Birth date' },
      { type: 'header', text: 'Position' },
      { type: 'header', text: 'Skills' },
      { type: 'header', text: 'Is active' },
    ]
  },
  {
    rowId: '1',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Jacob' },
      { type: 'text', text: 'Sandberg' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'j.sandberg@gmail.com' },
      { type: 'number', value: 7958372938 },
      { type: 'text', text: 'New York' },
      { type: 'text', text: 'Wellham Ave' },
      { type: 'date', date: new Date('2008-11-12') },
      { type: 'flag', text: 'usa' },
      { type: 'date', date: new Date('1962-09-04') },
      { type: 'text', text: 'Director' },
      { type: 'dropdownNumber', value: 20, isOpened: false },
      { type: 'checkbox', checked: true }
    ]
  },
  {
    rowId: '2',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Fred' },
      { type: 'text', text: 'Schulz' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'f.schulz@gmail.com' },
      { type: 'number', value: 7953748271 },
      { type: 'text', text: 'Ji\'an' },
      { type: 'text', text: 'Jizhou Qu' },
      { type: 'date', date: new Date('2012-01-12') },
      { type: 'flag', text: 'chn' },
      { type: 'date', date: new Date('1985-11-06') },
      { type: 'text', text: 'CEO' },
      { type: 'dropdownNumber', value: 50, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '3',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Robin' },
      { type: 'text', text: 'Lasgo' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'r.asgo@gmail.com' },
      { type: 'number', value: 574859602 },
      { type: 'text', text: 'Ust-Ilimsk' },
      { type: 'text', text: 'Myasorubka' },
      { type: 'date', date: new Date('2016-11-23') },
      { type: 'flag', text: 'rus' },
      { type: 'date', date: new Date('1985-12-28') },
      { type: 'text', text: 'QA' },
      { type: 'dropdownNumber', value: 100, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '4',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Elizabeth' },
      { type: 'text', text: 'Hudson' },
      { type: 'text', text: 'female' },
      { type: 'email', text: 'e.hudson@gmail.com' },
      { type: 'number', value: 574859602 },
      { type: 'text', text: 'Woods Landing-Jelm' },
      { type: 'text', text: 'Meadow Acres Rd' },
      { type: 'date', date: new Date('2011-12-03') },
      { type: 'flag', text: 'usa' },
      { type: 'date', date: new Date('1973-07-11') },
      { type: 'text', text: 'IT Support' },
      { type: 'dropdownNumber', value: 90, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '5',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Lee' },
      { type: 'text', text: 'Aaker ' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'l.aaker@gmail.com' },
      { type: 'number', value: 697038495 },
      { type: 'text', text: 'Houston' },
      { type: 'text', text: 'Marina St' },
      { type: 'date', date: new Date('2017-07-13') },
      { type: 'flag', text: 'usa' },
      { type: 'date', date: new Date('1943-09-25') },
      { type: 'text', text: 'CFO' },
      { type: 'dropdownNumber', value: 100, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '6',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Willie' },
      { type: 'text', text: 'Aames ' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'w.aames@gmail.com' },
      { type: 'number', value: 584729732 },
      { type: 'text', text: 'Choix' },
      { type: 'text', text: 'SIN 24' },
      { type: 'date', date: new Date('2017-07-13') },
      { type: 'flag', text: 'mex' },
      { type: 'date', date: new Date('1960-09-15') },
      { type: 'text', text: 'Marketing manager' },
      { type: 'dropdownNumber', value: 88, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '7',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Quinton' },
      { type: 'text', text: 'Aaron' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'q.aaron@gmail.com' },
      { type: 'number', value: 5748373274 },
      { type: 'text', text: 'Guatemala' },
      { type: 'text', text: 'Calle Oriente' },
      { type: 'date', date: new Date('2013-11-03') },
      { type: 'flag', text: 'gtm' },
      { type: 'date', date: new Date('1954-12-01') },
      { type: 'text', text: 'CFO' },
      { type: 'dropdownNumber', value: 100, isOpened: false },
      { type: 'checkbox', checked: true }
    ]
  },
  {
    rowId: '8',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Juan' },
      { type: 'text', text: 'Escobar' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'o.abtahi@gmail.com' },
      { type: 'number', value: 5478439347 },
      { type: 'text', text: 'Havana' },
      { type: 'text', text: 'Via Blanca' },
      { type: 'date', date: new Date('2014-03-20') },
      { type: 'flag', text: 'cub' },
      { type: 'date', date: new Date('1979-07-12') },
      { type: 'text', text: 'Vice President' },
      { type: 'dropdownNumber', value: 88, isOpened: false },
      { type: 'checkbox', checked: true }
    ]
  },
  {
    rowId: '9',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Jason' },
      { type: 'text', text: 'Adams' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'j.adams@gmail.com' },
      { type: 'number', value: 958437283 },
      { type: 'text', text: 'Buenos Aires' },
      { type: 'text', text: 'Dr. Ricardo Gutiérrez' },
      { type: 'date', date: new Date('2015-08-22') },
      { type: 'flag', text: 'arg' },
      { type: 'date', date: new Date('1964-02-07') },
      { type: 'text', text: 'Operations manager' },
      { type: 'dropdownNumber', value: 77, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '10',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Frank' },
      { type: 'text', text: 'Alesia' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'f.tyson@gmail.com' },
      { type: 'number', value: 654890374 },
      { type: 'text', text: 'Adelaide' },
      { type: 'text', text: 'Essex' },
      { type: 'date', date: new Date('2017-12-02') },
      { type: 'flag', text: 'aus' },
      { type: 'date', date: new Date('1944-01-04') },
      { type: 'text', text: 'Accountant' },
      { type: 'dropdownNumber', value: 35, isOpened: false },
      { type: 'checkbox', checked: true }
    ]
  },
  {
    rowId: '11',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Alan' },
      { type: 'text', text: 'Bennion' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'a.bennion@gmail.com' },
      { type: 'number', value: 2398584578 },
      { type: 'text', text: 'London' },
      { type: 'text', text: 'Agar St' },
      { type: 'date', date: new Date('2015-04-13') },
      { type: 'flag', text: 'gbr' },
      { type: 'date', date: new Date('1970-04-18') },
      { type: 'text', text: 'Actor' },
      { type: 'dropdownNumber', value: 70, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '12',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Joanne' },
      { type: 'text', text: 'Balasko' },
      { type: 'text', text: 'female' },
      { type: 'email', text: 'j.balasko@gmail.com' },
      { type: 'number', value: 5473895647 },
      { type: 'text', text: 'Paris' },
      { type: 'text', text: 'Elisses' },
      { type: 'date', date: new Date('2011-11-11') },
      { type: 'flag', text: 'FRA' },
      { type: 'date', date: new Date('1950-04-15') },
      { type: 'text', text: 'CPA' },
      { type: 'dropdownNumber', value: 20, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '13',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Daniel' },
      { type: 'text', text: 'Auteuil' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'd.auteuil@gmail.com' },
      { type: 'number', value: 2309548374 },
      { type: 'text', text: 'Montrreal' },
      { type: 'text', text: 'Boulevard Alexis-Nihon' },
      { type: 'date', date: new Date('2018-06-19') },
      { type: 'flag', text: 'can' },
      { type: 'date', date: new Date('1950-01-24') },
      { type: 'text', text: '--' },
      { type: 'dropdownNumber', value: 10, isOpened: false },
      { type: 'checkbox', checked: true }
    ]
  },
  {
    rowId: '14',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Suzanne' },
      { type: 'text', text: 'Bianchetti' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 's.bianchetti@gmail.com' },
      { type: 'number', value: 43878342 },
      { type: 'text', text: 'Mediolan' },
      { type: 'text', text: 'Via Francesco Melzi d\'Eril' },
      { type: 'date', date: new Date('2018-06-19') },
      { type: 'flag', text: 'ita' },
      { type: 'date', date: new Date('1957-02-24') },
      { type: 'text', text: 'COO' },
      { type: 'dropdownNumber', value: 50, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '15',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Mohhamad' },
      { type: 'text', text: 'Ibn Al-Azhar' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 'm.ibn-al-azhar@gmail.com' },
      { type: 'number', value: 5438904375 },
      { type: 'text', text: 'Cair' },
      { type: 'text', text: 'Abd El-Khalik Tharwat' },
      { type: 'date', date: new Date('2018-06-19') },
      { type: 'flag', text: 'egy' },
      { type: 'date', date: new Date('1925-08-27') },
      { type: 'text', text: '--' },
      { type: 'dropdownNumber', value: 20, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '16',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Laetitia' },
      { type: 'text', text: 'Casta' },
      { type: 'text', text: 'female' },
      { type: 'email', text: 'l.casta@gmail.com' },
      { type: 'number', value: 51187834 },
      { type: 'text', text: 'Paralia Katerinis' },
      { type: 'text', text: 'Παύλου Μελά' },
      { type: 'date', date: new Date('2018-06-19') },
      { type: 'flag', text: 'grc' },
      { type: 'date', date: new Date('1978-05-11') },
      { type: 'text', text: 'Manager' },
      { type: 'dropdownNumber', value: 70, isOpened: false },
      { type: 'checkbox', checked: false }
    ]
  },
  {
    rowId: '17',
    height: height,
    reorderable,
    cells: [
      { type: 'text', text: 'Serge' },
      { type: 'text', text: 'Gainsbourg' },
      { type: 'text', text: 'male' },
      { type: 'email', text: 's.gainsbourg@gmail.com' },
      { type: 'number', value: 99657346 },
      { type: 'text', text: 'Malmo' },
      { type: 'text', text: 'Södra Rosengård' },
      { type: 'date', date: new Date('2018-06-19') },
      { type: 'flag', text: 'swe' },
      { type: 'date', date: new Date('1968-04-02') },
      { type: 'text', text: 'President' },
      { type: 'dropdownNumber', value: 40, isOpened: false },
      { type: 'checkbox', checked: true }
    ]
  },
]