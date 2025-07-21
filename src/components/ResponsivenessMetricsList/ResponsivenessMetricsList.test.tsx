import { render, screen, cleanup } from "@testing-library/react";
import ResponsivenessMetricsList, { type ResponsivenessMetrics } from ".";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

describe("ResponsivenessMetricsList", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders heading", () => {
    render(<ResponsivenessMetricsList data={[]} />);
    expect(
      screen.getByRole("heading", { name: /Responsiveness Metrics/i })
    ).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<ResponsivenessMetricsList data={[]} />);
    expect(screen.getByText(/Viewport/i)).toBeInTheDocument();
    expect(screen.getByText(/Overflow/i)).toBeInTheDocument();
    // expect(screen.getByText(/Images Oversize/i)).not.toBeInTheDocument(); // Column commented in component
  });

  it("renders single row with correct values", () => {
    const mockData: ResponsivenessMetrics[] = [
      { Viewport: "width=device-width", Overflow: true, ImagesOversize: false },
    ];

    render(<ResponsivenessMetricsList data={mockData} />);
    expect(screen.getByText("width=device-width")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    // ImagesOversize column is commented out in component
  });

  it("renders multiple rows with correct fallback for undefined Viewport", () => {
    const mockData: ResponsivenessMetrics[] = [
      { Viewport: "viewport-1", Overflow: true },
      { Overflow: false },
    ];

    render(<ResponsivenessMetricsList data={mockData} />);
    expect(screen.getByText("viewport-1")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument(); // Fallback for missing Viewport
    expect(screen.getAllByText("No")).toHaveLength(1); // Overflow false
  });

  it("renders no rows when data array is empty", () => {
    render(<ResponsivenessMetricsList data={[]} />);
    // Table headers should exist but no data rows
    expect(screen.getByText(/Viewport/i)).toBeInTheDocument();
    expect(screen.queryByText("-")).not.toBeInTheDocument();
  });
});
