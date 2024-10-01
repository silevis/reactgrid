"use client";

import logo from "@/public/static/logo-green.svg";
import checkIcon from "@/public/static/check-icon.svg";
import dotIcon from "@/public/static/dot-icon.svg";
import Image from "next/image";
import { LiquidityPlanner } from "@/components/liquidity-planner";

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
    docs: process.env.NEXT_PUBLIC_BASE_URL + "/docs/5.0/3-cell-templates",
  },
  {
    name: "Sticky row and column",
    docs:
      process.env.NEXT_PUBLIC_BASE_URL +
      "/docs/5.0/2-implementing-core-features/4-sticky",
  },
  {
    name: "Range and row selection",
    docs: "",
  },
  {
    name: "Fill handle",
    docs:
      process.env.NEXT_PUBLIC_BASE_URL +
      "/docs/5.0/2-implementing-core-features/5-fill-handle",
  },
  {
    name: "Copy/cut/paste",
    docs:
      process.env.NEXT_PUBLIC_BASE_URL +
      "/docs/5.0/2-implementing-core-features/10-copy-cut-paste",
  },
  {
    name: "Touch capability",
    docs: "",
  },
];

export default function ExamplesPage() {
  return (
    <section>
      <div className="grid grid-cols-main pt-12 md:pt-32 pb-[40px]">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center text-green-primary p-4">
          Configurable example
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary text-center text-xs md:text-sm px-4">
          ReactGrid allows you to compose your view with an arbitrary cell
          order. In many components and tools in React ecosystem you have to
          keep the same data schema in all rows. Our component breaks out from
          the frame. For example, we will demonstrate how to build a liquidity
          planner—an app that provides a strategy for long-term financial
          planning. Our app will enable entering, aggregating, and evaluating
          planned cash flows.
        </p>
      </div>
      <div className="relative grid grid-cols-main react-grid-sample2 xl:justify-items-center">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 h-full shadow-reactgrid-sample rounded-t-[16px] text-[#a5a5a5] font-bold text-xl bg-white-primary max-w-[1280px]">
          <div className="h-[60px] flex items-center ps-5">
            <Image src={logo} alt="ReactGrid" />
          </div>
          <div
            id="liquidity-planner-container"
            className="flex"
            style={{ maxHeight: 750, width: "100%", overflow: "auto" }}
          >
            <LiquidityPlanner />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-main pt-[80px] bg-white-secondary4">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary flex gap-x-16 mb-[128px] flex-col md:flex-row px-4">
          <div className="flex-1">
            <h2 className="text-green-primary font-bold text-sm">
              Capabilities
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
                    <a
                      href={cf.docs}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-primary underline ml-2"
                    >
                      (check docs)
                    </a>
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
