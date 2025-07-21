import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ViewResult from ".";
import { describe, it, vi, expect, afterEach, beforeAll } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { store } from "../../redux/store";

// Mocks
vi.mock("../../components/ListUploads", () => ({
  default: () => <div>Mocked ListUploads</div>,
}));

vi.mock("../../components/UploadResult", () => ({
  default: ({ webpageId }: { webpageId: string }) => (
    <div>Mocked UploadResult for {webpageId}</div>
  ),
}));

beforeAll(() => {
  vi.stubGlobal("alert", vi.fn());
});

describe("ViewResult", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders placeholder when no webpageId param", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/view-result"]}>
          <Routes>
            <Route path="/view-result" element={<ViewResult />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Mocked ListUploads")).toBeInTheDocument();
    expect(screen.getByText(/Select a URL/)).toBeInTheDocument();
  });

  it("renders UploadResult when webpageId is present", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/view-result/123"]}>
          <Routes>
            <Route path="/view-result/:webpageId" element={<ViewResult />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Mocked ListUploads")).toBeInTheDocument();
    expect(screen.getByText("Mocked UploadResult for 123")).toBeInTheDocument();
  });
});
