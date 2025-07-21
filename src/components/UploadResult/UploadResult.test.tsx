import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import UploadResult from ".";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";

// 1️⃣ Mock Redux useSelector and create test store
const createTestStore = () =>
  configureStore({
    reducer: { app: appReducer },
    preloadedState: { app: { email: "test@example.com", webpages: [] } },
  });

// 2️⃣ Stub child components with visible text (for getByText)
vi.mock("../AxeCoreResponseView", () => ({
  __esModule: true,
  default: () => <div>AxeViolationsView rendered</div>,
}));

vi.mock("../NuValidatorResponseView", () => ({
  __esModule: true,
  default: () => <div>NuValidatorMessagesView rendered</div>,
}));

vi.mock("../ResponsivenessMetricsList", () => ({
  __esModule: true,
  default: () => <div>ResponsivenessMetricsList rendered</div>,
}));

vi.mock("../PageSpeedResponseView", () => ({
  __esModule: true,
  default: () => <div>PageSpeedResponseView rendered</div>,
}));

vi.mock("../LLMResponseView", () => ({
  __esModule: true,
  default: () => <div>LLMResponseView rendered</div>,
}));

// 3️⃣ Silence expected error logs
vi.spyOn(console, "error").mockImplementation(() => {});

describe("UploadResult Component", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();

    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              htmlContent: "<h1>Test HTML</h1>",
              webpageAnalysisResult: {
                llmResponse: {},
                webAuditResults: {
                  axeCoreResult: [],
                  nuValidatorResult: [],
                  responsivenessResult: [],
                  pageSpeedResult: {},
                },
              },
            }),
        } as Response)
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
    cleanup();
  });

  it("renders loading state initially", () => {
    render(
      <Provider store={store}>
        <UploadResult webpageId="test-id" />
      </Provider>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders all sections after successful fetch", async () => {
    render(
      <Provider store={store}>
        <UploadResult webpageId="test-id" />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText("Rendered HTML")).toBeInTheDocument();
    expect(screen.getByText("AxeViolationsView rendered")).toBeInTheDocument();
    expect(screen.getByText("NuValidatorMessagesView rendered")).toBeInTheDocument();
    expect(screen.getByText("ResponsivenessMetricsList rendered")).toBeInTheDocument();
    expect(screen.getByText("PageSpeedResponseView rendered")).toBeInTheDocument();
    expect(screen.getByText("LLMResponseView rendered")).toBeInTheDocument();
  });

});
