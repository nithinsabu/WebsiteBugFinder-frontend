import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import ResponsivenessMetricsList, { type ResponsivenessMetrics } from ".";
import "@testing-library/jest-dom/vitest";

describe("ResponsivenessMetricsList", () => {
  afterEach(() => {
    cleanup();
  });

  it("displays error message when errorFlag is true", () => {
    render(<ResponsivenessMetricsList data={[]} errorFlag={true} />);
    expect(screen.getByText("Responsiveness Results failed to load.")).toBeInTheDocument();
  });

  it("displays table headers and data rows when data is provided and errorFlag is false", () => {
    const testData: ResponsivenessMetrics[] = [
      { Viewport: "320x480", Overflow: false },
      { Viewport: "768x1024", Overflow: true },
      { Viewport: "1920x1080", Overflow: false },
    ];

    render(<ResponsivenessMetricsList data={testData} errorFlag={false} />);

    expect(screen.getByText("Responsiveness Metrics")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Viewport")).toBeInTheDocument();
    expect(screen.getByText("Overflow")).toBeInTheDocument();

    expect(screen.getByText("320x480")).toBeInTheDocument();
    expect(screen.getByText("768x1024")).toBeInTheDocument();
    expect(screen.getByText("1920x1080")).toBeInTheDocument();

    // Overflow values
    const yesCells = screen.getAllByText("Yes");
    const noCells = screen.getAllByText("No");
    expect(yesCells).toHaveLength(1);
    expect(noCells).toHaveLength(2);
  });

  it("shows fallback '-' if Viewport is missing", () => {
    const data: ResponsivenessMetrics[] = [{ Overflow: true }];
    render(<ResponsivenessMetricsList data={data} errorFlag={false} />);
    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("renders nothing if data is empty and no error", () => {
    render(<ResponsivenessMetricsList data={[]} errorFlag={false} />);
    expect(screen.getByText("Responsiveness Metrics")).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Yes|No/ })).not.toBeInTheDocument(); // No rows
  });
});
