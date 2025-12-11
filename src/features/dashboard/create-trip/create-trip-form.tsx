"use client";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";

type CreateTripFormProps = {
  formData: {
    dates: DateRange | undefined;
    destination: string;
    preferences: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDateChange: (dates: DateRange) => void;
  loading?: boolean;
  errorMessage?: string | null;
};

export default function CreateTripForm({
  formData,
  handleChange,
  handleSubmit,
  handleDateChange,
  errorMessage,
  loading = false,
}: CreateTripFormProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg">
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
        <div className="mb-8">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dates"
          >
            Travel Dates
          </label>
          <button
            type="button"
            popoverTarget="rdp-popover"
            className="input input-border"
            style={{ anchorName: "--rdp" } as React.CSSProperties}
          >
            {formData.dates && formData.dates.from
              ? `${formData.dates.from.toLocaleDateString()}${formData.dates.to ? " - " + formData.dates.to.toLocaleDateString() : ""}`
              : "Pick a date"}
          </button>
        </div>

        <div
          popover="auto"
          id="rdp-popover"
          className="dropdown"
          style={{ positionAnchor: "--rdp" } as React.CSSProperties}
        >
          <DayPicker
            className="react-day-picker"
            mode="range"
            selected={formData.dates}
            onSelect={(date) => handleDateChange(date as DateRange)}
            disabled={{
              before: new Date(),
              after: (() => {
                const d = new Date();
                d.setMonth(d.getMonth() + 1);
                return d;
              })(),
            }}
            numberOfMonths={1}
          />
        </div>

        <h2 className="text-sm font-bold">Travel Preferences</h2>
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
          disabled={!formData.destination || !formData.dates || loading}
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
