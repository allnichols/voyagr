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
        }).then(response =>response.json()).then(data => {
              console.log('Success:', data);
                // Redirect to the itinerary page with query parameters
                const query = new URLSearchParams({
                    destination: formData.destination,
                    departureDate: formData.departureDate,
                    returnDate: formData.returnDate,  
                    preferences: formData.preferences.join(","),
                    aiData: encodeURIComponent(JSON.stringify(data)) // Assuming the API returns the number of days
                });
                router.push(`/itinerary?${query.toString()}`);
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle error (e.g., show an error message)
          });

    };

    return (
        <form onSubmit={handleSubmit}>

            {/* Form fields will go here */}
            <div className="mb-8">
                <label className="input text-gray-700 text-sm font-bold mb-2 shadow-md" htmlFor="destination">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                        <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
                    </svg>
                    <input type="text" className="grow" onChange={handleChange} name="destination" placeholder="Tokyo, Japan, Paris, France, etc." />
                    {/* Destination */}

                    {/* <input
                        id="destination"
                        type="text"
                        placeholder="Tokyo, Japan, Paris, France, etc."
                        className="grow shadow"
                    /> */}
                </label>

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
    )
}