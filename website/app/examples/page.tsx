"use client";

import logo from "@/public/static/logo-green.svg";
import checkIcon from "@/public/static/check-icon.svg";
import dotIcon from "@/public/static/dot-icon.svg";
import Image from "next/image";
import { LiquidityPlanner } from "@/components/liquidity-planner";

const capabilities = [
  "This budget planner example shows the possibility of calculating values of all aggregation fields in a reactive way in two axes - for organization or project for some time. See the available functionality:",
  "Only white cells are able to change their value (all the aggregation cells will be updated accordingly)",
  "A new value entered for a certain quarter on a given node will be proportionally distributed into the months within this quarter",
  `Reorder a single row by drag & drop action onto a selected row (you can't reorder multiple rows)`,
  "Fold/unfold unit node with SPACE key (node cell has to be focused) or click on the chevron icon",
  `Add a new row by clicking 'Add child row' in the context menu option on a selected row or delete it via 'Remove row' option`,
];

const coreFeatures = [
  {
    name: "Vertical and horizontal grouping",
    docs: true,
  },
  {
    name: "Custom cell templates (e.g. non editable number cell)",
    docs: true,
  },
  {
    name: "Context menu (adding and removing row)",
    docs: true,
  },
  {
    name: "Sticky row and column",
    docs: true,
  },
  {
    name: "Row reordering",
    docs: true,
  },
  {
    name: "Range, column and row selection (+ multi selection)",
    docs: true,
  },
  {
    name: "Fill handle",
    docs: false,
  },
  {
    name: "Copy/cut/paste",
    docs: false,
  },
  {
    name: "Touch capability",
    docs: false,
  },
];

export default function ExamplesPage() {
  return (
    <section>
      <div className="grid grid-cols-main grid-rows-2 pt-[128px] pb-[40px]">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center text-black-primary px-4">
          Configurable example
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary text-center text-xs md:text-sm px-4">
          Congue dictum neque, nibh at vel turpis dignissim felis pellentesque.
          Nulla iaculis faucibus nisi nunc netus dolor.
        </p>
      </div>
      <div className="relative h-[600px] md:h-[800px] grid grid-cols-main react-grid-sample2">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 h-full shadow-reactgrid-sample rounded-t-[16px] text-[#a5a5a5] font-bold text-xl bg-white-primary">
          <div className="h-[60px] border-b-1 border-white-secondary3 flex items-center ps-5">
            <Image src={logo} alt="ReactGrid" />
          </div>
          <div className="flex" style={{ width: "100%", overflow: "auto" }}>
            <LiquidityPlanner />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-main pt-[80px] bg-white-secondary4">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary flex gap-x-16 mb-[128px] flex-col md:flex-row px-4">
          <div className="flex-1">
            <h2 className="text-black-primary font-bold text-sm">
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
            <h2 className="text-black-primary font-bold text-sm">
              Core features (applied)
            </h2>
            <ul>
              {coreFeatures.map((cf, index) => (
                <li key={index} className="my-8 flex items-start">
                  <Image src={checkIcon} alt="ReactGrid" />
                  {cf.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
