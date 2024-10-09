import { useState, useEffect } from "react";

export const useIsScreenWidthLessThan = (breakpoint: number) => {
  const [isLessThan, setIsLessThan] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

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
