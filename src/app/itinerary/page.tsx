"use client";
import { useSearchParams } from "next/navigation";

export default function ItineraryPage() {

    return (
        <div className="font-sans grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[260px_1fr_340px] gap-8 min-h-screen">
            {/* Sidebar */}
            <div className="drawer md:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button md:hidden">
                        Open drawer
                    </label>
                </div>
                <div className="drawer-side p-6 shadow-lg">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <h2 className="text-2xl font-bold mb-4">Voyagr</h2>
                    <div className="divider w-[100%]"></div>
                    <div>
                        <span className="text-lg font-semibold">Your Trip</span>
                    </div>
                    <ul className="menu text-base-content w-80 p-4">
                        {/* Sidebar content here */}
                        <li><a>Sidebar Item 1</a></li>
                        <li><a>Sidebar Item 2</a></li>
                    </ul>
                </div>
            </div>
            {/* Main Content */}
            <main className="flex flex-col gap-8 items-start">
                {/* Main dashboard content goes here */}
            </main>
            {/* Optional Right Panel */}
            <section className="hidden lg:block bg-base-100 p-4 rounded-lg shadow-md h-full">
                {/* Right panel content (e.g., notifications, details) */}
            </section>
        </div>
    );
}