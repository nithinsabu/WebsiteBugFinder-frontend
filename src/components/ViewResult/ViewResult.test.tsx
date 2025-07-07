import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ViewResult from ".";
import { describe, it, vi, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
// Mocks
vi.mock("../ListUploads", () => ({
  default: () => <div>Mocked ListUploads</div>,
}));
vi.mock("../UploadResult", () => ({
  default: ({ webpageId }: { webpageId: string }) => (
    <div>Mocked UploadResult for {webpageId}</div>
  ),
}));

describe("ViewResult", () => {
    afterEach(() => {
        cleanup();
    })
  it("renders placeholder when no webpageId param", () => {
    render(
      <MemoryRouter initialEntries={["/view-result"]}>
        <Routes>
          <Route path="/view-result" element={<ViewResult />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Mocked ListUploads")).toBeInTheDocument();
    expect(screen.getByText(/Select a URL/)).toBeInTheDocument();
  });

  it("renders UploadResult when webpageId is present", () => {
    render(
      <MemoryRouter initialEntries={["/view-result/123"]}>
        <Routes>
          <Route path="/view-result/:webpageId" element={<ViewResult />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Mocked ListUploads")).toBeInTheDocument();
    expect(screen.getByText("Mocked UploadResult for 123")).toBeInTheDocument();
  });
});
