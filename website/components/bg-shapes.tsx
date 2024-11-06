"use client";

import { easeInOut, interpolatePaths } from "@/lib/path-interpolation";
import { useEffect } from "react";

const Shape1 = () => {
  useEffect(() => {
    const blob1 = document.getElementById("s1-blob1");
    const path1 = blob1?.getAttribute("d");
    const path2 = document.getElementById("s1-blob2")?.getAttribute("d");

    let startTime: number;
    const duration = 11000;

    const animateBlob = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration; // Normalized progress (0 to 1)
      const easedProgress = easeInOut(progress);

      if (!blob1 || !path1 || !path2) return;

      const currentPath = interpolatePaths(
        path1,
        path2,
        Math.abs(Math.sin(easedProgress * Math.PI))
      );
      blob1?.setAttribute("d", currentPath);

      requestAnimationFrame(animateBlob);
    };

    requestAnimationFrame(animateBlob);
  }, []);

  return (
    <svg id="sw-js-blob-svg" viewBox="0 0 900 600">
      <defs>
        <filter id="blur-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
        </filter>
      </defs>
      <g transform="translate(503.20737944528975 307.5059290254397)">
        <path
          id="s1-blob1"
          d="M122.9 -211.3C145.9 -199.7 141.8 -139.6 126.1 -96.3C110.5 -53 83.2 -26.5 88.9 3.2C94.5 33 133 66 147.3 107C161.6 148 151.8 197 123.2 205.6C94.7 214.3 47.3 182.7 15.4 155.9C-16.5 129.2 -33 107.5 -38.4 85.5C-43.8 63.4 -38.2 41.1 -61.7 26.8C-85.3 12.5 -138.2 6.3 -161.6 -13.5C-185.1 -33.3 -179.1 -66.7 -169.5 -105.1C-159.8 -143.5 -146.4 -186.9 -117.5 -195.1C-88.7 -203.2 -44.3 -176.1 2.8 -181C50 -185.9 100 -222.9 122.9 -211.3"
          fill="#ddfaea"
          filter="url(#blur-filter)"
        ></path>
      </g>
      <g
        transform="translate(455.61512975945845 344.3002746209114)"
        style={{ visibility: "hidden" }}
      >
        <path
          id="s1-blob2"
          d="M108.4 -174.1C122.9 -179.5 104.7 -114.7 107.4 -74C110.1 -33.3 133.5 -16.7 162.4 16.7C191.3 50 225.5 100 199.4 100C173.2 100 86.6 50 43.3 70C0 90 0 180 -19.5 213.8C-39 247.5 -78 225.1 -86.1 184.8C-94.2 144.4 -71.3 86.2 -90 52.4C-108.7 18.7 -168.8 9.3 -169.3 -0.2C-169.7 -9.8 -110.4 -19.7 -81.6 -36C-52.9 -52.3 -54.7 -75.1 -46.2 -73.2C-37.7 -71.2 -18.8 -44.6 14.1 -69C47 -93.4 94 -168.8 108.4 -174.1"
          fill="#ddfaea"
        ></path>
      </g>
    </svg>
  );
};

const Shape2 = () => {
  useEffect(() => {
    const blob1 = document.getElementById("s2-blob1");
    const path1 = blob1?.getAttribute("d");
    const path2 = document.getElementById("s2-blob2")?.getAttribute("d");

    let startTime: number;
    const duration = 11000;

    const animateBlob = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration; // Normalized progress (0 to 1)
      const easedProgress = easeInOut(progress);

      if (!blob1 || !path1 || !path2) return;

      const currentPath = interpolatePaths(
        path1,
        path2,
        Math.abs(Math.sin(easedProgress * Math.PI))
      );
      blob1?.setAttribute("d", currentPath);

      requestAnimationFrame(animateBlob);
    };

    requestAnimationFrame(animateBlob);
  }, []);

  return (
    <svg id="sw-js-blob-svg" viewBox="0 0 900 600">
      <defs>
        <filter id="blur-filter" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
        </filter>
      </defs>
      <g transform="translate(498.09424226879196 317.19939130430964)">
        <path
          id="s2-blob1"
          d="M27 -58.9C51.9 -32.3 100.9 -59.4 100.4 -58.5C99.9 -57.7 49.9 -28.8 34.8 -8.8C19.6 11.3 39.3 22.7 64.3 66C89.3 109.3 119.6 184.5 109.8 201.5C100 218.5 50 177.3 14.4 152.3C-21.2 127.3 -42.3 118.7 -73.9 114.2C-105.6 109.8 -147.6 109.7 -171.5 91.3C-195.4 73 -201.2 36.5 -205 -2.2C-208.7 -40.8 -210.5 -81.7 -199.8 -122.9C-189.1 -164.2 -166.1 -206 -130.7 -226.5C-95.3 -247.1 -47.7 -246.6 -23.3 -206.1C1 -165.7 2 -85.5 27 -58.9"
          fill="#ddfaea"
          filter="url(#blur-filter)"
        ></path>
      </g>

      <g
        transform="translate(493.6085912402424 285.15022080606263)"
        style={{ visibility: "hidden" }}
      >
        <path
          id="s2-blob2"
          d="M45.4 -122.1C47.4 -77.4 29.7 -42.2 50.6 -23.4C71.4 -4.7 130.7 -2.3 143.4 7.3C156.1 17 122.2 34 90.6 34C58.9 34 29.4 17 14.7 58.5C0 100 0 200 -18 231.2C-36 262.4 -72 224.7 -98.4 190C-124.8 155.2 -141.7 123.4 -172.8 92.2C-204 61 -249.5 30.5 -227.6 12.7C-205.6 -5.2 -116.2 -10.3 -72.9 -20.4C-29.6 -30.5 -32.3 -45.6 -27.8 -88.8C-23.3 -132.1 -11.7 -203.5 5 -212.2C21.7 -220.9 43.3 -166.7 45.4 -122.1"
          fill="#ddfaea"
        ></path>
      </g>
    </svg>
  );
};

export { Shape1, Shape2 };
