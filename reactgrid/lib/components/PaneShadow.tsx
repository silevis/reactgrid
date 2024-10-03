import React, { CSSProperties } from "react";
import { PaneShadowName } from "../types/InternalModel";
import { useTheme } from "../hooks/useTheme";
import { NumericalRange } from "../main";
import { RGTheme } from "../types/RGTheme";

const getPaneShadowStyle = (paneShadowName: PaneShadowName, range: NumericalRange, gap: RGTheme["gap"]) => {
  let style: CSSProperties = {
    position: "sticky",
    gridRowStart: range.startRowIdx + 1,
    gridRowEnd: range.endRowIdx + 1,
    gridColumnStart: range.startColIdx + 1,
    gridColumnEnd: range.endColIdx + 1,
  };

  if (paneShadowName === "Top") {
    style = {
      ...style,
      top: 0,
      height: `calc(100% + 2*${gap.width})`,
      marginTop: `-${gap.width}`,
    };
  }
  if (paneShadowName === "Right") {
    style = {
      ...style,
      right: 0,
      width: `calc(100% + 2*${gap.width})`,
      marginLeft: `-${gap.width}`,
    };
  }
  if (paneShadowName === "Bottom") {
    style = {
      ...style,
      bottom: 0,
      height: `calc(100% + 2*${gap.width})`,
      marginTop: `-${gap.width}`,
    };
  }
  if (paneShadowName === "Left") {
    style = {
      ...style,
      left: 0,
      width: `calc(100% + 2*${gap.width})`,
      marginLeft: `-${gap.width}`,
    };
  }

  return style;
};

interface PaneShadowProps {
  paneShadowName: PaneShadowName;
  style?: React.CSSProperties;
  gridContentRange: NumericalRange;
  shouldRender?: boolean;
}

export const PaneShadow: React.FC<PaneShadowProps> = ({
  paneShadowName,
  style,
  gridContentRange,
  shouldRender = true,
}) => {
  const theme = useTheme();

  if (!shouldRender) return null;

  let boxShadow;

  if (paneShadowName === "Left") {
    boxShadow = theme.paneContainer.left.boxShadow;
  } else if (paneShadowName === "Right") {
    boxShadow = theme.paneContainer.right.boxShadow;
  } else if (paneShadowName === "Top") {
    boxShadow = theme.paneContainer.top.boxShadow;
  } else if (paneShadowName === "Bottom") {
    boxShadow = theme.paneContainer.bottom.boxShadow;
  }

  return (
    <div className={`rgPaneShadow rgPaneShadow-${paneShadowName}`} style={{ ...style, display: "contents" }}>
      <div
        className={`rgPaneShadowOverlay rgPaneShadowOverlay-${paneShadowName}`}
        style={{
          ...getPaneShadowStyle(paneShadowName, gridContentRange, theme.gap),
          boxShadow,
        }}
      />
    </div>
  );
};
