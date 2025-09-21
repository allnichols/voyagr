"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function TripForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        destination: "",
        departureDate: "",
        returnDate: "",
        preferences: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "preferences" ? checked ?
                [...prevData.preferences, value] :
                prevData.preferences.filter((pref) => pref !== value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetch('http://localhost:3000/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(response => response.json()).then(data => {
            if (data) {
                // Redirect to the itinerary page
                router.push('/trips');

            }
        })
            .catch((error) => {
                console.error('Error:', error);
            });

    };

    return (
        <div>
            <h1 className="text-xl mb-4 text-center font-bold">Create your trip</h1>
            <form onSubmit={handleSubmit}>

                {/* Form fields will go here */}
                <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
                        Destination

                    </label>
                    <input type="text" className="input shadow" onChange={handleChange} name="destination" placeholder="Tokyo, Japan, Paris, France, etc." />


                </div>

                {/* Departure and Return Dates */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="departure-date">
                            Departure Date
                        </label>
                        <input
                            id="departure-date"
                            type="date"
                            className="input shadow"
                            name="departureDate"
                            value={formData.departureDate}
                            onChange={handleChange}
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="return-date">
                            Return Date
                        </label>
                        <input
                            id="return-date"
                            type="date"
                            className="input shadow"
                            name="returnDate"
                            value={formData.returnDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <h2 className="text-2xl font-bold">Travel Preferences</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 mt-4">
                    <label className="label">
                        <input onChange={handleChange} name="preferences" value="museums" type="checkbox" className="checkbox" />
                        Museums
                    </label>
                    <label className="label">
                        <input onChange={handleChange} name="preferences" value="landmarks" type="checkbox" className="checkbox" />
                        Landmarks
                    </label>
                    <label className="label">
                        <input onChange={handleChange} name="preferences" value="restaurants" type="checkbox" className="checkbox" />
                        Restaurants
                    </label>
                    <label className="label">
                        <input onChange={handleChange} name="preferences" value="nature" type="checkbox" className="checkbox" />
                        Nature
                    </label>
                    <label className="label">
                        <input onChange={handleChange} name="preferences" value="nightlife" type="checkbox" className="checkbox" />
                        Nightlife
                    </label>
                    <label className="label">
                        <input onChange={handleChange} name="preferences" value="shopping" type="checkbox" className="checkbox" />
                        Shopping
                    </label>
                    <label className="label">
                        <input onChange={handleChange} name="preferences" value="adventure" type="checkbox" className="checkbox" />
                        Adventure
                    </label>
                    <label className="label">
                        <input onChange={handleChange} name="preferences" value="relaxation" type="checkbox" className="checkbox" />
                        Relaxation
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={!formData.destination || !formData.departureDate || !formData.returnDate}
                    className="btn btn-primary w-full py-4 text-lg font-bold"
                >
                    Plan My Trip
                </button>
            </form>
        </div>
    )
}