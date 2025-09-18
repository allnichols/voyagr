"use client"
import { useState, useEffect } from "react";
import Trips from "./Trips";

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    // Open sidebar by default on md+ screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setOpen(true);
            else setOpen(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleToggle = () => setOpen((prev) => !prev);

    return (
        <>
            {/* Toggle button for small screens */}
            {!open && (
                <button
                    className="fixed top-4 left-4 z-50 btn btn-primary md:hidden"
                    onClick={handleToggle}
                    aria-label="Open sidebar"
                >
                    ☰
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 h-full w-full bg-base-100 shadow-lg z-40
                    transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"}
                    md:static md:translate-x-0 md:shadow-none
                `}
            >
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Voyagr</h2>
                        {/* Close button only on small screens */}
                        <button
                            className="btn btn-ghost"
                            onClick={handleToggle}
                            aria-label="Close sidebar"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex-1">
                        <div className="divider w-full"></div>
                        <Trips />
                    </div>
                </div>
            </aside>

            {/* Overlay for small screens */}
            {open && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
                    onClick={handleToggle}
                    aria-label="Close sidebar overlay"
                />
            )}
        </>
    );
}