"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "./constants";

export default function Menu() {
  const pathname = usePathname();
  return (
    <div className="menu w-full">
      {menuItems.map((item) => {
        return (
          <li className="mb-2" key={item.href}>
            <Link
              href={item.href}
              className={`menu-item  ${pathname === item.href ? "bg-gray-300 font-medium" : ""}`}
            >
              {item.icon}
              {item.name}
            </Link>
          </li>
        );
      })}
    </div>
  );
}
