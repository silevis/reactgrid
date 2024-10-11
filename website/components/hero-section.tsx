"use client";
import { BsFillRocketTakeoffFill, BsGithub } from "react-icons/bs";
import Link from "next/link";
import NumberTicker from "./ui/number-ticker";
import { useIsScreenWidthLessThan } from "@/hooks/useIsScreenWidthLessThan";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "./ui/animated-grid-pattern";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import { MagicCard } from "./ui/magic-card";

export const HeroSection = () => {
  const getRandomDecimalPlaces = () => Math.floor(Math.random() * 3);
  const getRandomValue = () => Math.floor(Math.random() * 95) + 5;
  const shouldHideNumbers = useIsScreenWidthLessThan(640);
  const [starsCount, setStarsCount] = useState(0);

  useEffect(() => {
    fetch("https://api.github.com/repos/silevis/reactgrid")
      .then((response) => response.json())
      .then((data) => {
        setStarsCount(data.stargazers_count);
      });
  }, []);

  return (
    <div className="pb-4 box-border font-dm-sans bg-green-primary text-md 2xl:text-xl text-white-primary hero-section grid grid-cols-main grid-rows-header-xs sm:grid-rows-header">
      <div className="hidden 2xl:block border-b-1 border-l-1 border-green-light col-start-1 col-end-3 row-start-1 row-end-7"></div>
      <div className="relative title-text border-2 md:border-3 border-green-light col-start-1 2xl:col-start-3 col-end-13 md:col-end-11 2xl:col-end-9 row-start-1 row-span-3 sm:row-span-6 t flex justify-items-center items-center p-[20px] sm:p-[40px] overflow-hidden">
        <h1 className="relative text-xl sm:text-2xl xl:text-3xl font-bold z-10">
          Spreadsheet experience for your React app
        </h1>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(650px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
          )}
        />
      </div>
      <div className="col-start-9 col-end-11 font-bold hidden 2xl:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.05}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="border-l-1 border-r-1 border-green-light col-start-11 col-end-13 row-start-1 row-span-2 font-bold hidden md:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.1}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="border-t-1 border-green-light col-start-9 col-end-11 font-bold hidden 2xl:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.15}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="border-t-1 border-green-light col-start-9 col-end-11 font-bold hidden 2xl:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.2}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="border-t-1 border-l-1 border-r-1 border-green-light col-start-11 col-end-13 font-bold hidden md:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.25}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="border-t-1 border-green-light col-start-9 col-end-11 font-bold hidden 2xl:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.3}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="border-t-1 border-l-1 border-r-1 border-green-light col-start-11 col-end-13 font-bold hidden md:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.35}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="border-t-1 border-b-1 border-green-light col-start-9 font-bold col-end-11 font-bold hidden 2xl:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.4}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="inline-block border-t-1 border-r-1 border-l-1 border-b-1 border-green-light col-start-11 col-end-13 row-start-5 row-span-2 font-bold hidden md:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.45}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="border-b-1 border-green-light col-start-9 col-end-11 font-bold hidden 2xl:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.5}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="inline-block border-l-1 border-b-1 border-r-1 border-green-light md:border-r-0 col-start-1 2xl:col-start-3 col-end-13 sm:col-end-9 md:col-end-7 row-start-4 sm:row-start-7 row-span-2 text-xs sm:text-sm lg:text-md flex justify-center items-center p-[20px] sm:p-[40px]">
        <h2>
          ReactGrid is an open-source React component for displaying and editing
          data in a spreadsheet-like way.
        </h2>
      </div>
      <div className="inline-block border-l-1 border-b-1 border-green-light col-start-7 col-end-9 row-start-7 row-span-2 font-bold hidden md:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.55}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="hidden border-l-1 border-b-1 border-green-light col-start-9 col-end-11 row-start-7 row-span-2 font-bold sm:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.6}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="hidden border-l-1 border-b-1 border-r-1 border-green-light col-start-11 col-end-13 row-start-7 font-bold row-span-2 sm:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.65}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <MagicCard
        className="inline-block border-l-1 border-b-1 border-green-light col-start-1 2xl:col-start-3 col-end-7 md:col-end-4 2xl:col-end-5 row-start-6 sm:row-start-9 bg-green-secondary flex items-center justify-center"
        gradientColor={"#D9D9D955"}
      >
        <Link
          href="/docs/5.0/1-getting-started"
          className="w-full h-full flex sm:flex-row flex-wrap justify-center items-center text-2xs sm:text-xs gap-2 bg-green-secondary p-2 md:pl-4"
        >
          Get Started <BsFillRocketTakeoffFill />
        </Link>
      </MagicCard>
      <MagicCard
        className="group inline-block border-l-1 border-b-1 border-r-1 md:border-r-0 border-green-light col-start-7 md:col-start-4 2xl:col-start-5 col-end-13 md:col-end-7 row-start-6 sm:row-start-9 bg-green-secondary flex items-center justify-center sm:justify-start"
        gradientColor={"#D9D9D955"}
      >
        <Link
          href="https://github.com/silevis/reactgrid"
          target="_blank"
          className="w-full h-full flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start 2xl:justify-center items-center content-center text-2xs sm:text-xs gap-2 bg-green-secondary p-2 sm:pl-4"
        >
          <div className="relative z-10 flex items-center gap-x-1">
            <BsGithub /> Stars on Github
          </div>
          <div className="relative z-10 flex items-center gap-x-1 md:min-w-[90px] h-[18px] sm:h-[24px]">
            <FaStar className="text-[#f4df50] md:text-white-primary group-hover:text-[#f4df50] transition-colors duration-200" />
            <NumberTicker
              value={starsCount}
              delay={0.65}
              decimalPlaces={getRandomDecimalPlaces()}
            />
          </div>
        </Link>
      </MagicCard>
      <div className="inline-block border-l-1 border-b-1 border-green-light col-start-7 col-end-9 xl:col-end-8 row-start-9 font-bold hidden md:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.7}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="inline-block border-l-1 border-r-1 border-green-light xl:border-r-0 border-b-1 col-start-9 xl:col-start-8 col-end-11 xl:col-end-9 row-start-9 font-bold hidden md:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.75}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="inline-block border-l-1 border-b-1 border-green-light col-start-9 col-end-10 row-start-9 font-bold hidden xl:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.8}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
      <div className="inline-block border-l-1 border-b-1 border-r-1 border-green-light col-start-10 col-end-11 row-start-9 font-bold hidden xl:flex justify-center items-center text-green-secondary">
        {!shouldHideNumbers && (
          <NumberTicker
            value={getRandomValue()}
            delay={0.85}
            decimalPlaces={getRandomDecimalPlaces()}
          />
        )}
      </div>
    </div>
  );
};
