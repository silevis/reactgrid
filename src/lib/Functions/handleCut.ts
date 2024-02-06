export const handleCut = (): void => {
  const elements = document.querySelectorAll(".rg-partial-area-cut-range");
  const selectedElement = elements[0];
  // Adds an ant line effect to the clipped cell
  selectedElement?.classList?.add("cut-ant-line-box");

  // Set a timer to remove the effect after a certain amount of time
  setTimeout(function () {
    selectedElement?.classList?.remove("cut-ant-line-box");
  }, 60000);
};
