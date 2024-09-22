import {
  Cell,
  Column,
  NonEditableCell,
  NumberCell,
  Row,
  TextCell,
} from "@silevis/reactgrid";

export interface BudgetData {
  id: number;
  isExpandable: boolean;
  position: number;
  name: string;
  "2023": {
    "01": number | null;
    "02": number | null;
    "03": number | null;
    "04": number | null;
    "05": number | null;
    "06": number | null;
    "07": number | null;
    "08": number | null;
    "09": number | null;
    "10": number | null;
    "11": number | null;
    "12": number | null;
  };
  "2024": {
    "01": number | null;
    "02": number | null;
    "03": number | null;
    "04": number | null;
    "05": number | null;
    "06": number | null;
    "07": number | null;
    "08": number | null;
    "09": number | null;
    "10": number | null;
    "11": number | null;
    "12": number | null;
  };
}

const getRandomValue = (min: number, max: number) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));

const generateYearData = (min: number, max: number, empty: boolean) => ({
  "2023": {
    "01": empty ? null : getRandomValue(min, max),
    "02": empty ? null : getRandomValue(min, max),
    "03": empty ? null : getRandomValue(min, max),
    "04": empty ? null : getRandomValue(min, max),
    "05": empty ? null : getRandomValue(min, max),
    "06": empty ? null : getRandomValue(min, max),
    "07": empty ? null : getRandomValue(min, max),
    "08": empty ? null : getRandomValue(min, max),
    "09": empty ? null : getRandomValue(min, max),
    "10": empty ? null : getRandomValue(min, max),
    "11": empty ? null : getRandomValue(min, max),
    "12": empty ? null : getRandomValue(min, max),
  },
  "2024": {
    "01": empty ? null : getRandomValue(min, max),
    "02": empty ? null : getRandomValue(min, max),
    "03": empty ? null : getRandomValue(min, max),
    "04": empty ? null : getRandomValue(min, max),
    "05": empty ? null : getRandomValue(min, max),
    "06": empty ? null : getRandomValue(min, max),
    "07": empty ? null : getRandomValue(min, max),
    "08": empty ? null : getRandomValue(min, max),
    "09": empty ? null : getRandomValue(min, max),
    "10": empty ? null : getRandomValue(min, max),
    "11": empty ? null : getRandomValue(min, max),
    "12": empty ? null : getRandomValue(min, max),
  },
});

export const generateEntityData = (
  id: number,
  name: string,
  empty: boolean = false
) => ({
  id,
  position: id,
  name,
  isExpandable: empty,
  ...generateYearData(5000, 15000, empty),
});

export const budgetsData: BudgetData[] = [
  generateEntityData(5, "Serge Gainsbourg"),
  generateEntityData(6, "Jacob Sandberg"),
  generateEntityData(7, "Elizabeth Hudson"),
  generateEntityData(9, "Gas"),
  generateEntityData(10, "Electricity"),
  generateEntityData(11, "Rent"),
  generateEntityData(12, "Insurance"),
  generateEntityData(14, "Vehicle"),
  generateEntityData(15, "Computer"),
];

// export const headers = [
//   "Organization / Period",
//   "2023",
//   "Q1",
//   "01",
//   "02",
//   "03",
//   "Q2",
//   "04",
//   "05",
//   "06",
//   "Q3",
//   "07",
//   "08",
//   "09",
//   "Q4",
//   "10",
//   "11",
//   "12",
//   "2024",
//   "Q1",
//   "01",
//   "02",
//   "03",
//   "Q2",
//   "04",
//   "05",
//   "06",
//   "Q3",
//   "07",
//   "08",
//   "09",
//   "Q4",
//   "10",
//   "11",
//   "12",
// ];
