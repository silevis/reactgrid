import { Cell, TextCell } from "@silevis/reactgrid";
import { headerCellsStyle } from "./cellStyles";
import { HorizontalChevronCell } from "./HorizontalChevronCell";

interface HeaderCellProps {
  rowIndex: number;
  colIndex: number;
  value: string;
  style?: React.CSSProperties;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onExpand?: (status: boolean) => void;
}

const getHeaderCell = ({
  rowIndex,
  colIndex,
  value,
  style,
  hasChildren,
  isExpanded,
  onExpand,
}: HeaderCellProps): Cell => ({
  rowIndex,
  colIndex,
  Template: HorizontalChevronCell,
  props: {
    value,
    style,
    hasChildren,
    isExpanded,
    onExpand,
  },
  isSelectable: false,
});

const generateQuarterHeaderCells = (
  rowIndex: number,
  startColIndex: number,
  quarter: number,
  expandStatus: Record<string, boolean>,
  setExpandStatus: (key: string, status: boolean) => void
) => {
  const months = Array.from({ length: 3 }, (_, i) => `Month ${String(i + 1 + (quarter - 1) * 3).padStart(2, "0")}`);
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  let colIndex = startColIndex;
  const quarterKey = `${colIndex}-Quarter`;
  const cells = [
    getHeaderCell({
      rowIndex,
      colIndex: colIndex++,
      value: `Quarter ${quarter}`,
      style: headerCellsStyle,
      hasChildren: true,
      isExpanded: expandStatus[quarterKey],
      onExpand: (status) => setExpandStatus(quarterKey, status),
    }),
  ];

  months.forEach((month) => {
    const monthKey = `${colIndex}-Month`;
    cells.push(
      getHeaderCell({
        rowIndex,
        colIndex: colIndex++,
        value: month,
        style: headerCellsStyle,
        hasChildren: true,
        isExpanded: expandStatus[monthKey],
        onExpand: (status) => setExpandStatus(monthKey, status),
      })
    );
    weeks.forEach((week) => {
      const weekKey = `${colIndex}-Week`;
      cells.push(
        getHeaderCell({
          rowIndex,
          colIndex: colIndex++,
          value: week,
          style: headerCellsStyle,
          hasChildren: true,
          isExpanded: expandStatus[weekKey],
          onExpand: (status) => setExpandStatus(weekKey, status),
        })
      );
      days.forEach((day) => {
        cells.push(
          getHeaderCell({
            rowIndex,
            colIndex: colIndex++,
            value: day,
            style: headerCellsStyle,
          })
        );
      });
    });
  });

  return cells;
};

const generateYearChevronCell = (
  rowIndex: number,
  colIndex: number,
  expandStatus: Record<string, boolean>,
  setExpandStatus: (key: string, status: boolean) => void
): Cell => {
  const yearKey = `${colIndex}-Year`;
  return getHeaderCell({
    rowIndex,
    colIndex,
    value: "2020",
    style: headerCellsStyle,
    hasChildren: true,
    isExpanded: expandStatus[yearKey],
    onExpand: (status) => setExpandStatus(yearKey, status),
  });
};

export const generateYearHeaderCells = (
  expandStatus: Record<string, boolean>,
  setExpandStatus: (key: string, status: boolean) => void
) => {
  const headerCells: Cell[] = [];
  let colIndex = 1;

  headerCells.push(generateYearChevronCell(0, colIndex++, expandStatus, setExpandStatus));

  for (let quarter = 1; quarter <= 4; quarter++) {
    const quarterCells = generateQuarterHeaderCells(0, colIndex, quarter, expandStatus, setExpandStatus);
    headerCells.push(...quarterCells);
    colIndex += quarterCells.length;
  }

  return headerCells;
};

const generateTitleCell = (title: string, setTitleCell: (title: string) => void): Cell => ({
  rowIndex: 0,
  colIndex: 0,
  Template: TextCell,
  props: {
    text: title,
    onTextChanged: setTitleCell,
  },
  isSelectable: false,
});

export const getCells = ({
  horizontalExpandStatus,
  handleHorizontalExpandStatusChange,
  title,
  setTitle,
}: {
  horizontalExpandStatus: Record<string, boolean>;
  handleHorizontalExpandStatusChange: (key: string, status: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
}) => {
  return [
    generateTitleCell(title, setTitle),
    ...generateYearHeaderCells(horizontalExpandStatus, handleHorizontalExpandStatusChange),
  ];
};
