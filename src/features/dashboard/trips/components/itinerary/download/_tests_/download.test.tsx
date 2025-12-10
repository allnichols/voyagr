/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DownloadItinerary from "../index";
import { downloadItinerary } from "../../api";
import { useSearchParams } from "next/navigation";

jest.mock("next/navigation");
jest.mock("../../api");
jest.mock("@/features/dashboard/hooks/useToast", () => {
  const useToast = jest.fn(() => ({
    toasts: [],
    showError: jest.fn(),
    removeToast: jest.fn(),
  }));
  return { _esModule: true, useToast, default: useToast };
});

const mockedDownloadItinerary = downloadItinerary as jest.MockedFunction<
  typeof downloadItinerary
>;
const mockedUseSearchParams = useSearchParams as jest.MockedFunction<
  typeof useSearchParams
>;

const mockedCreateObjectURL = jest.fn();
const mockedRevokeObjectURL = jest.fn();
const mockClick = jest.fn();
const mockRemove = jest.fn();

beforeAll(() => {
  Object.defineProperty(window, "URL", {
    value: {
      createObjectURL: mockedCreateObjectURL,
      revokeObjectURL: mockedRevokeObjectURL,
    },
    writable: true,
  });
  const originalCreateElement = document.createElement;
  const mockCreateElement = jest.fn((tagName: string) => {
    if (tagName === "a") {
      return {
        click: mockClick,
        remove: mockRemove,
        href: "",
        download: "",
      };
    }
    return originalCreateElement.call(document, tagName);
  });

  Object.defineProperty(document, "createElement", {
    value: mockCreateElement,
    writable: true,
  });
});

describe("DownloadItinerary", () => {
  const mockSearchParams = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseSearchParams.mockReturnValue(mockSearchParams as any);
    mockSearchParams.get.mockReturnValue("Paris");
    mockedCreateObjectURL.mockReturnValue("blob:url");
    console.error = jest.fn();
  });

  it("renders download button", () => {
    render(<DownloadItinerary tripId={1} />);

    const downloadBtn = screen.getByRole("button");
    expect(downloadBtn).toBeInTheDocument();
    expect(downloadBtn).not.toBeDisabled();
  });

  it("shows loading state when downloading", async () => {
    mockSearchParams.get.mockReturnValue("Paris");
    mockedDownloadItinerary.mockImplementation(() => new Promise(() => {}));

    render(<DownloadItinerary tripId={1} />);

    const downloadBtn = screen.getByRole("button");
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      const loadingSpan = screen
        .getByRole("button")
        .querySelector("span.loading");
      expect(downloadBtn).toBeDisabled();
      expect(loadingSpan).toHaveClass("loading");
    });
  });

  it("successfully downloads itinerary", async () => {
    const mockBlob = new Blob(["PDF content"], { type: "application/pdf" });
    mockSearchParams.get.mockReturnValue("Paris");
    mockedDownloadItinerary.mockResolvedValueOnce(mockBlob);

    render(<DownloadItinerary tripId={1} />);

    const downloadBtn = screen.getByRole("button");
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(mockedDownloadItinerary).toHaveBeenCalledWith(1);
      expect(mockedCreateObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockClick).toHaveBeenCalled();
      expect(mockedRevokeObjectURL).toHaveBeenCalledWith("blob:url");
      expect(mockRemove).toHaveBeenCalled();
    });

    expect(downloadBtn).not.toBeDisabled();
  });

  it("handles no destination in search params", async () => {
    const mockBlob = new Blob(["PDF content"], { type: "application/pdf" });
    mockSearchParams.get.mockReturnValue(null);
    mockedDownloadItinerary.mockResolvedValue(mockBlob);

    render(<DownloadItinerary tripId={1} />);

    const downloadBtn = screen.getByRole("button");
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(mockedDownloadItinerary).toHaveBeenCalledWith(1);
    });
  });

  it("shows error toast on download failure", async () => {
    const { useToast } = require("@/features/dashboard/hooks/useToast");
    const mockShowError = jest.fn();
    useToast.mockReturnValue({
      toasts: [],
      showError: mockShowError,
      removeToast: jest.fn(),
    });
    mockSearchParams.get.mockReturnValue("Paris");
    mockedDownloadItinerary.mockRejectedValueOnce(true);

    render(<DownloadItinerary tripId={1} />);

    const downloadBtn = screen.getByRole("button");
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalled();
      
    });
    expect(downloadBtn).not.toBeDisabled();
  });
});
