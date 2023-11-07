import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import ReactGrid from "../ReactGrid";
import { ErrorBoundary } from "../components/ErrorBoundary";
import TextCell from "../components/cellTemplates/TextCell";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";

const ROW_COUNT = 50;
const COLUMN_COUNT = 40;

export const BigGrid = () => {
  const [data, setData] = useState<(string | null)[][]>(
    Array.from({ length: ROW_COUNT }).map((_, i) => {
      return Array.from({ length: COLUMN_COUNT }).map((_, j) => {
        if (i === 0 && j === 1) return null;
        if (i === 1 && j === 0) return null;
        if (i === 1 && j === 1) return null;

        return [
          "Lorem ipsum dolor sit amet",
          "Reiciendis illum, nihil, ab officiis explicabo!",
          "Excepturi in adipisci omnis illo eveniet obcaecati!",
          "Doloremque, sit!",
        ][Math.floor(Math.random() * 4)];
      });
    })
  );

  const cellMatrix = cellMatrixBuilder(({ addRows, addColumns, setCell }) => {
    data.forEach((row, i) => {
      addRows({
        id: i.toString(),
        // height: `${Math.floor(Math.random() * 5) + 1}fr`,
        height: "max-content",
      });
      row.forEach((val, j) => {
        if (i === 0)
          addColumns({
            id: j.toString(),
            // width: `${Math.floor(Math.random() * 3) + 1}fr`,
            width: "min-content",
          });
        if (val === null) return;

        setCell(i.toString(), j.toString(), TextCell, {
          text: val,
          onTextChanged: (newText) => {
            setData((prev) => {
              const next = [...prev];
              next[i][j] = newText;
              return next;
            });
          },
        });
      });
    });

    setCell("0", "0", TextCell, { text: data[0][0] ?? "", reverse: true }, { colSpan: 2, rowSpan: 2 });
  });

  cellMatrix.columns[1].width = "7rem";

  return (
    <>
      <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
        <ReactGrid
          id="big-grid"
          stickyTopRows={2}
          stickyLeftColumns={3}
          stickyRightColumns={2}
          stickyBottomRows={2}
          {...cellMatrix}
        />
      </div>
    </>
  );
};

export default {
  decorators: [
    (Component) => (
      <StrictMode>
        <ErrorBoundary>
          <Component />
        </ErrorBoundary>
      </StrictMode>
    ),
  ],
} satisfies StoryDefault;
