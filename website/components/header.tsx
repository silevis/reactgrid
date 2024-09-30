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
        <div className="drawer-content flex flex-col">
          <nav
            className={`relative w-full ${
              isHomePage ? "bg-green-primary" : "bg-white-primary"
            }  top-0 border-t-1 border-l-1 border-b-1 border-r-1 font-dm-sans border-green-light grid grid-cols-main h-[86px] text-white-primary`}
          >
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
            <div className="col-start-2 md:col-start-1 2xl:col-start-3 col-end-13 md:col-end-5 2xl:col-end-8 xl:border-l-1 border-green-light flex items-center justify-start ps-0.5 md:ps-4">
              <Link href="/">
                <Image
                  src={isHomePage ? logoIcon : nightLogoIcon}
                  alt="ReactGrid"
                  width={180}
                />
              </Link>
            </div>
            <div
              className={`grid hidden md:grid text-black-primary md:text-white-primary col-start-5 col-end-13 2xl:col-start-8 2xl:col-end-11 grid-cols-1 md:grid-cols-navLinks justify-items-start md:justify-items-stretch content-start md:content-stretch md:top-auto gap-y-4 md:gap-y-0 menu-horizontal`}
            >
              <HeaderLink href="/demo">Demo</HeaderLink>
              <HeaderLink href="/docs">Docs</HeaderLink>
              <HeaderLink href="/support">Support</HeaderLink>
            </div>
            <span className="border-l-1 hidden 2xl:flex border-l-1 border-green-light"></span>
            <span className="hidden 2xl:flex"></span>
          </nav>

          {children}
        </div>
        <div className="drawer-side z-50">
          <label
            htmlFor="rg-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200">
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
              <DrawerLink handleLinkClick={handleLinkClick} href="/docs">
                Docs
              </DrawerLink>
            </li>
            <li>
              <DrawerLink handleLinkClick={handleLinkClick} href="/support">
                Support
              </DrawerLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
