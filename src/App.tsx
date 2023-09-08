import { FC } from "react";
import "./App.css";
import ReactGrid from "./ReactGrid";
import { ThemeProvider } from "@emotion/react";
import { Cell } from "./types/PublicModel";
import { ErrorBoundary } from "./components/ErrorBoundary";

const TextCell: FC<{ value: string }> = ({ value }) => <div>{value}</div>;

function App() {
  const cells: Cell[][] = Array(15).fill(null).map((_, rowIndex) => {
    return Array(7).fill(null).map((_, colIndex) => {
      return { Template: TextCell, value: `cell [${rowIndex}-${colIndex}]` };
    });
  });
  // const cells: Cell[][] = Array.from({ length: 15 }, (_, rowIndex) =>
  //   Array.from({ length: 7 }, (_, colIndex) => {
  //     return {
  //       Template: TextCell,
  //       value: `cell [${rowIndex}-${colIndex}]`,
  //     };
  //   })
  // );

  // cells[4][4] = {
  //   ...cells[4][4],
  //   // rowSpan: 2,
  //   colSpan: 2,
  // };

  cells[0][0] = {
    ...cells[0][0],
    colSpan: 2
  }

  // cells[0][1] = undefined;

  // cells[5][2] = {
  //   ...cells[5][2],
  //   rowSpan: 4,
  //   colSpan: 2,
  // };

  return (
    <ErrorBoundary>
      <ThemeProvider theme={{ grid: {} }}>
        <ReactGrid
          id={"rg-test"}
          // columns={Array.from({ length: 7 }, () => {
          //   return { width: (Math.random() * (150 - 100 + 1) + 100) << 0 };
          // })}
          // rows={Array.from({ length: 15 }, () => {
          //   return { height: (Math.random() * (50 - 20 + 1) + 20) << 0 };
          // })}
          columns={Array.from({ length: 7 }, () => {
            return { width: 100 };
          })}
          rows={Array.from({ length: 15 }, () => {
            return { height: 25 };
          })}
          cells={cells}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
