"use client"
import Sidebar from "./components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TripDetails from "./components/TripDetails";
import Map from "./components/map";

const queryClient = new QueryClient()

export default function ItineraryPage() {

    return (
        <QueryClientProvider client={queryClient}>
            <div className="relative font-sans grid grid-cols-1 md:grid-cols-[350px_1fr] lg:grid-cols-[450px_1fr] min-h-screen">
                {/* Sidebar */}
                {/* <Sidebar /> */}
                {/* Map */}
                {/* <TripDetails /> */}
                {/* <main className="flex flex-col bg-base-200 gap-8 items-start">
                    <Map />
                </main> */}
                {/* Optional Right Panel */}
                {/* <section className="hidden lg:block bg-base-100 p-4 rounded-lg shadow-md h-full"> */}
                    {/* Right panel content (e.g., notifications, details) */}
                {/* </section> */}
            </div>
        </QueryClientProvider>
    );
}