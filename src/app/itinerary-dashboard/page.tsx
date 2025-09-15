"use client";

import Sidebar from "./components/Sidebar";

export default function ItineraryPage() {

    return (
        <div className="font-sans grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[260px_1fr_340px] gap-8 min-h-screen">
            {/* Sidebar */}
            <Sidebar />
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