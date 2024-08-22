import React, { useState } from "react";
import { useReactGridAPI } from "../../lib/main";

export const GridApi = () => {
  const gridApi = useReactGridAPI("big-grid")!;

  const [startColIdx, setStartColIdx] = useState(0);
  const [startRowIdx, setStartRowIdx] = useState(0);
  const [endColIdx, setEndColIdx] = useState(0);
  const [endRowIdx, setEndRowIdx] = useState(0);
  const [focusedRowIdx, setFocusedRowIdx] = useState(1);
  const [focusedColIdx, setFocusedColIdx] = useState(1);
  const [output, setOutput] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSetSelectedArea = () => {
    const range = { startColIdx, startRowIdx, endColIdx, endRowIdx };
    gridApi.setSelectedArea(range);
  };

  const handleSetFocusedCell = () => {
    const location = { rowIndex: focusedRowIdx, colIndex: focusedColIdx };
    gridApi.setFocusedCell(location);
  };

  const handleSetSelectedColumns = () => {
    gridApi.setSelectedColumns(startColIdx, endColIdx);
  };

  const handleSetSelectedRows = () => {
    gridApi.setSelectedRows(startRowIdx, endRowIdx);
  };

  const handleGetFocusedCell = () => {
    const focusedCell = gridApi.getFocusedCell();
    setOutput(JSON.stringify(focusedCell, null, 2));
  };
  const handleGetCell = () => {
    const cell = gridApi.getCellByIndexes(focusedRowIdx, focusedColIdx);
    setOutput(JSON.stringify(cell, null, 2));
  };

  const handleGetSelectedArea = () => {
    const selectedArea = gridApi.getSelectedArea();
    setOutput(JSON.stringify(selectedArea, null, 2));
  };

  const handleGetPageRanges = () => {
    const paneRanges = gridApi.getPaneRanges();
    setOutput(JSON.stringify(paneRanges, null, 2));
  };

  const handleGetCellOrSpanMemberByIndexes = () => {
    const getCellOrSpanMemberByIndexes = gridApi.getCellOrSpanMemberByIndexes(focusedRowIdx, focusedColIdx);
    setOutput(JSON.stringify(getCellOrSpanMemberByIndexes, null, 2));
  };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", alignItems: "center", columnGap: 8 }}>
        <button onClick={() => setIsExpanded(!isExpanded)} style={toggleButtonStyle}>
          {isExpanded ? "Collapse" : "Expand"}
        </button>
        <h3 style={{ margin: 0 }}>Grid Api methods</h3>
      </div>
      {isExpanded && (
        <>
          <div style={columnContainerStyle}>
            <div style={columnStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Start Column Index:</label>
                <input
                  type="number"
                  value={startColIdx}
                  onChange={(e) => setStartColIdx(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Start Row Index:</label>
                <input
                  type="number"
                  value={startRowIdx}
                  onChange={(e) => setStartRowIdx(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>End Column Index:</label>
                <input
                  type="number"
                  value={endColIdx}
                  onChange={(e) => setEndColIdx(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>End Row Index:</label>
                <input
                  type="number"
                  value={endRowIdx}
                  onChange={(e) => setEndRowIdx(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={columnStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Focused Row Index:</label>
                <input
                  type="number"
                  value={focusedRowIdx}
                  onChange={(e) => setFocusedRowIdx(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Focused Column Index:</label>
                <input
                  type="number"
                  value={focusedColIdx}
                  onChange={(e) => setFocusedColIdx(Number(e.target.value))}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>
          <div style={buttonGroupStyle}>
            <button onClick={handleSetSelectedArea} style={buttonStyle}>
              Set Selected Area
            </button>
            <button onClick={handleSetFocusedCell} style={buttonStyle}>
              Set Focused Cell
            </button>
            <button onClick={handleSetSelectedColumns} style={buttonStyle}>
              Set Selected Columns
            </button>
            <button onClick={handleSetSelectedRows} style={buttonStyle}>
              Set Selected Rows
            </button>
            <button onClick={handleGetFocusedCell} style={buttonStyle}>
              Get Focused Cell
            </button>
            <button onClick={handleGetSelectedArea} style={buttonStyle}>
              Get Selected Area
            </button>
            <button onClick={handleGetPageRanges} style={buttonStyle}>
              Get Pane Ranges
            </button>
            <button onClick={handleGetCell} style={buttonStyle}>
              Get Cell
            </button>
            <button onClick={handleGetCellOrSpanMemberByIndexes} style={buttonStyle}>
              Get Cell Or SpanMember
            </button>
          </div>
          <textarea value={output} readOnly style={textareaStyle} />
        </>
      )}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "20px",
  border: "1px solid #ccc",
  backgroundColor: "#f9f9f9",
  maxWidth: "600px",
  margin: "25px 0",
};

const columnContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
};

const columnStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  margin: "0 10px",
};

const inputGroupStyle: React.CSSProperties = {
  marginBottom: "10px",
  display: "flex",
  flexDirection: "column",
};

const labelStyle: React.CSSProperties = {
  marginBottom: "5px",
  fontWeight: "bold",
};

const inputStyle: React.CSSProperties = {
  padding: "5px",
  border: "1px solid #ccc",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  flexDirection: "column",
  gap: "10px",
  marginTop: "20px",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px",
  border: "none",
  backgroundColor: "#32a852",
  color: "white",
  cursor: "pointer",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  height: "150px",
  marginTop: "20px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontFamily: "monospace",
  fontSize: "14px",
};

const toggleButtonStyle: React.CSSProperties = {
  padding: "10px",
  border: "none",
  backgroundColor: "#32a852",
  color: "white",
  cursor: "pointer",
  marginBottom: "10px",
};
