import { cleanup, render, screen, waitFor } from "@testing-library/react";
import ListUploads from ".";
import { Provider } from "react-redux";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";
import { MemoryRouter } from "react-router-dom";
const mockAlert = vi.fn();
const mockFetch = vi.fn();

vi.stubGlobal("alert", mockAlert);
vi.stubGlobal("fetch", mockFetch);

// Helper to create test Redux store
const createTestStore = (overrideState = {}) =>
  configureStore({
    reducer: {
      app: appReducer,
    },
    preloadedState: {
      app: {
        email: "test@example.com",
        webpages: [],
        ...overrideState,
      },
    },
  });

const renderWithStore = (store : ReturnType<typeof createTestStore>) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ListUploads />
      </MemoryRouter>
    </Provider>
  );

describe("ListUploads Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {cleanup()});
  it("renders 'No URLs uploaded' when list is empty", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    const store = createTestStore();
    renderWithStore(store);
    await waitFor(() => {
      expect(screen.getByText(/No URLs uploaded/i)).toBeInTheDocument();

    })
  });

  it("fetches and sets webpages if email is present", async () => {
    const mockResponse = [
      {
        id: "a",
        name: "Mocked Page A",
        fileName: "pageA.html",
        uploadDate: "2024-07-23T10:00:00Z",
      },
      {
        id: "b",
        name: "Mocked Page B",
        url: "https://example.com/pageB",
        uploadDate: "2024-07-22T08:30:00Z",
      },
      {
        id: "c",
        name: "Mocked Page C",
        fileName: "pageC.html",
        uploadDate: "2024-07-21T14:45:00Z",
      },
      {
        id: "d",
        name: "Mocked Page D",
        url: "https://mocked.com/d",
        uploadDate: "2024-07-20T12:00:00Z",
      },
    ];
  
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
  
    const store = createTestStore();
    renderWithStore(store);
  
    await waitFor(() => {
      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(mockResponse.length);
    
      mockResponse.forEach((item, i) => {
        const link = links[i];
    
        const fallbackTitle = item.name || item.fileName || item.url || "Untitled";
        const formattedDate = new Date(item.uploadDate).toLocaleString();
    
        expect(link.textContent).toContain(fallbackTitle);
        expect(link.textContent).toContain(formattedDate);
        expect(link).toHaveAttribute("href", `/view-webpage/${item.id}`);
      });
    });
  });
  it("alerts if email is not set", async () => {
    const store = createTestStore({ email: "" });
    renderWithStore(store);

    await waitFor(() => {
      
      expect(mockAlert).toHaveBeenCalledWith("Please login.");
    });
  });

  it("logs error on fetch exception", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch.mockRejectedValue(new Error("Network issue"));

    const store = createTestStore();
    renderWithStore(store);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        "Error fetching webpages:",
        expect.any(Error)
      );
    });

    errorSpy.mockRestore();
  });

  it("logs error on non-ok fetch response", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch.mockResolvedValue({ ok: false });

    const store = createTestStore();
    renderWithStore(store);

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith("Failed to fetch webpages");
    });

    errorSpy.mockRestore();
  });
});
