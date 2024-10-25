"use client";

import logo from "@/public/static/logo-green.svg";
import checkIcon from "@/public/static/check-icon.svg";
import dotIcon from "@/public/static/dot-icon.svg";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DynamicLiquidityPlanner = dynamic(
  () =>
    import("../../components/liquidity-planner").then(
      (mod) => mod.LiquidityPlanner
    ),
  {
    loading: () => (
      <div className="min-h-[750px] w-full 2xl:w-[1280px]">
        <Skeleton
          containerClassName="block h-full leading-none"
          borderRadius={0}
          height={"100%"}
          baseColor="white"
          highlightColor="#daffec"
          className="w-full leading-none"
        />
      </div>
    ),
    ssr: false,
  }
);

const capabilities = [
  "This liquidity planner example shows the possibility of calculating values of all aggregation fields in a reactive way.",
  "You can place new values only in light green cells (credit line, opening balance) or white cells (cash inflows and outflows). Grayed-out cells are read-only.",
  "Groups are aggregated vertically into total inflows and outflows per month, with yearly totals presented in the last column.",
  "The 'Total' row sums up 'Cash in' and 'Cash out' and updates automatically when data changes.",
  "The 'Cumulative row' calculates the running total by adding 'Cash in' and subtracting 'Cash out' from the cash in the bank.",
  "Users can update the credit line, which remains constant across all months, and the 'Credit line overdraft' cell displays if the cumulative value exceeds the credit line.",
  "Use key shortcuts to quickly navigate and perform actions within the planner.",
];

const coreFeatures = [
  {
    name: "Multiple cell templates",
    docs: "/docs/5.0/3-cell-templates",
  },
  {
    name: "Sticky row and column",
    docs: "/docs/5.0/2-implementing-core-features/4-sticky",
  },
  {
    name: "Range and row selection",
    docs: "",
  },
  {
    name: "Fill handle",
    docs: "/docs/5.0/2-implementing-core-features/5-fill-handle",
  },
  {
    name: "Copy/cut/paste",
    docs: "/docs/5.0/2-implementing-core-features/10-copy-cut-paste",
  },
  {
    name: "Touch capability",
    docs: "",
  },
];

export default function ExamplesPage() {
  return (
    <section className="flex-1">
      <div className="grid grid-cols-main pt-12 md:pt-32 pb-[40px]">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center p-4 bg-gradient-to-t from-green-primary to-green-light bg-clip-text text-transparent">
          ReactGrid Demo
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary text-center text-xs md:text-sm px-4 max-w-screen-2xl mx-auto">
          ReactGrid enables you to create custom layouts with flexible cell
          ordering. Unlike many React components and tools that require
          consistent data structures across all rows, our component offers
          greater flexibility. As an example, we&apos;ll show you how to build a
          liquidity planner—an app that helps you plan for your long-term
          financial goals. Our app allows you to input, aggregate, and analyze
          projected cash flows
        </p>
      </div>
      <div className="relative grid grid-cols-main react-grid-sample2 2xl:justify-items-center">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 h-full shadow-reactgrid-sample rounded-t-[16px] text-[#a5a5a5] font-bold text-xl bg-white-primary max-w-[1280px]">
          <div className="h-[60px] flex items-center ps-5">
            <Image src={logo} alt="ReactGrid" />
          </div>
          <div
            id="liquidity-planner-container"
            className="flex"
            style={{ maxHeight: 750, width: "100%", overflow: "auto" }}
          >
            <DynamicLiquidityPlanner />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-main pt-[80px] texture-bg-2">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary flex gap-x-16 mb-[128px] flex-col md:flex-row px-4 max-w-screen-2xl mx-auto">
          <div className="flex-1">
            <h2 className="text-green-primary font-bold text-sm">
              What does the above example illustrate?
            </h2>
            <ul>
              {capabilities.map((name, index) => (
                <li key={index} className="my-8 flex items-start">
                  <Image src={dotIcon} alt="ReactGrid" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h2 className="text-green-primary font-bold text-sm">
              Core features (applied)
            </h2>
            <ul>
              {coreFeatures.map((cf, index) => (
                <li key={index} className="my-8 flex items-start">
                  <Image src={checkIcon} alt="ReactGrid" />
                  {cf.name}
                  {cf.docs && (
                    <Link
                      href={cf.docs}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-primary underline ml-2"
                    >
                      (check docs)
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
