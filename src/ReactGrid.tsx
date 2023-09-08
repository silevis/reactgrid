import { FC } from "react";
import { ReactGridProps } from "./types/PublicModel";
import { useTheme } from "./utils/useTheme";
import useSpanMembers from "./utils/useSpanMembers";

const ReactGrid: FC<ReactGridProps> = ({ columns, rows, cells }) => {
  const theme = useTheme();
  const { markMembersIfSpanned, isSpanMember } = useSpanMembers({ rowAmount: rows.length, colAmount: columns.length });

  return (
    <div
      css={{
        display: "grid",
        gridTemplateColumns: theme.grid.templates.columns({ amount: columns.length }),
        gridTemplateRows: theme.grid.templates.rows({ amount: rows.length }),
        borderWidth: `${theme.grid.border.width} 0 0 ${theme.grid.border.width}`,
        borderStyle: theme.grid.border.style,
        borderColor: theme.grid.border.color,
        gap: theme.grid.gap,
      }}
    >
      {cells.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          // if (isSpanMember({ rowIndex, colIndex })) return null;
          // markMembersIfSpanned({ cell, rowIndex, colIndex });

          const { Template, ...rest } = cell;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`rgCellWrapper rgRowId-${rowIndex} rgColId-${colIndex}`}
              css={{
                ...(cell.rowSpan && { gridRowEnd: `span ${cell.rowSpan}` }),
                ...(cell.colSpan && { gridColumnEnd: `span ${cell.colSpan}` }),
                borderWidth: `0 ${theme.cells.border.width} ${theme.cells.border.width} 0`,
                borderStyle: theme.cells.border.style,
                borderColor: theme.cells.border.color,
              }}
            >
              <Template {...rest} />
            </div>
          );
        });
      })}
    </div>
  );
};

export default ReactGrid;
