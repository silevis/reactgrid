"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface HeaderLinkProps {
  href: string;
  children: React.ReactNode;
}

export const HeaderLink = ({ href, children }: HeaderLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const isHomePage = pathname === "/";

  const underlineClass = isActive ? "md:border-b-2" : "";

  return (
    <Link
      href={href}
      className={`md:border-l-1 border-green-light rounded-none flex ${
        isHomePage ? "md:text-white-primary" : "md:text-black-primary"
      } text-xs font-bold h-full flex items-center justify-center ${underlineClass}`}
    >
      {children}
    </Link>
  );
};
