import Image from "next/image";
import stylingIcon from "@/public/static/styling-icon.svg";
import browsers from "@/public/static/browsers.svg";
import treeData from "@/public/static/tree-data.svg";
import customCellTemplates from "@/public/static/custom-cell-templates.svg";

export const FeaturesSecondarySection = () => {
  return (
    <section className="bg-green-primary pb-[200px] mt-[128px] md:mt-[256px]">
      <div className="grid grid-cols-main justify-items-center py-[50px] md:py-[128px]">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center text-white-primary">
          Header for this section
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-center text-xs md:text-sm px-4 text-white-secondary max-w-[700px]">
          Congue dictum neque, nibh at vel turpis dignissim felis pellentesque.
          Nulla iaculis faucibus nisi nunc netus dolor.
        </p>
      </div>
      <div className="grid grid-cols-main sm:grid-rows-2 gap-y-16 xl:gap-y-32">
        <div className="col-start-1 col-span-12 sm:col-span-6 md:col-start-2 md:col-span-5 xl:col-start-3 xl:col-span-4 flex flex-col items-center gap-y-4">
          <Image
            src={stylingIcon}
            alt="ReactGrid"
            width={300}
            className="w-[150px] md:w-auto"
          />
          <h2 className="text-white-primary font-bold text-sm">
            Emotion styling
          </h2>
          <p className="text-white-secondary text-center px-4 md:px-16">
            Feel free to customly style each element of grid using Emotion
          </p>
        </div>
        <div className="col-start-1 col-span-12 sm:col-start-7 sm:col-span-6 md:col-span-5 xl:col-start-7 xl:col-span-4 flex flex-col items-center gap-y-4">
          <Image
            src={customCellTemplates}
            alt="ReactGrid"
            width={300}
            className="w-[150px] md:w-auto"
          />
          <h2 className="text-white-primary font-bold text-sm">
            Custom cell templates
          </h2>
          <p className="text-white-secondary text-center px-4 md:px-16">
            Add your own custom cell (custom cell behaviors, styles, data
            formatting and validating)
          </p>
        </div>
        <div className="col-start-1 col-span-12 sm:col-span-6 md:col-start-2 md:col-span-5 xl:col-start-3 xl:col-span-4 flex flex-col items-center gap-y-4">
          <Image
            src={browsers}
            alt="ReactGrid"
            width={300}
            className="w-[150px] md:w-auto"
          />
          <h2 className="text-white-primary font-bold text-sm">
            Cross-browser support
          </h2>
          <p className="text-white-secondary text-center px-4 md:px-16">
            ReactGrid performs efficiently in all modern browsers
          </p>
        </div>
        <div className="col-start-1 col-span-12 sm:col-start-7 sm:col-span-6 md:col-span-5 xl:col-start-7 xl:col-span-4 flex flex-col items-center gap-y-4">
          <Image
            src={treeData}
            alt="ReactGrid"
            width={300}
            className="w-[150px] md:w-auto"
          />
          <h2 className="text-white-primary font-bold text-sm">Tree data</h2>
          <p className="text-white-secondary text-center px-4 md:px-16">
            You can easily display data that has parent/child relationships
          </p>
        </div>
      </div>
    </section>
  );
};
