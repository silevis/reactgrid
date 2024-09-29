import logo from "@/public/static/logo-green.svg";
import Image from "next/image";

export default function ReactGridMainExample() {
  return (
    <div className="text-white-primary font-dm-sans">
      <div className="grid grid-cols-main  bg-green-primary pt-12 pb-12 md:pt-32 md:pb-24">
        <h1 className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-md sm:text-xl md:text-2xl px-4 font-bold text-center">
          ReactGrid component
        </h1>
        <p className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-center text-xs md:text-sm px-4 py-4">
          Present your data in a way that best meets your needs. With flexible
          options for organizing information, you can create intuitive and clear
          tables that facilitate analysis and presentation. You can customize
          the layout, formatting, and interactivity to achieve the perfect
          solution for your project.
        </p>
      </div>
      <div className="react-grid-sample relative bg-green-secondary grid grid-cols-main">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 bg-white-primary shadow-reactgrid-sample rounded-t-[16px] text-[#a5a5a5] font-bold text-xl">
          <div className="h-[60px] flex items-center ps-5">
            <Image src={logo} alt="ReactGrid" />
          </div>
          <div className="flex justify-center items-center">
            <video autoPlay loop muted className="w-full h-auto">
              <source src="/static/liquidity-planner.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
