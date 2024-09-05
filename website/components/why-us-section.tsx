import Image from "next/image";
import illustration1 from "@/public/static/illustration1.svg";
import illustration2 from "@/public/static/illustration2.svg";
import illustration3 from "@/public/static/illustration3.svg";

export const WhyUsSection = () => {
  return (
    <section>
      <div className="grid grid-cols-main grid-rows-2 mt-[128px] md:mt-[256px]">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center text-black-primary">
          Why is ReactGrid unique?
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-center text-xs md:text-sm px-4 text-black-secondary">
          Congue dictum neque, nibh at vel turpis dignissim felis pellentesque.
          Nulla iaculis faucibus nisi nunc netus dolor.
        </p>
      </div>
      <div className="grid grid-cols-main mt-[40px]">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 flex justify-around xl:justify-between flex-wrap gap-y-16 xl:gap-y-16 xl:gap-x-16">
          <div className="flex flex-initial xl:flex-1 w-full md:w-[46%] xl:w-auto flex-col items-center gap-y-4">
            <Image
              src={illustration1}
              alt="ReactGrid"
              width={300}
              className="w-[150px] md:w-auto"
            />
            <h2 className="text-black-primary font-bold text-sm">
              Open source
            </h2>
            <p className="text-black-secondary2 text-center px-4">
              ReactGrid follows an open-source development model, allowing free
              access, modification, and distribution of its source code.
            </p>
          </div>
          <div className="flex flex-initial xl:flex-1 w-full md:w-[46%] xl:w-auto flex-col items-center gap-y-4">
            <Image
              src={illustration2}
              alt="ReactGrid"
              width={300}
              className="w-[150px] md:w-auto"
            />

            <h2 className="text-black-primary font-bold text-sm">
              Place any cell anywhere
            </h2>
            <p className="text-black-secondary2 text-center px-4">
              ReactGrid is fully customizable and extensible. You can literally
              place any cell type anywhere in the grid.
            </p>
          </div>
          <div className="flex flex-initial xl:flex-1 w-full md:w-[46%] xl:w-auto flex-col items-center gap-y-4">
            <Image
              src={illustration3}
              alt="ReactGrid"
              width={300}
              className="w-[150px] md:w-auto"
            />
            <h2 className="text-black-primary font-bold text-sm">
              Optimized for touch devices
            </h2>
            <p className="text-black-secondary2 text-center px-4">
              ReactGrid gives the same experience to you no matter if you work
              on desktop or mobile devices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
