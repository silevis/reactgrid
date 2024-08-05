import Link from "next/link";
import { usePathname } from "next/navigation";
import { Props } from "./header-link";

export const DrawerLink = ({ href, children }: Props) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const underlineClass = isActive
    ? "current text-green-primary md:border-b-2"
    : "text-white-primary";

  return (
    <Link
      href={href}
      className={`md:border-l-1 border-green-light flex  md:text-black-primary text-xs font-bold justify-start md:justify-center items-center ${underlineClass}`}
    >
      {children}
    </Link>
  );
};
