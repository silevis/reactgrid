import * as React from "react";
import {
  PaneContentProps,
  CellRendererProps,
  CellRenderer,
  Range,
  State,
} from "../../core";
import { SelectedRanges } from "./SelectedRanges";
import { ResizeHandle } from "./ResizeHandle";
import { FillHandleRenderer } from "./FillHandleRenderer";
import { FillHandleRangeSelection } from "./FillHandleRangeSelection";
import { State } from "../Model/State";

export interface PaneContentChild {
  state: State;
  calculatedRange: Range;
}

export type ProPaneContentChild = PaneContentChild;
export type ProPaneContentProps = PaneContentProps<State>;

// type RC<P> = React.FC<P> | React.ComponentClass<P>
// type HOC<O, P> = (C: RC<O>) => RC<P>

// export const compose = <P extends object>(C: RC<P>, ...hocs: HOC<any, any>[]): RC<P> => hocs.reduce((g, f) => f(g), C);

const withProComponents = <P extends CellRendererProps>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const wrappedProComponent = ({ ...props }: CellRendererProps) => {
    const { location } = props;
    Component.displayName = "WithResizeHandle";
    return (
      <Component {...(props as P)}>
        {location.row.idx === 0 && location.column.resizable && (
          <ResizeHandle />
        )}
      </Component>
    );
  };
  return wrappedProComponent;
};

export const ProCellRenderer = withProComponents(CellRenderer);

export function renderProComponents(
  state: State,
  calculatedRange: Range
): React.ReactNode {
  return (
    <>
      <SelectedRanges
        state={state as State}
        calculatedRange={calculatedRange}
      />
      <FillHandleRangeSelection
        state={state as State}
        calculatedRange={calculatedRange}
      />
      <FillHandleRenderer
        state={state as State}
        calculatedRange={calculatedRange}
      />
    </>
  );
}
