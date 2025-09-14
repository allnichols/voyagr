import TripForm from "./components/form";

export default function TripFormPage() {
    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div className="card sm:shadow-md w-full max-w-3xl">
                    <div className="card-body">
                        <div className="mb-4 text-center">
                            <h1 className="text-4xl font-extrabold">Plan Your Trip</h1>
                            {/* <h2 className="text-2xl ">Tell us where you want to go and what you want to experience</h2> */}
                        </div>

                        <TripForm />
                    </div>
                </div>
            </main>
        </div>
    );
}