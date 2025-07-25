import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";
import UploadResult from ".";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

// 👇 Mock all child components
vi.mock("../LLMResponseView", () => ({
  default: () => <div>Mock LLM RESPONSE</div>,
}));
vi.mock("../AxeCoreResponseView", () => ({
  default: () => <div>Mock AXE RESPONSE</div>,
}));
vi.mock("../NuValidatorResponseView", () => ({
  default: () => <div>Mock NU VALIDATOR</div>,
}));
vi.mock("../ResponsivenessMetricsList", () => ({
  default: () => <div>Mock RESPONSIVENESS</div>,
}));
vi.mock("../PageSpeedResponseView", () => ({
  default: () => <div>Mock PAGESPEED</div>,
}));
vi.mock("../DesignAndSpecificationsPreview", () => ({
  default: () => <div>Mock DESIGN PREVIEW</div>,
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const sampleWebpageId = "abc123";
const sampleEmail = "test@example.com";
const mockWebpages = [
  {
    id: sampleWebpageId,
    name: "Test Webpage",
    url: "https://example.com",
    uploadDate: new Date().toISOString(),
  },
];

const createTestStore = () =>
  configureStore({
    reducer: { app: appReducer },
    preloadedState: {
      app: { email: sampleEmail, webpages: mockWebpages },
    },
  });

describe("UploadResult Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders loading state initially", () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <UploadResult webpageId={sampleWebpageId} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders mocked child components when data is loaded", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        htmlContent: "<div>Hello World</div>",
        webpageAnalysisResult: {
          llmResponse: {},
          webAuditResults: {
            axeCoreResult: [],
            nuValidatorResult: [],
            responsivenessResult: [],
            pageSpeedResult: {},
          },
          AxeCoreError: false,
          NuValidatorError: false,
          PageSpeedError: false,
          LLMError: false,
          ResponsivenessError: false,
        },
      }),
    });

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <UploadResult webpageId={sampleWebpageId} />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    expect(screen.getByText("Webpage Audit Report")).toBeInTheDocument();
    expect(screen.getByText("Rendered HTML")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Download Report/i })).toBeInTheDocument();

    // ✅ Mocked component checks
    expect(screen.getByText("Mock DESIGN PREVIEW")).toBeInTheDocument();
    expect(screen.getByText("Mock LLM RESPONSE")).toBeInTheDocument();
    expect(screen.getByText("Mock AXE RESPONSE")).toBeInTheDocument();
    expect(screen.getByText("Mock NU VALIDATOR")).toBeInTheDocument();
    expect(screen.getByText("Mock RESPONSIVENESS")).toBeInTheDocument();
    expect(screen.getByText("Mock PAGESPEED")).toBeInTheDocument();
  });

  it("handles API fetch failure", async () => {
    mockFetch.mockRejectedValue(new Error("Fetch failed"));

    render(
      <Provider store={createTestStore()}>
        <MemoryRouter>
          <UploadResult webpageId={sampleWebpageId} />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    // Even on failure, some static parts are still rendered
    expect(screen.getByText("Rendered HTML")).toBeInTheDocument();
  });
});
