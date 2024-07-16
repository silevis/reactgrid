const HiddenFocusTarget = ({ rowIdx, colIdx }: { colIdx: number; rowIdx: number }) => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0 }}>
      <input
        className={`rgHiddenFocusTarget rgFocusRowIdx-${rowIdx} rgFocusColIdx-${colIdx}`}
        style={{ width: 5, height: 5, opacity: 1 }}
        inputMode="none"
      />
    </div>
  );
};

export default HiddenFocusTarget;
