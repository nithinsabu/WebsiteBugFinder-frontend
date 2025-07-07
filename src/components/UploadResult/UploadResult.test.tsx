import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";
import UploadResult from ".";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Helper to render with store
const renderWithStore = (component: React.ReactElement, email = "test@example.com") => {
  const store = configureStore({
    reducer: { app: appReducer },
    preloadedState: { app: { email, webpages: [] } },
  });

  return render(<Provider store={store}>{component}</Provider>);
};

describe("UploadResult Component", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });
  afterEach(() => {
    cleanup();
  })

  it("displays loading initially", () => {
    renderWithStore(<UploadResult webpageId="123" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("fetches and displays htmlContent and llmResponse on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        htmlContent: "<h1>Hello Rendered</h1>",
        llmResponse: "LLM says: Missing alt text"
      }),
    } as Response);

    renderWithStore(<UploadResult webpageId="123" />);

    await waitFor(() => {
      expect(screen.getByTitle("html-preview")).toBeInTheDocument();
      expect(screen.getByText("Detected Issues")).toBeInTheDocument();
      expect(screen.getByText("LLM says: Missing alt text")).toBeInTheDocument();
    });
  });

  it("displays error message on fetch failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve("Internal Server Error"),
    } as Response);

    renderWithStore(<UploadResult webpageId="123" />);

    await waitFor(() => {
      expect(screen.getByText("Rendered HTML")).toBeInTheDocument();
      expect(screen.getByText("Detected Issues")).toBeInTheDocument();
      expect(screen.getByText("ERROR fetching content")).toBeInTheDocument();
    });
  });
});
