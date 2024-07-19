const HiddenFocusTarget = ({ rowIdx, colIdx }: { colIdx: number; rowIdx: number }) => {
  return (
    <div style={{ position: "absolute", bottom: 0, right: "50%" }}>
      <input
        onKeyDown={(e) => {
          // Let a 'tab' key to be triggered only by the GridWrapper onKeyDown event
          if (e.key === "Tab") e.preventDefault();
        }}
        className={`rgHiddenFocusTarget rgFocusRowIdx-${rowIdx} rgFocusColIdx-${colIdx}`}
        style={{ width: 1, height: 1, opacity: 0 }}
        inputMode="none"
      />
    </div>
  );
};

export default HiddenFocusTarget;
