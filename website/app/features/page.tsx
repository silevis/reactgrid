import Image from "next/image";
import feature1 from "@/public/static/feature1.svg";
import feature2 from "@/public/static/feature2.svg";
import feature3 from "@/public/static/feature3.svg";
import feature4 from "@/public/static/feature4.svg";
import feature5 from "@/public/static/feature5.svg";
import feature6 from "@/public/static/feature6.svg";
import feature7 from "@/public/static/feature7.svg";
import feature8 from "@/public/static/feature8.svg";
import feature9 from "@/public/static/feature9.svg";

const featuresList = [
  {
    title: "Fill handle",
    desc: "Clone cell data and its properties with fill handle like in other spreadsheets",
    icon: feature1,
    docs: false,
  },
  {
    title: "Spreadsheet-like look and feel",
    desc: "Clone cell data and its properties with fill handle like in other spreadsheets",
    icon: feature2,
    docs: false,
  },
  {
    title: "Area selection",
    desc: "Choose multiple areas of choice in any way you like",
    icon: feature3,
    docs: false,
  },
  {
    title: "Column Resize",
    desc: "Modify the width of each column with drag&drop capability",
    icon: feature4,
    docs: true,
  },
  {
    title: "Column reordering",
    desc: "Select columns, drag them and drop at the desired destination",
    icon: feature5,
    docs: true,
  },
  {
    title: "Row reordering",
    desc: "Select rows, drag them and drop at the desired destination",
    icon: feature6,
    docs: true,
  },
  {
    title: "Sticky columns and rows",
    desc: "You're able to lock specific rows or columns so that they are always visible when scrolling",
    icon: feature7,
    docs: true,
  },
  {
    title: "Copy, cut, paste",
    desc: "Let users copy/cut/paste data inside the grid and apply changes, then move the data back to where it was taken from",
    icon: feature8,
    docs: false,
  },
  {
    title: "Optimized for Touch devices",
    desc: "ReactGrid is adapted for usage on touch devices",
    icon: feature9,
    docs: false,
  },
];

export default function FeaturesPage() {
  return (
    <section>
      <div className="grid grid-cols-main pt-[128px] pb-[128px]">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center text-black-primary">
          Features
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary text-center text-xs md:text-sm px-4">
          Congue dictum neque, nibh at vel turpis dignissim felis pellentesque.
          Nulla iaculis faucibus nisi nunc netus dolor.
        </p>
      </div>
      <div className="grid grid-cols-main mb-[250px]">
        <div className="col-start-2 col-end-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-16 gap-y-16 xl:gap-y-32">
          {featuresList.map((feature, index) => {
            return (
              <div
                key={index}
                className="col-span-1 flex flex-col items-center gap-y-4 border-2 border-white-primary"
              >
                <Image
                  src={feature.icon}
                  alt="ReactGrid"
                  priority
                  width={300}
                  className="w-[150px] md:w-auto"
                />
                <h2 className="text-black-primary font-bold text-sm">
                  {feature.title}
                </h2>
                <p className="text-black-secondary text-center px-4 md:px-16">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
