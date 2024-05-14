import { StoryDefault } from "@ladle/react";
import { StrictMode, useState } from "react";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";
import TextCell from "../components/cellTemplates/TextCell";
import { HeaderCell } from "../components/cellTemplates/HeaderCell";
import ReactGrid from "../ReactGrid";
import { ErrorBoundary } from "../components/ErrorBoundary";

interface CellData {
  text?: string;
}

const ROW_COUNT = 10;
const COLUMN_COUNT = 10;

export const GridWithHeaders = () => {
  const [data, setData] = useState<(CellData | null)[][]>(
    Array.from({ length: ROW_COUNT }).map((_, i) => {
      return Array.from({ length: COLUMN_COUNT }).map((_, j) => {
        if (i === 0) {
          return { text: `title ${j + 1}` };
        }
        return {
          text: `[${i.toString()}:${j.toString()}]`,
        };
      });
    })
  );

  const cellMatrix = cellMatrixBuilder(({ addRows, addColumns, setCell }) => {
    data.forEach((row, i) => {
      addRows({
        id: i.toString(),
        height: "50px",
      });
      row.forEach((val, j) => {
        if (i === 0) {
          addColumns({
            id: j.toString(),
            width: "150px",
          });
          setCell(i.toString(), j.toString(), HeaderCell, {
            text: val?.text,
            style: {
              backgroundColor: "#fcff91",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            },
          });
        } else {
          if (val === null) return;

          setCell(i.toString(), j.toString(), TextCell, {
            value: val?.text,
            style: {},
            onTextChanged: (data) => {
              setData((prev) => {
                const next = [...prev];
                if (next[i][j] !== null) {
                  next[i][j].text = data;
                }
                return next;
              });
            },
          });
        }
      });
    });
  });

  return (
    <div className="rgScrollableContainer" style={{ height: "100%", width: "100%", overflow: "auto" }}>
      <ReactGrid id="grid-with-headers" onResizeColumn={(width, columnId) => {}} stickyTopRows={1} {...cellMatrix} />
    </div>
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
