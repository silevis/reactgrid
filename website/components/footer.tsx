import githubIcon from "@/public/static/github.svg";
import npmIcon from "@/public/static/npm.svg";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="relative z-5 texture-bg grid grid-cols-main bg-black-primary py-[40px] gap-y-12 md:gap-y-32">
      <div className="flex justify-between gap-y-8 md:gap-y-16 col-start-3 col-end-11 flex-wrap lg:flex-nowrap">
        <div className="w-[100%] sm:w-[50%] lg:w-auto">
          <h2 className="font-bold text-green-primary text-sm mb-4 md:mb-[32px]">
            Info
          </h2>
          <ul className="text-white-secondary3 flex flex-col gap-y-2 font-bold">
            {/* <Link href="/cookies">Cookies</Link> */}
            <Link href="/privacy-policy">Privacy Policy</Link>
          </ul>
        </div>
        <div className="w-[100%] sm:w-[50%] lg:w-auto">
          <h2 className="font-bold text-green-primary text-sm mb-4 md:mb-[32px]">
            Explore
          </h2>
          <ul className="text-white-secondary3 flex flex-col gap-y-2 font-bold">
            <li>
              <Link href="/demo">Demo</Link>
            </li>
            <li>
              <Link href="/docs/5.0/1-getting-started">Documentation</Link>
            </li>
            <li>
              <Link href="/support">Support</Link>
            </li>
          </ul>
        </div>
        <div className="w-[100%] sm:w-[50%] lg:w-auto">
          <h2 className="font-bold text-green-primary text-sm mb-4 md:mb-[32px]">
            Social
          </h2>
          <ul className="text-white-secondary3 flex gap-x-8">
            <li>
              <Link
                href="https://www.npmjs.com/package/@silevis/reactgrid"
                target="_blank"
              >
                <Image src={npmIcon} alt="npm icon" className="md:w-auto" />
              </Link>
            </li>
            <li>
              <Link href="https://github.com/silevis/reactgrid" target="_blank">
                <Image
                  src={githubIcon}
                  alt="github icon"
                  className=" md:w-auto"
                />
              </Link>
            </li>
          </ul>
        </div>
        <div className="w-[100%] sm:w-[50%] lg:w-auto">
          <h2 className="font-bold text-green-primary text-sm mb-4 md:mb-[32px]">
            Contact
          </h2>
          <ul className="text-white-secondary3 flex flex-col gap-y-2 font-bold">
            <li>Silevis Software Sp. z o.o.</li>
            <li>Sienkiewicza Street 17/3</li>
            <li>25-007 Kielce, Poland</li>
          </ul>
        </div>
      </div>
      <div className="col-start-3 col-end-11 text-center text-zinc-600">
        © Silevis Software Sp. z o.o. 2019-{new Date().getFullYear()}
      </div>
    </footer>
  );
};
