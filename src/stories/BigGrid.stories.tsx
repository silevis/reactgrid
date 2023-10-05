import { StoryDefault } from "@ladle/react";
import { useEffect } from "react";
import ReactGrid from "../ReactGrid";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { cellMatrixBuilder } from "../utils/cellMatrixBuilder";

type CellSize = {
  width: number;
  height: number;
};

export const BigGrid = () => {
  const cellMatrix = cellMatrixBuilder(
    ({ addRows, addColumns, setCell }) => {
      Array.from({ length: 1000 }).forEach((_, i) => {
        addRows({
          id: i.toString(),
          height: `${Math.floor(Math.random() * 5) + 1}fr`,
        });
      });
      Array.from({ length: 200 }).forEach((_, i) => {
        addColumns({
          id: i.toString(),
          width: `${Math.floor(Math.random() * 5) + 1}fr`,
        });
      });

      Array.from({ length: 1000 }).forEach((_, i) => {
        Array.from({ length: 200 }).forEach((_, j) => {
          setCell(i.toString(), j.toString(), () => (
            <div
              style={{ padding: ".1rem .2rem", textAlign: "center" }}
            >{`[${i}×${j}]`}</div>
          ));
        });
      });
    }
  );

  // const [renderingPhase, setRenderingPhase] = React.useState<"initial" | "measuring" | "render">("initial");
  // const cellSizes = useRef();
  // const scr

  // const getVisibleRange =

  useEffect(() => {
    // window.addEventListener("resize", () => {
  }, []);

  return (
    <div
      className="rgScrollableContainer"
      style={{ height: "300px", width: "450px", overflow: "auto" }}
    >
      <ReactGrid
        id="big-grid"
        {...cellMatrix}
      />
    </div>
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
