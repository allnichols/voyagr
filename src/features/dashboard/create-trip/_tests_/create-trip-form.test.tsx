import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateTripForm from "../create-trip-form";
import { DateRange } from "react-day-picker";

describe("CreateTripForm", () => {
    const mockHandleChange = jest.fn();
    const mockHandleSubmit = jest.fn((e) => e.preventDefault());
    const mockHandleDateChange = jest.fn();

    const defaultFormData = {
        dates: undefined,
        destination: "",
        preferences: [],
    };

    it("disables submit button if destination or dates are missing", () => {
        render(
            <CreateTripForm
                formData={defaultFormData}
                handleChange={mockHandleChange}
                handleSubmit={mockHandleSubmit}
                handleDateChange={mockHandleDateChange}
            />
        );
        expect(screen.getByRole("button", { name: /Create Trip/i })).toBeDisabled();
    });

    it("enables submit button if destination and dates are present", () => {
        const formData = {
            ...defaultFormData,
            destination: "Tokyo",
            dates: { from: new Date(), to: new Date() } as DateRange,
        };
        render(
            <CreateTripForm
                formData={formData}
                handleChange={mockHandleChange}
                handleSubmit={mockHandleSubmit}
                handleDateChange={mockHandleDateChange}
            />
        );
        expect(screen.getByRole("button", { name: /Create Trip/i })).not.toBeDisabled();
    });

    it("shows error message when errorMessage prop is set", () => {
        render(
            <CreateTripForm
                formData={defaultFormData}
                handleChange={mockHandleChange}
                handleSubmit={mockHandleSubmit}
                handleDateChange={mockHandleDateChange}
                errorMessage="Something went wrong"
            />
        );
        expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });

    it("calls handleChange when destination input changes", () => {
        render(
            <CreateTripForm
                formData={defaultFormData}
                handleChange={mockHandleChange}
                handleSubmit={mockHandleSubmit}
                handleDateChange={mockHandleDateChange}
            />
        );
        const input = screen.getByPlaceholderText(/Tokyo, Japan, Paris, France, etc./i);
        fireEvent.change(input, { target: { value: "Paris" } });
        expect(mockHandleChange).toHaveBeenCalled();
    });

    it("calls handleChange when a preference checkbox is clicked", () => {
        render(
            <CreateTripForm
                formData={defaultFormData}
                handleChange={mockHandleChange}
                handleSubmit={mockHandleSubmit}
                handleDateChange={mockHandleDateChange}
            />
        );
        const checkbox = screen.getByLabelText(/Museums/i);
        fireEvent.click(checkbox);
        expect(mockHandleChange).toHaveBeenCalled();
    });

    it("shows loading spinner and text when loading is true", () => {
        const formData = {
            ...defaultFormData,
            destination: "Tokyo",
            dates: { from: new Date(), to: new Date() } as DateRange,
        };
        render(
            <CreateTripForm
                formData={formData}
                handleChange={mockHandleChange}
                handleSubmit={mockHandleSubmit}
                handleDateChange={mockHandleDateChange}
                loading={true}
            />
        );
        expect(screen.getByText(/Creating Trip/i)).toBeInTheDocument();
    });
});