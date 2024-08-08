import logo from "@/public/static/logo-green.svg";
import Image from "next/image";


/**
 * PreviewWindow Component Props
 * @typedef {Object} PreviewWindowProps
 * @property {React.ReactNode} children - The content to be rendered within the PreviewWindow.
 * @property {string} [title] - The title of the PreviewWindow (optional).
 * @property {boolean} [darkModePreview=false] - A boolean indicating whether the <htmL> (documentElement) is in dark mode (optional, default is false).
 */


/**
 * PreviewWindow Component
 * @param {PreviewWindowProps} props - The props for the PreviewWindow component.
 * @returns {JSX.Element} A React JSX element representing the PreviewWindow component.
 */

export default function PreviewWindow({
  children,
  title,
  darkModePreview = false,
}: {
  children: any;
  title?: string;
  darkModePreview?: boolean;
}) {
  return (
    <div className="col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 h-full bg-white-primary shadow-reactgrid-sample rounded-[16px] overflow-hidden dark:text-white-primary dark:bg-black-primary">
      <div
        className={`h-[60px] flex items-center ps-5 gap-6`}
      >
        {/* TODO: Add dark/light logo based on tailwind dark-mode feature (html class dark) */}
        <Image src={logo} alt="ReactGrid"  />
        <p className="bold font-bold block w-full text-lg ">{title}</p>
      </div>
      <div
        className={`flex h-full overflow-auto ${
          darkModePreview
            ? "dark:text-white-primary dark:bg-black-primary"
            : "dark:text-black-primary dark:bg-white-primary"
        }`}
      >
        {children ? children : "Placeholder."}
      </div>
    </div>
  );
}
