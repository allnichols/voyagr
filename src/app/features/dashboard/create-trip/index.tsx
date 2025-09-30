"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateTripForm from "./create-trip-form";

export default function CreateTrip() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: "",
    departureDate: "",
    returnDate: "",
    preferences: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/get-ai-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          router.push(
            `/dashboard/trips/${data.createdTrip.id}?destination=${data.createdTrip.destination}`,
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <CreateTripForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
}
