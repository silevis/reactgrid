import React from "react";
import { StrictMode } from "react";
import { ReactGrid } from "@silevis/reactgrid";
import { StoryDefault } from "@ladle/react";
import { ErrorBoundary } from "../../lib/components/ErrorBoundary";
import { getCells } from "./utils2";

export const BudgetPlanner = () => {
  const [title, setTitle] = React.useState("Budget Planner");
  const [horizontalExpandStatus, setHorizontalExpandStatus] = React.useState<Record<string, boolean>>({});

  const handleHorizontalExpandStatusChange = (key: string, status: boolean) => {
    setHorizontalExpandStatus((prevStatus) => ({
      ...prevStatus,
      [key]: status,
    }));
  };

  const cells = getCells({
    horizontalExpandStatus,
    title,
    setTitle,
    handleHorizontalExpandStatusChange,
  });

  return (
    <div>
      <ReactGrid cells={cells} />
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
