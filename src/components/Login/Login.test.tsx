import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import Login from ".";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
describe("Login Component", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ email: "test@example.com" }),
      } as Response)
    ));
    vi.stubGlobal("alert", vi.fn());
    const store = configureStore({
          reducer: {
              app: appReducer,
          },
          preloadedState: {
              app: {
                  email: "",
                  webpages: [],
              },
          },
      });
    
      render(
          <Provider store={store}>
              <MemoryRouter initialEntries={["/login"]}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/view-webpages" element={<h1>View Webpages Page</h1>} />
            </Routes>
              </MemoryRouter>
          </Provider>
      );
  });

  afterEach(() => {
    cleanup();
  });

  it("renders login form with login button", () => {
    const buttons = screen.getAllByRole("button", { name: "Login" });
    expect(buttons[0]).toBeInTheDocument(); // toggle button
    expect(buttons[1]).toBeInTheDocument(); // submit button
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("fills the Login form", async () => {
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getAllByRole("button", { name: "Login" })[1];
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("switches to signup form", async () => {
    const signupToggleButton = screen.getAllByRole("button", { name: "Signup" })[0];
    await userEvent.click(signupToggleButton);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("fills the signup form", async () => {
    const signupToggleButton = screen.getAllByRole("button", { name: "Signup" })[0];
    await userEvent.click(signupToggleButton);

    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getAllByRole("button", { name: "Signup" })[1];

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);

    expect(emailInput).toHaveValue("test@example.com");
  });

  it ("redirects to home page on successful login", async () => {
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getAllByRole("button", { name: "Login" })[1];
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);
    await screen.findByText("View Webpages Page");
});
})