import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, afterEach, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import Navbar from ".";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";
import { Provider } from "react-redux";
describe("Navbar", () => {
  function renderWithState(email: string){
    const store = configureStore({
      reducer: {
          app: appReducer,
      },
      preloadedState: {
          app: {
              email: email,
              webpages: [],
          },
      },
  });

  render(
      <Provider store={store}>
          <MemoryRouter>
              <Navbar />
          </MemoryRouter>
      </Provider>
  );
  }

  afterEach(() => {
    cleanup();
  });

  it("renders logo image and Login without Email", () => {
    renderWithState("");
    expect(screen.getByRole("img")).toHaveAttribute("src", "/logo.png");
    expect(screen.getByRole("link", { name: /webpage bug finder/i })).toHaveAttribute("href", "/");
    expect(screen.getByText("Login")).toHaveAttribute("href", "/login");
    expect(screen.queryByRole("link", { name: "Find Bug" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Your Webpages" })).not.toBeInTheDocument();
  });

  it("renders heading, logo image, Find Bug link, Your Webpages link without email", () => {
    renderWithState("email@email.com");
    expect(screen.getByRole("img")).toHaveAttribute("src", "/logo.png");
    expect(screen.getByRole("link", { name: /webpage bug finder/i })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Find Bug" })).toHaveAttribute("href", "/upload");
    expect(screen.getByRole("link", { name: "Your Webpages" })).toHaveAttribute("href", "/view-webpages");
  });

});
