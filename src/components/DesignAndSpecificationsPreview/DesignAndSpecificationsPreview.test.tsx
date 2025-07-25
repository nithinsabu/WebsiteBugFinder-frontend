import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DesignAndSpecificationsPreview from ".";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// 🔁 Stub global fetch and import.meta.env
const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);
vi.stubGlobal("import.meta", { env: { VITE_API_URL: "https://mockapi.com" } });

// 🧪 Utility to render with store
const renderWithStore = () => {
  const store = configureStore({
    reducer: { app: appReducer },
    preloadedState: {
      app: { email: "test@example.com", webpages: [] },
    },
  });

  render(
    <Provider store={store}>
      <DesignAndSpecificationsPreview webpageId="12345" />
    </Provider>
  );
};

describe("DesignAndSpecificationsPreview", () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });
  afterEach(() => {
    cleanup();
  })
  it("renders both preview buttons", () => {
    renderWithStore();
    expect(screen.getByRole("button", { name: /preview design file/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /preview specifications/i })).toBeInTheDocument();
  });

  it("shows design image modal on successful fetch", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    renderWithStore();
    await userEvent.click(screen.getByRole("button", { name: /preview design file/i }));

    await waitFor(() => {
      expect(screen.getByAltText(/design file preview/i)).toBeInTheDocument();
    });
  });

  it("shows design error message on failed fetch", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      text: async () => "Design fetch failed",
    });

    renderWithStore();
    await userEvent.click(screen.getByRole("button", { name: /preview design file/i }));

    await waitFor(() => {
      expect(screen.getByText(/Design fetch failed/)).toBeInTheDocument();
    });
  });

  it("shows specifications modal on successful fetch", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: "Sample spec content" }),
    });

    renderWithStore();
    await userEvent.click(screen.getByRole("button", { name: /preview specifications/i }));

    await waitFor(() => {
      expect(screen.getByText("Sample spec content")).toBeInTheDocument();
    });
  });

  it("shows spec error message on failed fetch", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      text: async () => "Spec fetch failed",
    });

    renderWithStore();
    await userEvent.click(screen.getByRole("button", { name: /preview specifications/i }));

    await waitFor(() => {
      expect(screen.getByText(/Spec fetch failed/)).toBeInTheDocument();
    });
  });

  it("closes design modal when close button is clicked", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    renderWithStore();
    await userEvent.click(screen.getByRole("button", { name: /preview design file/i }));

    await waitFor(() => {
      expect(screen.getByAltText(/design file preview/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByAltText(/design file preview/i)).not.toBeInTheDocument();
  });

  it("closes spec modal when close button is clicked", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: "Spec content" }),
    });

    renderWithStore();
    await userEvent.click(screen.getByRole("button", { name: /preview specifications/i }));

    await waitFor(() => {
      expect(screen.getByText("Spec content")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByText("Spec content")).not.toBeInTheDocument();
  });
});
