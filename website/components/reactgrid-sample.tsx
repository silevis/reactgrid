import logo from "@/public/static/logo-green.svg";
import Image from "next/image";
import BlurFade from "./ui/blur-fade";
import { cn } from "@/lib/utils";
import GridPattern from "./ui/grid-pattern";
import Link from "next/link";

export default function ReactGridMainExample() {
  return (
    <div className="text-white-primary font-dm-sans">
      <div className="relative grid grid-cols-main  bg-green-primary pt-12 pb-12 md:pt-32">
        <BlurFade
          className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 z-10"
          delay={0.1}
          inView
        >
          <h1 className="text-md sm:text-xl md:text-2xl px-4 font-bold text-center">
            ReactGrid component
          </h1>
        </BlurFade>
        <BlurFade
          className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 z-10"
          delay={0.25}
          inView
        >
          <p className="text-center text-xs md:text-sm px-4 py-4">
            Display your data in the most effective way for your specific needs.
            With flexible options for organizing information, you can create
            intuitive and clear tables that facilitate analysis and
            presentation. You can customize the layout, formatting, and
            interactivity to achieve the perfect solution for your project.
          </p>
          <div className="flex justify-center">
            <Link className="inline-block text-center underline" href="/demo">
              Try demo
            </Link>
          </div>
        </BlurFade>
        <GridPattern
          width={30}
          height={30}
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className={cn(
            "[mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
          )}
        />
      </div>
      <div className="react-grid-sample relative bg-green-secondary grid grid-cols-main">
        <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-4 xl:col-end-10 bg-white-primary shadow-reactgrid-sample rounded-t-[16px] text-[#a5a5a5] font-bold text-xl">
          <div className="h-[60px] flex items-center ps-5">
            <Image src={logo} alt="ReactGrid" />
          </div>
          <div className="flex justify-center items-center">
            <video autoPlay loop muted className="w-full h-auto">
              <source
                src={`${
                  process.env.NEXT_PUBLIC_BASE_PATH || ""
                }/static/liquidity-planner.webm`}
                type="video/webm"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
