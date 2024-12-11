import Link from "next/link";
import { usePathname } from "next/navigation";

export interface DrawerLinkProps {
  href: string;
  handleLinkClick: () => void;
  children: React.ReactNode;
}

export const DrawerLink = ({
  href,
  handleLinkClick,
  children,
}: DrawerLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const underlineClass = isActive
    ? "current text-green-primary md:border-b-2"
    : "text-white-primary";

  return (
    <Link
      href={href}
      className={`md:border-l-1 border-green-light flex md:text-black-primary text-xs font-bold justify-start md:justify-center items-center ${underlineClass}`}
      onClick={handleLinkClick}
    >
      {children}
    </Link>
  );
};
