import { useState, useEffect } from "react";

export const useIsScreenWidthLessThan = (breakpoint: number) => {
  const [isLessThan, setIsLessThan] = useState(window.innerWidth <= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsLessThan(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isLessThan;
};
