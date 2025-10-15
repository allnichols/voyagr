"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateTripForm from "./create-trip-form";
import { DateRange } from "react-day-picker";

export default function CreateTrip() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    dates: undefined as DateRange | undefined,
    destination: "",
    preferences: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "preferences"
          ? checked
            ? [...prevData.preferences, value]
            : prevData.preferences.filter((pref) => pref !== value)
          : value,
    }));
  };

  const handleDateChange = (dates: DateRange) => {
    setFormData((prevData) => {
      return { ...prevData, dates };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    fetch("http://localhost:3000/api/get-ai-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (data) {
          router.push(
            `/dashboard/trips/${data.createdTrip.id}?destination=${data.createdTrip.destination}`,
          );
        }
      })
      .catch((error) => {

        console.error("Error:", error);
        const errorMessage = error?.message || "Something went wrong!";
        setIsLoading(false)
        setErrorMessage(errorMessage);
      });
  };

  return (
    <CreateTripForm
      formData={formData}
      handleDateChange={handleDateChange}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      errorMessage={errorMessage}
      loading={isLoading}
    />
  );
}
