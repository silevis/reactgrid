"use client";
import React from "react";
import Link from "next/link";
import logoIcon from "@/public/static/logo-light.svg";
import nightLogoIcon from "@/public/static/logo-night.svg";
import logoGreen from "@/public/static/logo-green.svg";
import { HeaderLink } from "./header-link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { DrawerLink } from "./drawer-link";

export default function Header({ children }: { children: any }) {
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  const handleLinkClick = () => {
    // Close the drawer when a link is clicked
    (document.getElementById("rg-drawer") as HTMLInputElement).checked = false;
  };

  return (
    <>
      <div className="drawer">
        <input id="rg-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content min-h-screen flex flex-col">
          <nav
            className={`relative z-10 w-full ${
              isHomePage ? "bg-green-primary" : "bg-white-primary"
            }  top-0 border-t-1 border-l-1 border-b-1 border-r-1 font-dm-sans border-green-light text-white-primary`}
          >
            <div className="grid grid-cols-main max-w-screen-3xl mx-auto h-[86px]">
              <div className="flex-none lg:hidden flex items-center ps-2">
                <label
                  htmlFor="rg-drawer"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="black"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      stroke={isHomePage ? "#ffffff" : "#202020"}
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </label>
              </div>
              <div className="col-start-2 md:col-start-1 2xl:col-start-3 col-end-13 md:col-end-7 xl:border-l-1 border-green-light flex items-center justify-start ps-0.5 md:ps-4">
                <Link href="/">
                  <Image
                    draggable={false}
                    src={isHomePage ? logoIcon : nightLogoIcon}
                    alt="ReactGrid"
                    width={180}
                  />
                </Link>
              </div>

              <div className="hidden md:contents md:col-start-7">
                <div className="col-span-2 2xl:col-span-1">
                  <HeaderLink href="/demo">Demo</HeaderLink>
                </div>
                <div className="col-span-2 2xl:col-span-1">
                  <HeaderLink href="/docs/5.0/1-getting-started">
                    Docs
                  </HeaderLink>
                </div>
                <div className="col-span-2">
                  <HeaderLink href="/support">
                    <span className="block xl:hidden">Dev support</span>
                    <span className="hidden xl:block">Development Support</span>
                  </HeaderLink>
                </div>
              </div>
              <span className="border-l-1 hidden 2xl:flex border-l-1 border-green-light"></span>
              <span className="hidden 2xl:flex"></span>
            </div>
          </nav>

          {children}
        </div>
        <div className="md:hidden drawer-side z-50">
          <label
            htmlFor="rg-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-[85%] min-h-full bg-base-200">
            <li>
              <Link href="/" onClick={handleLinkClick}>
                <Image src={logoGreen} alt="ReactGrid" width={30} />
              </Link>
            </li>
            <li>
              <DrawerLink handleLinkClick={handleLinkClick} href="/demo">
                Demo
              </DrawerLink>
            </li>
            <li>
              <DrawerLink
                handleLinkClick={handleLinkClick}
                href="/docs/5.0/1-getting-started"
              >
                Docs
              </DrawerLink>
            </li>
            <li>
              <DrawerLink handleLinkClick={handleLinkClick} href="/support">
                Development Support
              </DrawerLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
