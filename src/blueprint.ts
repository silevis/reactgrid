

type DefaultDataTypes = string | number | boolean | null;

type Data<TData = DefaultDataTypes> = (TData | DefaultDataTypes)[][];

type GroupedDropdownData = {
  id: number;
  name: string;
  value: string;
  children?: GroupedDropdownData[];
}

const data: Data<GroupedDropdownData> = [
  ['a', 5, 'c'],
  ['d', 'e', {
    id: 1,
    name: 'name',
    value: 'value',
    children: [
      {
        id: 2,
        name: 'name',
        value: 'value',
      }
    ]
  }],
];

(data[1][2] as GroupedDropdownData).name;

const getCellByPoint = (x: number, y: number) => {
  const container = document.querySelector(".scrollableContainer")!;
  const relativeX = x + container.getBoundingClientRect().left - container.scrollLeft;
  const relativeY = y + container.getBoundingClientRect().top - container.scrollTop;

  const cell = document.elementFromPoint(relativeX, relativeY);

  return cell;
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // if (entry.isIntersecting) {
    //   // console.log(entry);
    // }
    entry.target.textContent = `${Math.floor(entry.intersectionRatio * 100)}%`
  });
}, {
  root: document.querySelector(".scrollableContainer"),
  rootMargin: "0px",
  threshold: [0, 0.5, 1]
});

React.useEffect(() => {
  observer.observe(document.querySelector(".rgRowId-13.rgColId-0")!);
}, []);

/**
 * Small utility which whole purpose is to help you define your rows 
 * (and cell's rowId's) in a type-safe way. <br />
 * 
 * **Downside!: can't use mutable arrays :(** <br />
 * 
 * If you need to use mutable arrays you can:
 * - define a type for your row ids manually (e.g. `type RowIds = 'gasBills' | 'salaries'`) [optional]
 * - use {@link Row `Row<RowIds>[]`} as the type of your rows array and ignore this utility
 * (see {@link Row} type for more info)
 * 
 * @example
 * const rows = Rows([
 *   { id: 'Jane', height: 100 },
 *   { id: 'Joe', height: 50 },
 * ] as const); // ! as const is required
 * 
 * type RowId = typeof rows[number]['id']; // 'Jane' | 'Joe'
 * 
 * @param rows Your array of row definitions 
 * @returns readonly array of row definitions
 */
export const Rows = <T>(rows: readonly Row<T>[]) => rows;

/**
 * Small utility which whole purpose is to help you define your columns 
 * (and cell's colId's) in a type-safe way. <br />
 * 
 * **Downside!: can't use mutable arrays :(** <br />
 * 
 * If you need to use mutable arrays you can:
 * - define a type for your column ids manually (e.g. `type ColIds = 'gasBills' | 'salaries'`) [optional]
 * - use {@link Column `Column<ColIds>[]`} as the type of your columns array and ignore this utility
 * (see {@link Column} type for more info)
 * 
 * @example
 * const columns = Columns([
 *   { id: 'name', width: 100 },
 *   { id: 'age', width: 50 },
 * ] as const); // ! as const is required
 * 
 * type ColumnId = typeof columns[number]['id']; // 'name' | 'age'
 * @param columns Your array of column definitions 
 * @returns readonly array of column definitions
 */
export const Columns = <T>(columns: readonly Column<T>[]) => columns;