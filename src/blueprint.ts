

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
