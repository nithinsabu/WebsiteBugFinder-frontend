import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, beforeEach, afterEach, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import Login from ".";

describe("Login Component", () => {
  beforeEach(() => {
    render(<Login />);
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

    expect(nameInput).toHaveValue("Test User");
    expect(emailInput).toHaveValue("test@example.com");
  });
});
