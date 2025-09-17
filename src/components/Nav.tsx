"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { hash: "#home",  name: "Home" },
  { hash: "#menu",  name: "Menu" },
  { hash: "browse", name: "Chefs" },
  { hash: "orders",  name: "Order" },
  { hash: "#about", name: "About" },
  { hash: "#more",  name: "More" },
];

export default function Nav({
  containerStyles,
  linkStyles,
}: {
  containerStyles: string;
  linkStyles: string;
}) {
  const pathname = usePathname();
  const prefix = pathname === "/" ? "" : "/"; // 不在首頁就加 "/"

  return (
    <nav className={containerStyles}>
      {links.map((l) => (
        <Link key={l.hash} href={`${prefix}${l.hash}`} className={linkStyles}>
          {l.name}
        </Link>
      ))}
    </nav>
  );
}
