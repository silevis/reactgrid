import { FC } from "react";
import { ReactGridProps } from "./types/PublicModel";
import { useTheme } from "./utils/useTheme";

const ReactGrid: FC<ReactGridProps> = ({ columns, rows, cells, style }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: theme.grid.templates.columns({
          amount: columns.length,
          widths: columns.map(({ width }) => width),
        }),
        gridTemplateRows: theme.grid.templates.rows({ amount: rows.length, heights: rows.map(({ height }) => height) }),
        borderWidth: `${theme.grid.border.width} 0 0 ${theme.grid.border.width}`,
        borderStyle: theme.grid.border.style,
        borderColor: theme.grid.border.color,
        gap: theme.grid.gap,
        ...style,
      }}
    >
      {rows.map(({ id: rowId, height }, rowIndex) => {
        return columns.map(({ id: colId, width: width },colIndex) => {
          const cell = cells.get(rowId)?.get(colId);

          if (!cell) return null;

          const { Template, props } = cell;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`rgCellWrapper rgRowId-${rowIndex} rgColId-${colIndex}`}
              style={{
                ...(cell.rowSpan && { gridRowEnd: `span ${cell.rowSpan}` }),
                ...(cell.colSpan && { gridColumnEnd: `span ${cell.colSpan}` }),
                gridRowStart: rowIndex + 1,
                gridColumnStart: colIndex + 1,
                borderWidth: `0 ${theme.cells.border.width} ${theme.cells.border.width} 0`,
                borderStyle: theme.cells.border.style,
                borderColor: theme.cells.border.color,
              }}
            >
              <Template {...props} />
            </div>
          );
        });
      })}
    </div>
  );
};

export default ReactGrid;
