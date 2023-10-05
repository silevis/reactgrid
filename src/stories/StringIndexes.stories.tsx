import { ThemeProvider } from "@emotion/react";
import { StoryDefault } from "@ladle/react";
import { CSSProperties, FC, useEffect, useMemo, useState } from "react";
import ReactGrid from "../ReactGrid";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";
import { useReactGridId } from "../components/ReactGridIdProvider";
import React from "react";

type Budget = Record<string, number[]>;

const HeaderCell: FC<{ value: string; style?: CSSProperties }> = ({
  value,
  style,
}) => (
  <div
    css={(theme) => ({
      backgroundColor: theme.colors?.primary,
      color: "#202a44",
      textAlign: "center",
      fontSize: "1.2rem",
      padding: ".5rem 0 .5rem 0",
      ...style,
    })}
  >
    {value}
  </div>
);

const centerContentStyles = {
  display: "grid",
  placeItems: "center",
  height: "100%",
};
const TextCell: FC<{ value: string; style?: CSSProperties }> = ({
  value,
  style,
}) => {
  return <div style={{ ...centerContentStyles, ...style }}>{value}</div>;
};
const ConverterCell: FC<{ value: string; style?: CSSProperties }> = ({
  value,
  style,
}) => {
  const getStringValue = () => console.log(`it works!: ${value}`);
  getStringValue();

  return <div style={{ ...centerContentStyles, ...style }}>{value}</div>;
};

const SpacerCell: FC = () => <div />;

const ChevronCell: FC<{
  value: string;
  isExpanded: boolean;
  hasChildren: boolean;
  indent: number;
  onChange?: (isExpanded: boolean) => void;
  style?: CSSProperties;
}> = ({ value, isExpanded, hasChildren, indent, onChange, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      height: "100%",
      // justifyContent: "space-around",
      paddingLeft: `calc(${indent * 2.5}em + 2px)`,
      ...style,
    }}
  >
    {hasChildren ? (
      <div
        style={{
          padding: "0 .5em 0 .5em",
          cursor: "pointer",
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onChange?.(!isExpanded);
        }}
      >
        <div style={{ rotate: isExpanded ? "90deg" : "0deg" }}>
          <span style={{ userSelect: "none" }}>❯</span>
        </div>
      </div>
    ) : (
      <div className="no-child" />
    )}
    {value}
  </div>
);

// const CellContainer: FC<{ style?: CSSProperties }> = ({ children, style }) => {
//   const id = useReactGridId();
//   // const
// }

// const ConverterCell: FC<{ value: string }> = ({ value }) => {
//   const id = useReactGridId();

//   useEffect(() => {
//     console.log("ConverterCell rendered");
//   }, []);

//   return <div>{value}</div>;
// };

export const StringIndexes = () => {
  type RowId =
    | "header"
    | "labels"
    | "officeExpenses"
    | "officeExpenses.Gas"
    | "officeExpenses.Electricity"
    | "officeExpenses.Rent"
    | "personExpenses"
    | "personExpenses.John"
    | "personExpenses.Jane"
    | "personExpenses.Joe";

  type ColumnId = "labels" | "2023" | "Jan" | "Feb" | "Mar";

  const [chevronConfig, setChevronConfig] = useState<{
    [key: string]: { isExpanded: boolean };
  }>({
    "2023": { isExpanded: true },
    officeExpenses: { isExpanded: true },
    personExpenses: { isExpanded: true },
  });

  const cellMatrix = useMemo(
    () =>
      cellMatrixBuilder<RowId, ColumnId>(({ addRows, addColumns, setCell }) => {
        const personBudget: Budget = {
          John: [5435.0, 55.0, 55.0],
          Jane: [450.0, 477, 450.0],
          Joe: [5500.0, 5500.0, 5500.0],
        };

        const officeBudget: Budget = {
          Gas: [1199.0, 1143.0, 1052.0],
          Electricity: [106.67, 106.67, 106.67],
          Rent: [2200.0, 2200.0, 2200.0],
        };

        const defineRows = () => {
          addRows(
            { id: "header", height: "max-content" },
            { id: "labels", height: "1.2fr" }
          );

          // Call below should throw an "duplicate ids" error
          // addRows({ id: "labels", height: "1.2fr" }, { id: "header", height: "max-content" });

          addRows({ id: "officeExpenses", height: "1fr" });
          if (chevronConfig["officeExpenses"].isExpanded) {
            addRows(
              { id: "officeExpenses.Gas", height: "1fr" },
              { id: "officeExpenses.Electricity", height: "1fr" },
              { id: "officeExpenses.Rent", height: "1fr" }
            );
          }

          addRows({ id: "personExpenses", height: "1fr" });
          if (chevronConfig["personExpenses"].isExpanded) {
            addRows(
              { id: "personExpenses.John", height: "1fr" },
              { id: "personExpenses.Jane", height: "1fr" },
              { id: "personExpenses.Joe", height: "1fr" }
            );
          }
        };

        const defineColumns = () => {
          addColumns(
            { id: "labels", width: "20rem" },
            { id: "2023", width: "1fr" }
          );

          // Call below should throw an "duplicate ids" error
          // addColumns({ id: "labels", width: "20rem" }, { id: "2023", width: "1fr" });

          if (chevronConfig["2023"].isExpanded) {
            addColumns(
              { id: "Jan", width: "1fr" },
              { id: "Feb", width: "1fr" },
              { id: "Mar", width: "1fr" }
            );
          }
        };

        const addLabels = () => {
          setCell(
            "header",
            "labels",
            HeaderCell,
            { value: "Budget planner" },
            { colSpan: 5 }
          );
          setCell("labels", "labels", ConverterCell, { value: "Entry name" });
          setCell("labels", "2023", ChevronCell, {
            value: "2023",
            isExpanded: chevronConfig["2023"].isExpanded,
            hasChildren: true,
            indent: 0,
            onChange: (isExpanded) =>
              setChevronConfig({ ...chevronConfig, "2023": { isExpanded } }),
          });

          if (chevronConfig["2023"].isExpanded) {
            setCell("labels", "Jan", TextCell, { value: "January" });
            setCell("labels", "Feb", TextCell, { value: "February" });
            setCell("labels", "Mar", TextCell, { value: "March" });
          }

          setCell("officeExpenses", "labels", ChevronCell, {
            value: "Office expenses",
            isExpanded: chevronConfig["officeExpenses"].isExpanded,
            hasChildren: true,
            indent: 0,
            onChange: (isExpanded) =>
              setChevronConfig({
                ...chevronConfig,
                officeExpenses: { isExpanded },
              }),
          });
          if (chevronConfig["officeExpenses"].isExpanded) {
            setCell("officeExpenses.Gas", "labels", ChevronCell, {
              value: "Gas",
              isExpanded: true,
              hasChildren: false,
              indent: 1,
            });
            setCell("officeExpenses.Electricity", "labels", ChevronCell, {
              value: "Electricity",
              isExpanded: true,
              hasChildren: false,
              indent: 1,
            });
            setCell("officeExpenses.Rent", "labels", ChevronCell, {
              value: "Rent",
              isExpanded: true,
              hasChildren: false,
              indent: 1,
            });
          }

          setCell("personExpenses", "labels", ChevronCell, {
            value: "Person expenses",
            isExpanded: chevronConfig["personExpenses"].isExpanded,
            hasChildren: true,
            indent: 0,
            onChange: (isExpanded) =>
              setChevronConfig({
                ...chevronConfig,
                personExpenses: { isExpanded },
              }),
          });
          if (chevronConfig["personExpenses"].isExpanded) {
            setCell("personExpenses.John", "labels", ChevronCell, {
              value: "John",
              isExpanded: true,
              hasChildren: false,
              indent: 1,
            });
            setCell("personExpenses.Jane", "labels", ChevronCell, {
              value: "Jane",
              isExpanded: true,
              hasChildren: false,
              indent: 1,
            });
            setCell("personExpenses.Joe", "labels", ChevronCell, {
              value: "Joe",
              isExpanded: true,
              hasChildren: false,
              indent: 1,
            });
          }
        };

        const addData = () => {
          const officeGasSum = officeBudget.Gas.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const officeElectricitySum = officeBudget.Electricity.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const officeRentSum = officeBudget.Rent.reduce(
            (acc, curr) => acc + curr,
            0
          );

          const personJohnSum = personBudget.John.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const personJaneSum = personBudget.Jane.reduce(
            (acc, curr) => acc + curr,
            0
          );
          const personJoeSum = personBudget.Joe.reduce(
            (acc, curr) => acc + curr,
            0
          );

          setCell("officeExpenses", "2023", TextCell, {
            value: (
              officeGasSum +
              officeElectricitySum +
              officeRentSum
            ).toFixed(2),
          });
          if (chevronConfig["officeExpenses"].isExpanded) {
            setCell("officeExpenses.Gas", "2023", TextCell, {
              value: officeGasSum.toFixed(2),
            });
            setCell("officeExpenses.Electricity", "2023", TextCell, {
              value: officeElectricitySum.toFixed(2),
            });
            setCell("officeExpenses.Rent", "2023", TextCell, {
              value: officeRentSum.toFixed(2),
            });
          }

          setCell("personExpenses", "2023", TextCell, {
            value: (personJohnSum + personJaneSum + personJoeSum).toFixed(2),
          });
          if (chevronConfig["personExpenses"].isExpanded) {
            setCell("personExpenses.John", "2023", TextCell, {
              value: personJohnSum.toFixed(2),
            });
            setCell("personExpenses.Jane", "2023", TextCell, {
              value: personJaneSum.toFixed(2),
            });
            setCell("personExpenses.Joe", "2023", TextCell, {
              value: personJoeSum.toFixed(2),
            });
          }

          if (!chevronConfig["2023"].isExpanded) return;

          (["Jan", "Feb", "Mar"] as const).forEach((month, index) => {
            setCell("officeExpenses", month, TextCell, {
              value: (
                officeBudget.Gas[index] +
                officeBudget.Electricity[index] +
                officeBudget.Rent[index]
              ).toFixed(2),
            });
            if (chevronConfig["officeExpenses"].isExpanded) {
              setCell("officeExpenses.Gas", month, TextCell, {
                value: officeBudget.Gas[index].toString(),
              });
              setCell("officeExpenses.Electricity", month, TextCell, {
                value: officeBudget.Electricity[index].toString(),
              });
              setCell("officeExpenses.Rent", month, TextCell, {
                value: officeBudget.Rent[index].toString(),
              });
            }

            setCell("personExpenses", month, TextCell, {
              value: (
                personBudget.John[index] +
                personBudget.Jane[index] +
                personBudget.Joe[index]
              ).toFixed(2),
            });
            if (chevronConfig["personExpenses"].isExpanded) {
              setCell("personExpenses.John", month, TextCell, {
                value: personBudget.John[index].toString(),
              });
              setCell("personExpenses.Jane", month, TextCell, {
                value: personBudget.Jane[index].toString(),
              });
              setCell("personExpenses.Joe", month, TextCell, {
                value: personBudget.Joe[index].toString(),
              });
            }
          });
        };

        defineRows();
        defineColumns();

        addLabels();
        addData();


        // Call below should log an "cell overwrite" warning
        // setCell("labels", "labels", SpacerCell, {});
      }),
      [chevronConfig]
      );

      const noop = () => null;
      const Cell = cellMatrix.cells.get("labels")?.get("labels")?.Template ?? noop;
      <Cell />;
      Cell(cellMatrix.cells.get("labels")?.get("labels")?.props ?? { value: "not found" });

  return (
    <ThemeProvider
      theme={{
        colors: { primary: "#89cff0" },
        grid: {
          templates: {
            // columns: ({ widths }) => widths.join(" "),
            rows: ({ heights }) => heights.join(" "),
          },
        },
      }}
    >
      <ReactGrid id={"rg-string-indexes"} {...cellMatrix} />
    </ThemeProvider>
  );
};

export default {
  decorators: [
    (Component) => (
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>
    ),
  ],
} satisfies StoryDefault;
