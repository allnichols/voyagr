

export default function FormPage() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="card shadow-lg">
            <div className="card-body">
                <h1 className="text-4xl font-extrabold">Plan Your Trip</h1>
              <h2 className="text-2xl font-bold">Travel Preferences</h2>
              <p className="text-sm text-gray-600">
                Please fill out the form below to help us understand your travel preferences.
              </p>
            </div>
            {/* Placeholder for form elements */}
        </div>
        
      </main>
    </div>
  );
}