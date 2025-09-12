

export default function FormPage() {
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className="card sm:shadow-md w-full max-w-3xl">
                    <div className="card-body">
                        <div className="mb-4 text-center">
                            <h1 className="text-4xl font-extrabold">Plan Your Trip</h1>
                            {/* <h2 className="text-2xl ">Tell us where you want to go and what you want to experience</h2> */}
                        </div>

                        <form>
                            {/* Form fields will go here */}
                            <div className="mb-8">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
                                    Destination
                                </label>
                                <input
                                    id="destination"
                                    type="text"
                                    placeholder="Tokyo, Japan, Paris, France, etc."
                                    className="input shadow"
                                />
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
                                    />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold">Travel Preferences</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 mt-4">
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Museums
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Landmarks
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Restaurants
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Nature
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Nightlife
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Shopping
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Adventure
                                </label>
                                <label className="label">
                                    <input type="checkbox" className="checkbox" />
                                    Relaxation
                                </label>
                            </div>
  
                                <button type="submit" className="btn btn-primary w-full">
                                    Plan My Trip
                                </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
  <path fillRule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
</svg> */}
