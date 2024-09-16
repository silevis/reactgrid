/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cell, Column, NonEditableCell, Row } from "../../lib/main";

export const styledRanges = [
  {
    range: { start: { rowIndex: 16, columnIndex: 5 }, end: { rowIndex: 20, columnIndex: 7 } },
    styles: { background: "red", color: "yellow" },
  },
];

export const testStyles = {
  gridWrapper: {
    fontSize: "16px",
    fontFamily: "Arial",
  },
};

const myNumberFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  currency: "USD",
});

export const generateCells = (
  employees: Employee[],
  updatePerson: (id, selector, p) => void,
  columnDefs: ColumnDef[]
): CellMatrixDef => {
  const cells: Cell[] = [];

  const rowsWithAssignedHeights = employees.map((person, i) => ({
    id: person._id,
    height: 40,
    position: person.position,
  }));

  const headerRow = [{ id: "header", position: 0, height: 40 }];

  const orderedRows: RowDef[] = [...headerRow, ...rowsWithAssignedHeights]
    .sort((a, b) => a.position - b.position)
    .map((row) => {
      const idx = rowsWithAssignedHeights.findIndex((r) => r.id === row.id);
      const adjustedIdx = idx === -1 ? 0 : idx + 1;

      if (adjustedIdx === 0) {
        return { rowIndex: adjustedIdx, height: row.height, reorderable: false };
      }

      return { rowIndex: adjustedIdx, height: row.height };
    });

  orderedRows.forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      columnDefs.forEach((col, colIndex) => {
        cells.push({
          rowIndex,
          colIndex,
          Template: NonEditableCell,
          props: {
            value: col.title,
            style: {
              backgroundColor: "#55bc71",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            },
          },
        });
      });
    } else {
      const personRowIndex = row.rowIndex - 1;

      const personCells = columnDefs.map((col) => {
        const ageCellProps = {
          onValueChanged: (newValue) => {
            updatePerson(employees[personRowIndex]._id, col.title, newValue);
          },
          value: employees[personRowIndex][col.title],
        };

        const balanceCellProps = {
          onValueChanged: (newValue) => {
            updatePerson(employees[personRowIndex]._id, col.title, newValue);
          },
          value: employees[personRowIndex][col.title],
          format: myNumberFormat,
        };

        const textCellProps = {
          text: employees[personRowIndex][col.title],
          onTextChanged: (newText: string) => {
            updatePerson(employees[personRowIndex]._id, col.title, newText);
          },
        };

        return {
          Template: col.cellTemplate,
          props:
            col.title === "balance"
              ? { ...balanceCellProps }
              : col.title === "age"
              ? { ...ageCellProps }
              : { ...textCellProps },
        };
      });

      columnDefs.forEach((_, colIndex) => {
        cells.push({
          rowIndex,
          colIndex,
          ...personCells[colIndex],
        });
      });
    }
  });

  // Rows that are actually used in the grid
  const displayRows = orderedRows.map((rowDef, index) => {
    if (index === 0) {
      return { rowIndex: index, height: rowDef.height, ...(rowDef.reorderable === false && { reorderable: false }) };
    }
    return { rowIndex: index, height: rowDef.height };
  });

  const columns = columnDefs.map((col, index) => ({
    colIndex: index,
    width: col.width,
  }));

  return { rows: displayRows, columns, cells };
};

interface CellMatrixDef {
  cells: Cell[];
  rows: Row[];
  columns: Column[];
}

export interface RowDef {
  rowIndex: number;
  height: number;
  reorderable?: boolean;
}

export interface ColumnDef {
  title: string;
  width: number;
  cellTemplate: React.ComponentType<any>;
}

export interface Employee {
  _id: string;
  balance: number;
  age: number;
  eyeColor: string;
  name: string;
  gender: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  registered: string;
  jobTitle: string;
  latitude: number;
  longitude: number;
  position: number;
}

export const employeesArr: Employee[] = [
  {
    _id: "66da250eabb087dce9e861cd",
    balance: 3421.16,
    age: 28,
    eyeColor: "brown",
    name: "Marla Harrison",
    gender: "female",
    company: "GLEAMINK",
    email: "marlaharrison@gleamink.com",
    phone: "+1 (869) 575-2268",
    address: "235 Jaffray Street, Kidder, New Mexico, 7621",
    about:
      "Excepteur in aliqua ex esse laborum officia dolore consequat duis ut. Mollit adipisicing minim ad voluptate ut. Nulla eu esse irure consequat occaecat occaecat elit commodo cupidatat.\r\n",
    registered: "2023-08-26T01:56:14 -02:00",
    jobTitle: "Consultant",
    latitude: -34.045056,
    longitude: 55.619581,
    position: 1,
  },
  {
    _id: "66da250e18739224e798c688",
    balance: 3662.54,
    age: 25,
    eyeColor: "brown",
    name: "Carrillo Tate",
    gender: "male",
    company: "EPLODE",
    email: "carrillotate@eplode.com",
    phone: "+1 (981) 541-2182",
    address: "892 Flatbush Avenue, Herald, Wyoming, 698",
    about:
      "Qui qui deserunt voluptate tempor labore velit laborum proident mollit dolore qui. Reprehenderit cupidatat ex nostrud commodo reprehenderit anim quis nulla elit dolor commodo. Ut sit adipisicing nisi ad incididunt esse.\r\n",
    registered: "2016-09-25T11:11:47 -02:00",
    jobTitle: "Developer",
    latitude: 11.512423,
    longitude: 11.690788,
    position: 2,
  },
  {
    _id: "66da250e018504c7c7d0730e",
    balance: 1849.94,
    age: 29,
    eyeColor: "green",
    name: "French Pope",
    gender: "male",
    company: "QUIZKA",
    email: "frenchpope@quizka.com",
    phone: "+1 (965) 566-3857",
    address: "926 Losee Terrace, Westerville, Oklahoma, 6997",
    about:
      "Ea ipsum nisi ex pariatur officia. Pariatur sit veniam culpa nulla esse consequat magna. Ut veniam nulla eiusmod elit in ipsum consequat eu ad. Labore ipsum sint laborum do mollit occaecat enim anim voluptate amet. Do duis irure ex elit cillum ea eu non et nulla ad esse incididunt id. Ut sint culpa cupidatat labore amet.\r\n",
    registered: "2019-07-18T07:39:12 -02:00",
    jobTitle: "Manager",
    latitude: -41.279247,
    longitude: 21.158582,
    position: 3,
  },
  {
    _id: "66da250ed21958595a827970",
    balance: 2975.62,
    age: 31,
    eyeColor: "blue",
    name: "Dickson Dillard",
    gender: "male",
    company: "UNDERTAP",
    email: "dicksondillard@undertap.com",
    phone: "+1 (856) 550-2061",
    address: "746 Vandalia Avenue, Bentley, Montana, 9912",
    about:
      "Nulla veniam eiusmod est pariatur elit minim nulla do eiusmod. In occaecat minim irure amet id id veniam dolor nostrud exercitation. Dolor incididunt ut magna reprehenderit non ea quis et mollit amet adipisicing. Magna culpa consectetur sit qui. Excepteur ipsum cupidatat irure commodo.\r\n",
    registered: "2023-03-03T09:59:06 -01:00",
    jobTitle: "Analyst",
    latitude: 0.237355,
    longitude: -109.988574,
    position: 4,
  },
  {
    _id: "66da250e28fadc10013e4faf",
    balance: 1145.17,
    age: 27,
    eyeColor: "blue",
    name: "Fields Burgess",
    gender: "male",
    company: "BESTO",
    email: "fieldsburgess@besto.com",
    phone: "+1 (928) 499-2053",
    address: "726 Pine Street, Oley, Delaware, 1399",
    about:
      "Occaecat ad culpa sunt duis culpa dolor ipsum Lorem ullamco est culpa magna eu. Eu non ipsum eu in cillum ea anim irure occaecat Lorem. Non eu laboris anim do eiusmod qui velit irure id et. Ad laboris et quis voluptate quis anim qui minim. Incididunt irure amet consectetur eu aute ipsum dolore dolore eiusmod. Elit do voluptate qui irure tempor cillum Lorem nostrud laboris.\r\n",
    registered: "2020-02-01T12:00:27 -01:00",
    jobTitle: "Consultant",
    latitude: -54.680972,
    longitude: 20.912822,
    position: 5,
  },
  {
    _id: "66da250e36b233967054d2fa",
    balance: 1174.0,
    age: 21,
    eyeColor: "green",
    name: "Kerri Mckinney",
    gender: "female",
    company: "ISOSPHERE",
    email: "kerrimckinney@isosphere.com",
    phone: "+1 (843) 481-3366",
    address: "114 Crooke Avenue, Olney, Connecticut, 3182",
    about:
      "Voluptate amet magna ea et proident eu et sint velit reprehenderit consectetur commodo. Culpa ullamco do id proident cupidatat consectetur mollit deserunt veniam irure. Quis ullamco pariatur proident culpa culpa. Quis proident eiusmod ex magna deserunt officia ex qui enim culpa aliquip in duis.\r\n",
    registered: "2016-04-04T06:25:01 -02:00",
    jobTitle: "Designer",
    latitude: 77.585763,
    longitude: -71.326252,
    position: 6,
  },
  {
    _id: "66da250e74da564bc2a89229",
    balance: 2057.99,
    age: 20,
    eyeColor: "green",
    name: "Adele Foster",
    gender: "female",
    company: "INJOY",
    email: "adelefoster@injoy.com",
    phone: "+1 (832) 516-3719",
    address: "441 Sumner Place, Bowmansville, North Carolina, 6970",
    about:
      "Est excepteur proident in consequat nulla qui cillum aliqua incididunt veniam minim et commodo est. Id et anim voluptate occaecat nulla excepteur eiusmod occaecat sunt culpa. Sit tempor est reprehenderit consectetur deserunt voluptate adipisicing id consectetur fugiat commodo. Esse nostrud enim ad ea. Consectetur voluptate enim nisi excepteur aliquip cupidatat cillum. Anim ea incididunt excepteur occaecat irure laborum ullamco nulla irure. Veniam id in eu mollit irure in duis mollit nisi nostrud cillum.\r\n",
    registered: "2015-07-15T10:18:25 -02:00",
    jobTitle: "Consultant",
    latitude: -69.342751,
    longitude: -122.209488,
    position: 7,
  },
  {
    _id: "66da250ec18faf5e9de48a5a",
    balance: 1324.62,
    age: 35,
    eyeColor: "brown",
    name: "Young Crawford",
    gender: "female",
    company: "ZILLACON",
    email: "youngcrawford@zillacon.com",
    phone: "+1 (949) 572-3420",
    address: "260 Wallabout Street, Epworth, Marshall Islands, 8420",
    about:
      "Laboris cillum occaecat proident deserunt pariatur pariatur ullamco sint sint laboris anim. Id occaecat excepteur non qui duis aliqua incididunt elit et nisi. Dolor aliqua tempor incididunt deserunt fugiat est velit eiusmod ut cupidatat veniam exercitation velit dolor. Cupidatat nisi veniam qui culpa. Dolor ex sit qui occaecat enim. Commodo nulla labore duis culpa minim sit do duis qui sunt est. Dolor cupidatat pariatur nostrud mollit consequat.\r\n",
    registered: "2022-08-14T06:48:46 -02:00",
    jobTitle: "Developer",
    latitude: 0.00756,
    longitude: -24.90914,
    position: 8,
  },
  {
    _id: "66da250ef44a1ba8b2a88f97",
    balance: 3743.62,
    age: 32,
    eyeColor: "brown",
    name: "Daphne Black",
    gender: "female",
    company: "CEMENTION",
    email: "daphneblack@cemention.com",
    phone: "+1 (857) 459-2386",
    address: "159 Centre Street, Rockhill, Nevada, 7790",
    about:
      "Reprehenderit dolor consequat elit sint adipisicing. Proident ea nulla Lorem minim culpa sunt reprehenderit anim tempor velit officia. Aute occaecat qui exercitation dolor aliqua elit consequat commodo ea ullamco. Do ipsum dolor fugiat occaecat. Sunt ad nostrud velit reprehenderit ad qui aliqua veniam reprehenderit irure nisi. Nostrud anim exercitation incididunt enim quis ut sunt adipisicing eiusmod adipisicing enim veniam. Do sit culpa dolore proident elit dolor sunt excepteur pariatur commodo dolor.\r\n",
    registered: "2017-06-12T08:22:11 -02:00",
    jobTitle: "Manager",
    latitude: -66.717116,
    longitude: 35.091482,
    position: 9,
  },
  {
    _id: "66da250efce2ad5222b77e0d",
    balance: 2623.22,
    age: 37,
    eyeColor: "green",
    name: "Summers Kent",
    gender: "male",
    company: "AMRIL",
    email: "summerskent@amril.com",
    phone: "+1 (988) 402-3972",
    address: "956 Montana Place, Snyderville, Massachusetts, 2648",
    about:
      "Qui cillum sunt voluptate nulla adipisicing aliquip. Ea sunt eiusmod laboris reprehenderit nisi ipsum elit voluptate. Enim quis qui anim quis Lorem ea labore consequat elit ex quis nulla. Velit exercitation pariatur nulla non.\r\n",
    registered: "2019-04-18T12:20:04 -02:00",
    jobTitle: "Developer",
    latitude: 54.116028,
    longitude: -151.807716,
    position: 10,
  },
  {
    _id: "66da250ee11a7be44d7b300d",
    balance: 3443.45,
    age: 37,
    eyeColor: "brown",
    name: "Lilia Bailey",
    gender: "female",
    company: "PYRAMI",
    email: "liliabailey@pyrami.com",
    phone: "+1 (913) 433-2508",
    address: "229 Oak Street, Barclay, Kentucky, 6411",
    about:
      "Cupidatat velit voluptate nulla ad sunt ipsum sint in tempor proident dolor. Reprehenderit laboris consectetur amet quis sunt nisi dolor irure. Esse fugiat exercitation nulla consequat quis reprehenderit enim sunt. Do non esse labore tempor officia incididunt. Voluptate et ad tempor reprehenderit qui aliquip tempor dolor dolor eu.\r\n",
    registered: "2014-08-09T06:54:20 -02:00",
    jobTitle: "Designer",
    latitude: -52.874379,
    longitude: -161.478409,
    position: 11,
  },
  {
    _id: "66da250e0ac8921c1607eb13",
    balance: 1672.67,
    age: 21,
    eyeColor: "brown",
    name: "Nelda Hernandez",
    gender: "female",
    company: "GALLAXIA",
    email: "neldahernandez@gallaxia.com",
    phone: "+1 (800) 435-3076",
    address: "201 Bayview Place, Delwood, Utah, 9959",
    about:
      "Officia non ex tempor irure in do nisi duis aliqua tempor magna velit occaecat quis. Culpa laboris nisi cupidatat ipsum ut nisi ex. Velit velit cupidatat ullamco deserunt ipsum in. Cillum officia sint non deserunt qui adipisicing elit duis aliqua. Qui ea sunt aliquip ipsum et nulla labore commodo enim ad elit. Sint officia nulla ex et aliquip non cillum veniam non officia laboris.\r\n",
    registered: "2024-02-16T04:04:35 -01:00",
    jobTitle: "Analyst",
    latitude: 24.127192,
    longitude: -21.925787,
    position: 12,
  },
  {
    _id: "66da250e543c1bedd94a1a7a",
    balance: 1610.78,
    age: 29,
    eyeColor: "brown",
    name: "Sonja Mcclain",
    gender: "female",
    company: "GAZAK",
    email: "sonjamcclain@gazak.com",
    phone: "+1 (928) 599-2378",
    address: "400 Pooles Lane, Fedora, Maryland, 7248",
    about:
      "Nulla nisi culpa cillum culpa exercitation nulla deserunt esse deserunt pariatur pariatur minim ullamco. Quis magna cillum ea enim anim dolore duis elit adipisicing esse incididunt veniam sunt deserunt. Mollit occaecat anim sit sint cillum eiusmod voluptate esse officia nostrud aliquip.\r\n",
    registered: "2020-05-05T03:16:34 -02:00",
    jobTitle: "Consultant",
    latitude: -58.78795,
    longitude: -48.974701,
    position: 13,
  },
  {
    _id: "66da250e9fe8e5402db3fa03",
    balance: 3820.77,
    age: 27,
    eyeColor: "blue",
    name: "Janet Kim",
    gender: "female",
    company: "PHOLIO",
    email: "janetkim@pholio.com",
    phone: "+1 (816) 497-3291",
    address: "265 Karweg Place, Chilton, Idaho, 3965",
    about:
      "Ea et laborum dolore et qui. Qui do dolore duis id sunt ipsum occaecat ea et commodo nulla magna sint. Lorem enim ut voluptate deserunt ipsum labore deserunt nostrud in nisi officia fugiat dolore pariatur. Elit tempor ea aliquip velit labore occaecat et. Irure fugiat nulla sunt nisi commodo pariatur aliquip. Non qui reprehenderit irure anim aliqua. Duis dolor excepteur magna voluptate aliqua elit laboris laboris Lorem aliquip id deserunt Lorem.\r\n",
    registered: "2018-05-28T09:08:19 -02:00",
    jobTitle: "Developer",
    latitude: 33.972836,
    longitude: 113.582895,
    position: 14,
  },
  {
    _id: "66da250ebb3685e4859c7a20",
    balance: 1616.46,
    age: 38,
    eyeColor: "brown",
    name: "Tyson Hart",
    gender: "male",
    company: "AVENETRO",
    email: "tysonhart@avenetro.com",
    phone: "+1 (935) 447-2970",
    address: "262 Hull Street, Grahamtown, New Hampshire, 797",
    about:
      "Ipsum culpa et in velit irure labore. Cillum est aliqua deserunt ullamco incididunt sunt anim mollit Lorem laboris pariatur incididunt est. Fugiat eiusmod labore voluptate reprehenderit. Est ad laboris quis mollit sit laborum aliqua deserunt occaecat non. Dolor sint ex ullamco culpa occaecat nulla non dolore incididunt occaecat duis. Ea excepteur magna nisi enim esse incididunt sit. Mollit sint nulla cillum mollit ea eu.\r\n",
    registered: "2021-04-03T07:30:48 -02:00",
    jobTitle: "Manager",
    latitude: -46.831499,
    longitude: -93.884079,
    position: 15,
  },
  {
    _id: "66da250ec335e7fa1236cbd7",
    balance: 3761.54,
    age: 28,
    eyeColor: "brown",
    name: "Nelson Mckay",
    gender: "male",
    company: "QUADEEBO",
    email: "nelsonmckay@quadeebo.com",
    phone: "+1 (868) 562-2963",
    address: "421 Kenmore Court, Harold, South Carolina, 8652",
    about:
      "Culpa deserunt pariatur sint adipisicing veniam. Lorem eiusmod aute mollit do. In eu velit ipsum excepteur sit aliqua duis nulla.\r\n",
    registered: "2015-08-24T12:26:34 -02:00",
    jobTitle: "Developer",
    latitude: 89.601119,
    longitude: 172.975192,
    position: 16,
  },
  {
    _id: "66da250ef157a1cd31db0841",
    balance: 2230.6,
    age: 37,
    eyeColor: "blue",
    name: "Sheri Meadows",
    gender: "female",
    company: "LIQUIDOC",
    email: "sherimeadows@liquidoc.com",
    phone: "+1 (887) 558-3452",
    address: "171 Virginia Place, Gorst, New York, 4798",
    about:
      "Id id aute dolore Lorem ea enim. Adipisicing consequat elit dolor sint nisi aliqua dolor magna veniam labore est. Officia dolor aliqua mollit in laborum nisi. Duis voluptate excepteur cupidatat ipsum. Duis adipisicing excepteur ex non mollit ut aliqua aute amet cillum labore.\r\n",
    registered: "2019-11-29T11:15:28 -01:00",
    jobTitle: "Consultant",
    latitude: -7.332961,
    longitude: 28.819386,
    position: 17,
  },
  {
    _id: "66da250e920163c59510cc8d",
    balance: 1204.52,
    age: 30,
    eyeColor: "green",
    name: "Karin Goff",
    gender: "female",
    company: "CANOPOLY",
    email: "karingoff@canopoly.com",
    phone: "+1 (932) 452-3411",
    address: "461 Cox Place, Gracey, Florida, 7742",
    about:
      "Nisi adipisicing do aliquip do voluptate in eiusmod. Amet eiusmod amet laborum est ea amet occaecat. Cupidatat ut nulla in in adipisicing amet enim nisi aliquip officia ut ullamco id. Commodo amet excepteur ea pariatur minim et. Exercitation nisi voluptate aute officia veniam. Sit culpa ex deserunt ut.\r\n",
    registered: "2020-07-16T12:59:25 -02:00",
    jobTitle: "Designer",
    latitude: 36.811411,
    longitude: 105.384089,
    position: 18,
  },
  {
    _id: "66da250eb01d1346270ce7fa",
    balance: 3140.93,
    age: 24,
    eyeColor: "blue",
    name: "Peterson Joyce",
    gender: "male",
    company: "MULTRON",
    email: "petersonjoyce@multron.com",
    phone: "+1 (897) 598-2665",
    address: "664 Revere Place, Bynum, New Jersey, 2257",
    about:
      "In occaecat veniam mollit eu pariatur mollit. Velit officia laboris sunt magna. Voluptate fugiat et ipsum id cupidatat elit officia excepteur ea est in laborum adipisicing dolor.\r\n",
    registered: "2022-06-28T11:30:13 -02:00",
    jobTitle: "Developer",
    latitude: 78.251002,
    longitude: 14.07384,
    position: 19,
  },
  {
    _id: "66da250e32cbef0719e9cd8f",
    balance: 1631.8,
    age: 37,
    eyeColor: "brown",
    name: "Elena Randolph",
    gender: "female",
    company: "ZIDANT",
    email: "elenarandolph@zidant.com",
    phone: "+1 (947) 505-3133",
    address: "589 Arkansas Drive, Whitehaven, North Dakota, 9922",
    about:
      "Mollit officia quis consectetur excepteur duis. Labore ipsum minim culpa magna laborum enim dolore Lorem exercitation culpa minim eu reprehenderit ut. Tempor esse sint laboris qui enim.\r\n",
    registered: "2018-10-27T11:56:42 -02:00",
    jobTitle: "Consultant",
    latitude: -0.01168,
    longitude: -126.808239,
    position: 20,
  },
  {
    _id: "66da250e99abfde0a708ad72",
    balance: 1839.21,
    age: 20,
    eyeColor: "brown",
    name: "Frances Bonner",
    gender: "female",
    company: "BILLMED",
    email: "francesbonner@billmed.com",
    phone: "+1 (876) 515-3932",
    address: "166 Adams Street, Camptown, American Samoa, 5145",
    about:
      "Fugiat nisi aliquip deserunt enim pariatur aliquip. Consectetur qui eu nostrud reprehenderit ea Lorem exercitation ad. Ea ad sint anim dolore eu sint nulla eiusmod esse cupidatat. Consequat laboris tempor consequat et anim sint ullamco.\r\n",
    registered: "2016-06-21T06:09:19 -02:00",
    jobTitle: "Consultant",
    latitude: -47.486436,
    longitude: -39.033227,
    position: 21,
  },
  {
    _id: "66da250e28a5aad7b5a5eef5",
    balance: 2504.84,
    age: 33,
    eyeColor: "blue",
    name: "Petersen Jefferson",
    gender: "male",
    company: "EXOVENT",
    email: "petersenjefferson@exovent.com",
    phone: "+1 (808) 508-2569",
    address: "504 Hawthorne Street, Glidden, Mississippi, 6236",
    about:
      "Est enim esse officia deserunt. Enim aute consequat consequat dolore officia minim adipisicing occaecat eu cillum amet. Mollit anim excepteur minim irure ex reprehenderit reprehenderit culpa. Ex ipsum aute enim ullamco quis veniam officia laboris aliqua id dolor elit velit. Minim dolor exercitation deserunt quis eu.\r\n",
    registered: "2018-10-19T11:06:31 -02:00",
    jobTitle: "Manager",
    latitude: 40.878232,
    longitude: -39.972612,
    position: 22,
  },
  {
    _id: "66da250ef441dd4a0e9bfa95",
    balance: 2167.76,
    age: 32,
    eyeColor: "blue",
    name: "Callahan Mckenzie",
    gender: "male",
    company: "COMVERGES",
    email: "callahanmckenzie@comverges.com",
    phone: "+1 (817) 479-2952",
    address: "169 Roebling Street, Keller, Colorado, 8236",
    about:
      "Velit tempor nisi eu duis qui duis. Duis fugiat sit consequat incididunt eiusmod. Labore in excepteur non voluptate nulla ullamco officia dolore.\r\n",
    registered: "2022-12-31T08:02:35 -01:00",
    jobTitle: "Designer",
    latitude: 73.323966,
    longitude: -120.401079,
    position: 23,
  },
  {
    _id: "66da250e43bd152b55f6fa70",
    balance: 1537.89,
    age: 32,
    eyeColor: "brown",
    name: "Cabrera Byers",
    gender: "male",
    company: "REMOLD",
    email: "cabrerabyers@remold.com",
    phone: "+1 (905) 480-2611",
    address: "588 Putnam Avenue, Chamizal, Alaska, 7790",
    about:
      "Cupidatat nulla consequat voluptate sit est id pariatur cupidatat magna. Sunt minim adipisicing anim sint sint est non cupidatat veniam dolor in irure ut laboris. Dolore enim aute proident sunt eiusmod. Lorem duis quis dolor ad minim. Dolor voluptate fugiat dolor irure culpa non est duis cupidatat veniam nostrud laboris. Deserunt magna adipisicing anim laborum. Ut exercitation fugiat sunt eiusmod incididunt nostrud exercitation et.\r\n",
    registered: "2016-10-11T08:52:09 -02:00",
    jobTitle: "Designer",
    latitude: -51.376404,
    longitude: 45.373534,
    position: 24,
  },
  {
    _id: "66da250eef2ca1c109687a87",
    balance: 2336.86,
    age: 29,
    eyeColor: "green",
    name: "Anita Knapp",
    gender: "female",
    company: "SPLINX",
    email: "anitaknapp@splinx.com",
    phone: "+1 (940) 491-2285",
    address: "785 Wolcott Street, Rosburg, Texas, 6977",
    about:
      "Lorem duis amet sit dolore. Ullamco tempor consectetur velit Lorem tempor occaecat excepteur esse dolore cupidatat cupidatat ea proident cillum. Aute est veniam excepteur commodo in. Consequat in eiusmod ullamco do aute tempor pariatur ullamco sint exercitation. Eiusmod sunt elit aliquip magna cupidatat commodo. Officia proident nisi et excepteur non. Cupidatat magna anim culpa duis.\r\n",
    registered: "2018-12-10T05:23:28 -01:00",
    jobTitle: "Designer",
    latitude: -38.495956,
    longitude: 12.995904,
    position: 25,
  },
  {
    _id: "66da250e79ee14e2e5765e83",
    balance: 3965.84,
    age: 24,
    eyeColor: "brown",
    name: "Zelma Bruce",
    gender: "female",
    company: "ZENCO",
    email: "zelmabruce@zenco.com",
    phone: "+1 (985) 526-3219",
    address: "156 Erskine Loop, Frizzleburg, Arizona, 9981",
    about:
      "Sunt consequat laboris ipsum do incididunt nulla dolore enim adipisicing. Elit laborum ad excepteur anim fugiat aliqua id sunt fugiat laboris excepteur deserunt irure. Officia do laborum ullamco reprehenderit velit esse eu cupidatat tempor sit laborum. Cupidatat sit non eu in magna elit dolore ea ullamco ullamco et aute. Esse veniam voluptate laborum incididunt. Fugiat nostrud ea irure dolore ullamco nulla pariatur cupidatat Lorem cillum.\r\n",
    registered: "2019-05-25T06:32:17 -02:00",
    jobTitle: "Consultant",
    latitude: 17.129034,
    longitude: 32.619042,
    position: 26,
  },
  {
    _id: "66da250e70b49752cd658108",
    balance: 3163.17,
    age: 20,
    eyeColor: "blue",
    name: "Hobbs Moore",
    gender: "male",
    company: "PLEXIA",
    email: "hobbsmoore@plexia.com",
    phone: "+1 (842) 405-3186",
    address: "836 Seeley Street, Maxville, Washington, 5983",
    about:
      "Mollit tempor aliqua culpa eiusmod eiusmod veniam id duis excepteur anim non mollit. Mollit excepteur elit id commodo esse eiusmod ad voluptate aliqua tempor enim. Nisi deserunt occaecat veniam tempor velit commodo ut ipsum enim quis ex adipisicing mollit.\r\n",
    registered: "2015-01-20T09:48:10 -01:00",
    jobTitle: "Consultant",
    latitude: -2.419036,
    longitude: 28.161877,
    position: 27,
  },
  {
    _id: "66da250ec29a1c68101b49ab",
    balance: 1539.08,
    age: 40,
    eyeColor: "blue",
    name: "Kinney Carney",
    gender: "male",
    company: "SENSATE",
    email: "kinneycarney@sensate.com",
    phone: "+1 (811) 562-3276",
    address: "485 Oakland Place, Derwood, Tennessee, 3457",
    about:
      "Elit eu elit cillum nisi et voluptate nisi excepteur tempor. Dolore non eu ad eiusmod amet eiusmod sunt. Do duis qui eiusmod nulla elit esse commodo. Minim nostrud ut Lorem nisi elit. Ut laborum officia aliquip esse ut nostrud ut labore Lorem exercitation nostrud ex id ipsum. Consectetur voluptate cupidatat ea qui incididunt reprehenderit reprehenderit nulla veniam anim officia exercitation eu.\r\n",
    registered: "2024-06-01T08:13:41 -02:00",
    jobTitle: "Designer",
    latitude: 46.33502,
    longitude: -38.550214,
    position: 28,
  },
  {
    _id: "66da250e5d4a3881bd7f860d",
    balance: 3892.61,
    age: 24,
    eyeColor: "green",
    name: "Ericka Hogan",
    gender: "female",
    company: "SKINSERVE",
    email: "erickahogan@skinserve.com",
    phone: "+1 (866) 558-2619",
    address: "315 Belmont Avenue, Day, Federated States Of Micronesia, 8764",
    about:
      "Veniam ipsum minim consequat sit quis enim ea elit consectetur occaecat in adipisicing. Dolore id id velit exercitation anim officia ut Lorem esse nisi. Do ea sint veniam enim quis. Reprehenderit magna cupidatat nostrud cillum. Id consectetur aliquip ex sint cillum ipsum quis duis officia. Id nisi consequat aliquip consectetur aliqua in mollit. Reprehenderit pariatur mollit eiusmod ad.\r\n",
    registered: "2014-02-06T02:57:57 -01:00",
    jobTitle: "Developer",
    latitude: 82.331155,
    longitude: -48.296168,
    position: 29,
  },
  {
    _id: "66da250edac9bf5ce6716e8c",
    balance: 1319.62,
    age: 27,
    eyeColor: "green",
    name: "Jacobs Morin",
    gender: "male",
    company: "NEBULEAN",
    email: "jacobsmorin@nebulean.com",
    phone: "+1 (849) 473-2122",
    address: "402 Union Street, Monument, Rhode Island, 7552",
    about:
      "Proident eu irure labore est. Adipisicing exercitation pariatur reprehenderit non reprehenderit sunt occaecat incididunt reprehenderit excepteur do non. Dolor adipisicing irure sint ipsum velit ullamco in elit eu dolore Lorem irure. Nisi amet cupidatat aliquip non duis laborum veniam elit est nostrud reprehenderit id. Labore ipsum pariatur ex labore quis non labore veniam consequat. Irure officia ipsum sint magna proident nulla esse Lorem ut et duis non.\r\n",
    registered: "2014-06-20T09:02:48 -02:00",
    jobTitle: "Designer",
    latitude: -40.007763,
    longitude: -18.836647,
    position: 30,
  },
  {
    _id: "66da250e0562e617425a8634",
    balance: 3406.99,
    age: 24,
    eyeColor: "brown",
    name: "Witt Hickman",
    gender: "male",
    company: "NIQUENT",
    email: "witthickman@niquent.com",
    phone: "+1 (813) 442-3959",
    address: "780 Bowne Street, Cherokee, Puerto Rico, 4159",
    about:
      "Est officia dolore fugiat tempor. In amet velit culpa esse ex. Irure labore proident deserunt do occaecat ea irure reprehenderit. Et amet sunt tempor quis non dolor enim id ad nulla. Consectetur ullamco ut amet voluptate dolor eu ipsum proident dolor anim excepteur.\r\n",
    registered: "2022-08-04T04:32:27 -02:00",
    jobTitle: "Designer",
    latitude: -46.538974,
    longitude: 118.51127,
    position: 31,
  },
  {
    _id: "66da250eddf590a0f9750967",
    balance: 3293.76,
    age: 22,
    eyeColor: "green",
    name: "Cole Meyers",
    gender: "male",
    company: "PERKLE",
    email: "colemeyers@perkle.com",
    phone: "+1 (977) 518-3322",
    address: "541 Varick Avenue, Hendersonville, West Virginia, 229",
    about:
      "Labore ullamco sint sint commodo do qui id labore commodo amet. Qui sunt duis sint fugiat qui deserunt esse quis Lorem exercitation nostrud irure. Excepteur fugiat qui duis aliquip est. Consequat nisi laboris dolore veniam sunt aliqua mollit commodo.\r\n",
    registered: "2019-09-04T04:52:51 -02:00",
    jobTitle: "Consultant",
    latitude: -16.374003,
    longitude: -4.558862,
    position: 32,
  },
  {
    _id: "66da250ed11aedfd0b5fc607",
    balance: 3938.56,
    age: 26,
    eyeColor: "green",
    name: "Myra Cervantes",
    gender: "female",
    company: "TERRASYS",
    email: "myracervantes@terrasys.com",
    phone: "+1 (956) 428-2387",
    address: "877 Dank Court, Wacissa, Maine, 7152",
    about:
      "Eu proident eu ullamco sunt minim in qui mollit culpa minim. Amet esse duis consequat nulla esse irure fugiat proident ea. Nostrud id eu labore elit eu est occaecat exercitation esse incididunt. Dolore labore officia labore cupidatat anim nulla. In ipsum aliqua cupidatat reprehenderit reprehenderit ea aute elit culpa nulla ut laboris. Eu exercitation nostrud velit excepteur eu occaecat aute labore consequat cupidatat. Quis in duis consectetur cillum ullamco exercitation proident nisi.\r\n",
    registered: "2022-09-13T07:18:34 -02:00",
    jobTitle: "Developer",
    latitude: 62.869523,
    longitude: 97.954661,
    position: 33,
  },
  {
    _id: "66da250e10b52327d94cf64e",
    balance: 3029.96,
    age: 26,
    eyeColor: "blue",
    name: "Jeannette Frank",
    gender: "female",
    company: "NORALI",
    email: "jeannettefrank@norali.com",
    phone: "+1 (966) 458-2882",
    address: "306 Berry Street, Helen, California, 4545",
    about:
      "Excepteur cupidatat reprehenderit ipsum sunt cillum eu tempor non non in est incididunt deserunt. Ex incididunt fugiat ex proident dolor duis voluptate proident ea sint mollit do sunt ullamco. Cillum labore enim consectetur laborum.\r\n",
    registered: "2018-06-01T02:07:22 -02:00",
    jobTitle: "Designer",
    latitude: 36.677611,
    longitude: -104.098044,
    position: 34,
  },
  {
    _id: "66da250e06e4b5ac7fa9e63d",
    balance: 3369.22,
    age: 40,
    eyeColor: "blue",
    name: "Naomi Perry",
    gender: "female",
    company: "NUTRALAB",
    email: "naomiperry@nutralab.com",
    phone: "+1 (930) 433-2422",
    address: "978 Portland Avenue, Brownsville, District Of Columbia, 7191",
    about:
      "Reprehenderit occaecat dolor aute sunt mollit reprehenderit ipsum in aliqua. Labore fugiat ad dolor commodo sit nulla reprehenderit non Lorem sint reprehenderit. Do elit quis dolore et et voluptate non irure sint pariatur. Qui non et aute et excepteur officia Lorem commodo sit.\r\n",
    registered: "2015-07-12T09:33:18 -02:00",
    jobTitle: "Manager",
    latitude: 53.755985,
    longitude: 122.63165,
    position: 35,
  },
  {
    _id: "66da250ec6d0a1741168a9fe",
    balance: 1593.5,
    age: 27,
    eyeColor: "brown",
    name: "England Petersen",
    gender: "male",
    company: "CAXT",
    email: "englandpetersen@caxt.com",
    phone: "+1 (943) 466-2713",
    address: "190 Boerum Street, Noxen, Pennsylvania, 5456",
    about:
      "Excepteur ea laborum sunt ullamco eu cillum minim quis qui. Aliquip incididunt laboris qui dolor mollit qui cupidatat occaecat commodo minim non culpa ex excepteur. Non veniam anim ea voluptate.\r\n",
    registered: "2023-05-16T05:31:45 -02:00",
    jobTitle: "Manager",
    latitude: -37.536996,
    longitude: 161.494911,
    position: 36,
  },
  {
    _id: "66da250ee4cf0ea4214230e4",
    balance: 2648.01,
    age: 32,
    eyeColor: "brown",
    name: "Janelle Joseph",
    gender: "female",
    company: "TSUNAMIA",
    email: "janellejoseph@tsunamia.com",
    phone: "+1 (877) 422-3411",
    address: "465 Lake Avenue, Efland, Oregon, 1346",
    about:
      "In esse velit aute ullamco esse Lorem sunt ipsum do Lorem enim laboris velit pariatur. Ipsum nulla nulla dolore incididunt nulla exercitation quis enim laborum eu fugiat adipisicing reprehenderit exercitation. Aliqua occaecat sit anim minim aliqua minim ipsum velit officia labore cupidatat. Voluptate eu commodo anim pariatur ullamco enim.\r\n",
    registered: "2019-01-30T04:16:00 -01:00",
    jobTitle: "Developer",
    latitude: -69.930162,
    longitude: 62.058618,
    position: 37,
  },
  {
    _id: "66da250e305c1d1973dc30a2",
    balance: 2036.68,
    age: 28,
    eyeColor: "green",
    name: "Dillard Mullen",
    gender: "male",
    company: "POWERNET",
    email: "dillardmullen@powernet.com",
    phone: "+1 (904) 555-3790",
    address: "978 Bedell Lane, Taycheedah, Michigan, 2062",
    about:
      "Veniam et eiusmod aute cupidatat officia nulla et voluptate nisi Lorem veniam eiusmod. Lorem enim dolore amet nostrud mollit adipisicing. Cillum nulla sit veniam consectetur velit. Labore ea est labore irure ex consectetur duis velit aliquip. Dolor fugiat elit quis consectetur voluptate exercitation do mollit Lorem ex eiusmod ea qui nostrud. Eu velit sint culpa nulla do nulla magna.\r\n",
    registered: "2015-03-31T11:06:55 -02:00",
    jobTitle: "Developer",
    latitude: -35.185681,
    longitude: -72.168455,
    position: 38,
  },
  {
    _id: "66da250e8ac871f51f3cedf1",
    balance: 1287.36,
    age: 30,
    eyeColor: "blue",
    name: "Kelly Blevins",
    gender: "female",
    company: "ZILLACOM",
    email: "kellyblevins@zillacom.com",
    phone: "+1 (870) 463-3584",
    address: "288 Fane Court, Aurora, Nebraska, 4919",
    about:
      "Deserunt fugiat labore pariatur sint Lorem ex. Lorem culpa incididunt in deserunt est reprehenderit cupidatat proident. Sint nisi sint eu do tempor. Culpa quis velit ut velit cillum consectetur ex magna sit incididunt labore irure voluptate.\r\n",
    registered: "2024-08-05T12:17:56 -02:00",
    jobTitle: "Manager",
    latitude: 53.344281,
    longitude: 138.083497,
    position: 39,
  },
];
