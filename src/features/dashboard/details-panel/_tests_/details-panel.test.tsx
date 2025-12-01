import { getByText, prettyDOM, render, waitFor } from "@testing-library/react";
import DetailsPanel from "..";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { mockActivity } from "./mocks";

// Mock the API module before importing
jest.mock("../api/index", () => ({
  fetchActivity: jest.fn(),
}));

jest.mock("@/features/dashboard/store/activity", () => ({
  useCurrentActivity: jest.fn(),
}));

import * as api from "../api/index";
import { useCurrentActivity } from "@/features/dashboard/store/activity";

const mockedApi = api as jest.Mocked<typeof api>;
const mockedUseCurrentActivity = useCurrentActivity as jest.MockedFunction<
  typeof useCurrentActivity
>;

jest.spyOn(api, "fetchActivity").mockResolvedValue(mockActivity);

describe("Details Panel", () => {
  beforeEach(() => {
    mockedApi.fetchActivity.mockResolvedValue(mockActivity);

    // mocking zustand
    mockedUseCurrentActivity.mockImplementation((selector) => {
      const state = {
        currentActivity: { id: 1 },
        setCurrentActivity: () => {},
      };
      return selector(state);
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: { retry: false },
            },
          })
        }
      >
        {component}
      </QueryClientProvider>,
    );
  };

  it("it renders", () => {
    const { getByRole } = renderWithQueryClient(<DetailsPanel />);
    const drawer = getByRole("button", { name: /close drawer/i });
    expect(drawer).toBeInTheDocument();
  });

  it("displays trip place name when query is successful", async () => {
    const { getByText } = renderWithQueryClient(<DetailsPanel />);

     waitFor(async () => {
      expect(getByText("A Great Place")).toBeInTheDocument();
      expect(getByText('Great Place St')).toBeInTheDocument();
      expect(getByText('1000')).toBeInTheDocument();
      expect(getByText('123-123-123')).toBeInTheDocument();
    });
  });
});
