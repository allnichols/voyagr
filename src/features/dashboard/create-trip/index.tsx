"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateTripForm from "./create-trip-form";
import { DateRange } from "react-day-picker";
import { useMutation } from "@tanstack/react-query";
import { createTrip } from "./api";
import LoadingOverlay from "./loading-overlay";

export default function CreateTrip() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    dates: undefined as DateRange | undefined,
    destination: "",
    preferences: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [currentAttempt, setCurrentAttempt] = useState(0);

  const maxAttempts = 2;

  const createTripMutation = useMutation({
    mutationFn: createTrip,
    retry: maxAttempts,
    retryDelay: (attempt) => {
      setCurrentAttempt(attempt);
      return 1000 * attempt; // Exponential backoff
    },
    onMutate: () => {
      setShowOverlay(true);
      setCurrentAttempt(1);
    },
    onSuccess: (data) => {
      console.log("Trip created successfully:", data);
      if (data) {
        router.push(
          `/dashboard/trips/${data.createdTrip.id}?destination=${data.createdTrip.destination}`,
        );
      }
    },
    onError: (error: any) => {
      console.error("Error creating trip:", error);
      setErrorMessage("Failed to create trip. Please try again.");
    },
  });

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
    createTripMutation.mutate(formData);
  };

  const handleRetry = () => {
    createTripMutation.reset();
  };

  return (
    <div className="relative min-h-[400px]">
      {true && (
        <LoadingOverlay
          isVisible={showOverlay}
          isLoading={true}
          error={createTripMutation.isError}
          onRetry={handleRetry}
          onCancel={() => setShowOverlay(false)}
          currentAttempt={currentAttempt}
          maxAttempts={maxAttempts}
        />
      )}
      
      <CreateTripForm
        formData={formData}
        handleDateChange={handleDateChange}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        errorMessage={errorMessage}
        loading={isLoading}
      />
    </div>
  );
}
