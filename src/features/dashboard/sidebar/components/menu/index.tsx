"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "./constants";
import UserProfile from "@/features/dashboard/sidebar/components/user-profile";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-square btn-ghost bg-white shadow-md"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[#00000036] bg-opacity-60 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`
        w-[225px] bg-white border-r border-base-200 transition-transform duration-300 ease-in-out z-50
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${window?.innerWidth < 1024 ? 'fixed top-0 left-0 h-full' : ''}
      `}>
        {/* Header */}
        <div className="p-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-secondary">Voyagr</h2>
            {/* Close button for mobile */}
            <button 
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-sm md:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="divider mt-0" />
        
        {/* Menu Items */}
        <div className="menu w-full p-1">
          {menuItems.map((item) => (
            <li className="mb-2" key={item.href}>
              <Link
                href={item.href}
                className={`menu-item ${pathname === item.href ? "bg-gray-300 font-medium" : ""}`}
                onClick={() => setIsOpen(false)} // Close menu on mobile when item is clicked
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
          
          <div className="absolute bottom-10">
            <UserProfile />
          </div>
        </div>
      </aside>
    </>
  );
}