import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, beforeEach, afterEach, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/vitest";
import Navbar from ".";

describe("Navbar", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("renders logo image", () => {
    expect(screen.getByRole("img")).toHaveAttribute("src", "/logo.png");
  });

  it("renders heading", () => {
    expect(screen.getByText("Webpage Bug Finder")).toBeInTheDocument();
  });

  it("renders Login link", () => {
    const loginLink = screen.getByRole("link", { name: "Login" });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("renders Find Bug link", () => {
    const findBugLink = screen.getByRole("link", { name: "Find Bug" });
    expect(findBugLink).toBeInTheDocument();
    expect(findBugLink).toHaveAttribute("href", "/upload");
  });

  it("renders Your Webpages link", () => {
    const findBugLink = screen.getByRole("link", { name: "Your Webpages" });
    expect(findBugLink).toBeInTheDocument();
    expect(findBugLink).toHaveAttribute("href", "/view-webpages");
  });
});
