"use client";

type CreateTripFormProps = {
  formData: {
    destination: string;
    departureDate: string;
    returnDate: string;
    preferences: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  errorMessage?: string | null;
};

export default function CreateTripForm({
  formData,
  handleChange,
  handleSubmit,
  errorMessage,
  loading = false,
}: CreateTripFormProps) {
  return (
    <div className="mt-10 p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
      <h1 className="text-xl mb-4 text-center font-bold">Create your trip</h1>
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Form fields will go here */}
        <div className="mb-8">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="destination"
          >
            Destination
          </label>
          <input
            type="text"
            className="input shadow"
            onChange={handleChange}
            name="destination"
            placeholder="Tokyo, Japan, Paris, France, etc."
          />
        </div>

        {/* Departure and Return Dates */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="departure-date"
            >
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
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="return-date"
            >
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
            <input
              onChange={handleChange}
              name="preferences"
              value="museums"
              type="checkbox"
              className="checkbox"
            />
            Museums
          </label>
          <label className="label">
            <input
              onChange={handleChange}
              name="preferences"
              value="landmarks"
              type="checkbox"
              className="checkbox"
            />
            Landmarks
          </label>
          <label className="label">
            <input
              onChange={handleChange}
              name="preferences"
              value="restaurants"
              type="checkbox"
              className="checkbox"
            />
            Restaurants
          </label>
          <label className="label">
            <input
              onChange={handleChange}
              name="preferences"
              value="nature"
              type="checkbox"
              className="checkbox"
            />
            Nature
          </label>
          <label className="label">
            <input
              onChange={handleChange}
              name="preferences"
              value="nightlife"
              type="checkbox"
              className="checkbox"
            />
            Nightlife
          </label>
          <label className="label">
            <input
              onChange={handleChange}
              name="preferences"
              value="shopping"
              type="checkbox"
              className="checkbox"
            />
            Shopping
          </label>
          <label className="label">
            <input
              onChange={handleChange}
              name="preferences"
              value="adventure"
              type="checkbox"
              className="checkbox"
            />
            Adventure
          </label>
          <label className="label">
            <input
              onChange={handleChange}
              name="preferences"
              value="relaxation"
              type="checkbox"
              className="checkbox"
            />
            Relaxation
          </label>
        </div>

        <button
          type="submit"
          disabled={
            !formData.destination ||
            !formData.departureDate ||
            !formData.returnDate
          }
          className={`btn btn-primary w-full py-4 text-lg font-bold`}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner"></span> "Creating
              Trip..."
            </>
          ) : (
            "Create Trip"
          )}
        </button>
      </form>
    </div>
  );
}
