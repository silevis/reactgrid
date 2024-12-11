export const headerCellsStyle: React.CSSProperties = {
  backgroundColor: "#107c41",
  fontWeight: "bold",
  color: "white",
  fontSize: 20,
  justifyContent: "center",
};

export const emptyHeaderCellStyle: React.CSSProperties = {
  borderBottom: "1px solid #c9c9c9",
};

export const creditEditableCellStyle: React.CSSProperties = {
  backgroundColor: "#e7f2ec",
  justifyContent: "flex-end",
  paddingRight: 15,
};

export const creditCellStyle: React.CSSProperties = {
  justifyContent: "flex-end",
  paddingRight: 15,
  backgroundColor: "rgb(245, 245, 245)",
};

export const creditLineOverdraftNameCellStyle: React.CSSProperties = {
  paddingLeft: 25,
  fontSize: 16,
  justifyContent: "flex-start",
  fontWeight: "bold",
};

export const creditLineOverdraftCellStyle: React.CSSProperties = {
  justifyContent: "flex-end",
  paddingRight: 15,
  fontSize: 16,
  fontWeight: "bold",
  backgroundColor: "rgb(245, 245, 245)",
};

export const totalNameCellStyle: React.CSSProperties = {
  paddingLeft: 25,
  fontSize: 16,
  fontWeight: "bold",
  justifyContent: "flex-start",
  borderBottom: "1px solid #c9c9c9",
};

export const totalCellStyle: React.CSSProperties = {
  justifyContent: "flex-end",
  paddingRight: 15,
  fontSize: 16,
  fontWeight: "bold",
  borderBottom: "1px solid #c9c9c9",
  backgroundColor: "rgb(245, 245, 245)",
};

export const cumulativeNameCellStyle: React.CSSProperties = {
  paddingLeft: 25,
  fontSize: 16,
  fontWeight: "bold",
  justifyContent: "flex-start",
  borderBottom: "1px solid #c9c9c9",
};

export const cumulativeCellStyle: React.CSSProperties = {
  justifyContent: "flex-end",
  paddingRight: 15,
  fontSize: 16,
  fontWeight: "bold",
  borderBottom: "1px solid #c9c9c9",
  backgroundColor: "rgb(245, 245, 245)",
};

export const getTotalsColumnCellStyle = (
  showBottomBorder?: boolean,
  fontSize: number = 14
): React.CSSProperties => ({
  justifyContent: "flex-end",
  paddingRight: 15,
  fontSize: fontSize,
  fontWeight: "bold",
  borderBottom: showBottomBorder ? "1px solid #c9c9c9" : "none",
  backgroundColor: "rgb(245, 245, 245)",
});

export const cashboxBankCellEditableStyle: React.CSSProperties = {
  backgroundColor: "#e7f2ec",
  justifyContent: "flex-end",
  paddingRight: 15,
};

export const cashboxBankCellStyle: React.CSSProperties = {
  backgroundColor: "rgb(245, 245, 245)",
  justifyContent: "flex-end",
  paddingRight: 15,
};

export const groupHeaderCellStyle: React.CSSProperties = {
  fontWeight: "bold",
  fontSize: 16,
  paddingLeft: 15,
  justifyContent: "flex-start",
  borderBottom: "1px solid #c9c9c9",
};

export const groupRowNameCellStyle: React.CSSProperties = {
  paddingLeft: 25,
  justifyContent: "flex-start",
};

export const summaryTitleCellStyle: React.CSSProperties = {
  paddingLeft: 25,
  justifyContent: "flex-start",
  fontWeight: "bold",
};

export const groupMonthValueCellStyle: React.CSSProperties = {
  justifyContent: "flex-end",
  paddingRight: 15,
};

export const groupMonthSummaryCellStyle: React.CSSProperties = {
  justifyContent: "flex-end",
  paddingRight: 15,
  fontWeight: "bold",
  backgroundColor: "rgb(245, 245, 245)",
};
