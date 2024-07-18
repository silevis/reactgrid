const HiddenFocusTarget = ({ rowIdx, colIdx }: { colIdx: number; rowIdx: number }) => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0 }}>
      <input
        onKeyDown={(e) => {
          // Let a 'tab' key to be triggered only by the GridWrapper onKeyDown event
          if (e.key === "Tab") e.preventDefault();
        }}
        className={`rgHiddenFocusTarget rgFocusRowIdx-${rowIdx} rgFocusColIdx-${colIdx}`}
        style={{ width: 5, height: 5, opacity: 1 }}
        inputMode="none"
      />
    </div>
  );
};

export default HiddenFocusTarget;
