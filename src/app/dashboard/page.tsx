"use client"

export default function ItineraryPage() {

    return (
        <div className="flex h-screen">
            <div className="w-1/2 p-6 overflow-y-auto">
                <div className="flex flex-col mb-6">

                    <h2 className="text-2xl font-semibold">Explore</h2>
                    <div className="mt-4">
                        <label className="input input-lg">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input type="search primary-content" required placeholder="Search" />
                        </label>
                    </div>
                </div>
            </div>
            {/* map placeholder */}
            <div className="flex-1 bg-base-300 flex items-center justify-center">
                <div className="mockup-window border bg-base-100 w-11/12 h-5/6 flex items-center justify-center">
                    <span className="text-lg text-base-content">Map Placeholder</span>
                </div>
            </div>
        </div>
    );
}