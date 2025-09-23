"use client"
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import 'leaflet/dist/leaflet.css';


export default function MainPage() {

    return (
        <div className="flex h-screen">
            <div className="w-1/2 p-6 overflow-y-auto">
                <div className="flex flex-col mb-6 w-full">

                    <h2 className="text-2xl font-semibold">Explore</h2>
                    <div className="mt-4">
                        <label className="input input-lg w-[85%]">
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
            <div className="w-1/2 flex items-center justify-center rounded-md overflow-y-hidden">
                <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "95%", width: "95%", borderRadius: "16px" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
            </div>
        </div>
    );
}