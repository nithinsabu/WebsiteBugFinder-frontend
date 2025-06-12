import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, it, afterEach, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import ListUploads from ".";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";

function renderWithState(uploadURLs: string[]) {
  const store = configureStore({
    reducer: {
      app: appReducer,
    },
    preloadedState: {
      app: {
        name: "",
        email: "",
        uploadURLs,
      },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <ListUploads />
      </MemoryRouter>
    </Provider>
  );
}

describe("ListUploads Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders message when no URLs are uploaded", () => {
    renderWithState([]);
    expect(screen.getByText("No URLs uploaded.")).toBeInTheDocument();
  });

  it("renders list of uploaded URLs", () => {
    const urls = ["abcdef", "pqrst"];
    renderWithState(urls);

    urls.forEach((url) => {
      expect(screen.getByRole("link", { name: url })).toBeInTheDocument();
    });
  });

  it("renders links with correct href", () => {
    const urls = ["abcdef"];
    renderWithState(urls);

    const link = screen.getByRole("link", { name: urls[0] });
    expect(link).toHaveAttribute(
      "href",
      `/view-webpage/${encodeURIComponent(urls[0])}`
    );
  });
});
