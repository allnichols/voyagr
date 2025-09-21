"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        name: "Trips",
        href: "/dashboard/trips",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
        )
    },
    {
        href: "/dashboard/create-trip",
        name: "Create",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        )
    }
]

export default function Menu() {
    const pathname = usePathname();
    return (
        <div className="menu w-full">
            {menuItems.map((item) => {
                return (
                    <li key={item.href}>
                        <Link

                            href={item.href}
                            className={`menu-item  ${pathname === item.href ? "bg-gray-300 font-medium" : ""}`}>
                                {item.icon}
                                {item.name}
                        </Link>
                    </li>
                )
            })}
        </div>
    )
}