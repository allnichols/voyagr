"use client"
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '16px'
};

const center = {
    lat: 37.437041393899676,
    lng: -4.191635586788259
};

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
            <div className="w-1/2 flex items-center justify-center rounded-md">
                <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY ?? ""}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={10}
                    >
                        <Marker position={center} />
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
}