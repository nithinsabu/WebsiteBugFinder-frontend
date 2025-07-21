import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import PageSpeedResponseView, { type PageSpeedResponse } from ".";

describe("PageSpeedResponseView", () => {
  afterEach(() => {
    cleanup();
  });

  const mockData: PageSpeedResponse = {
    loadingExperience: {
      metrics: {
        CUMULATIVE_LAYOUT_SHIFT_SCORE: {
          percentile: 0.1,
          distributions: [
            { min: 0, max: 0.1, proportion: 0.8 },
            { min: 0.1, max: 0.25, proportion: 0.15 },
            { min: 0.25, proportion: 0.05 },
          ],
          category: "FAST",
        },
        EXPERIMENTAL_TIME_TO_FIRST_BYTE: {
          percentile: 800,
          distributions: [
            { min: 0, max: 800, proportion: 0.7 },
            { min: 800, max: 1600, proportion: 0.2 },
            { min: 1600, proportion: 0.1 },
          ],
          category: "AVERAGE",
        },
        FIRST_CONTENTFUL_PAINT_MS: {
          percentile: 1000,
          distributions: [
            { min: 0, max: 1000, proportion: 0.6 },
            { min: 1000, max: 3000, proportion: 0.3 },
            { min: 3000, proportion: 0.1 },
          ],
          category: "FAST",
        },
        INTERACTION_TO_NEXT_PAINT: {
          percentile: 200,
          distributions: [
            { min: 0, max: 200, proportion: 0.9 },
            { min: 200, max: 500, proportion: 0.05 },
            { min: 500, proportion: 0.05 },
          ],
          category: "FAST",
        },
        LARGEST_CONTENTFUL_PAINT_MS: {
          percentile: 2500,
          distributions: [
            { min: 0, max: 2500, proportion: 0.75 },
            { min: 2500, max: 4000, proportion: 0.15 },
            { min: 4000, proportion: 0.1 },
          ],
          category: "FAST",
        },
      },
      overall_category: "FAST",
      labTest: false,
    },
    lighthouseResult: {
      categories: {
        performance: { score: 0.95 },
        seo: { score: 0.85 },
        "best-practices": { score: 0.7 },
        accessibility: { score: 0.6 },
      },
    },
  };

  it("renders fallback when data is null", () => {
    render(<PageSpeedResponseView data={null} />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Failed to load PageSpeed data/i })
    ).toBeInTheDocument();
  });

  it("renders main headings and overall category", () => {
    render(<PageSpeedResponseView data={mockData} />);
  
    expect(screen.getByRole("heading", { name: /PageSpeed Metrics/i })).toBeInTheDocument();
expect(screen.getByText(/Overall Category:/i).parentElement).toHaveTextContent(/Overall Category:\s*FAST/i)
    expect(screen.getByRole("heading", { name: /Lighthouse Scores/i })).toBeInTheDocument();
  });
  
  it("renders all metric headings", () => {
    render(<PageSpeedResponseView data={mockData} />);
  
    expect(
      screen.getByText("Cumulative Layout Shift")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Time To First Byte")
    ).toBeInTheDocument();
    expect(
      screen.getByText("First Contentful Paint")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Interaction To Next Paint")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Largest Contentful Paint")
    ).toBeInTheDocument();
  });
  
  

  it("renders histogram bars with correct class and title", () => {
    render(<PageSpeedResponseView data={mockData} />);
    const histogramBars = screen.getAllByTitle(/Proportion:/i);
    expect(histogramBars.length).toBeGreaterThan(0);
    histogramBars.forEach((bar) => {
      expect(bar).toHaveClass("histogram-bar");
    });
  });

  it("renders all 75th percentile values", () => {
    render(<PageSpeedResponseView data={mockData} />);
    expect(screen.getAllByText(/75th percentile:/i)).toHaveLength(5);
  });

  it("renders lighthouse scores with correct labels", () => {
    render(<PageSpeedResponseView data={mockData} />);
    expect(screen.getByText("Performance: 95%")).toBeInTheDocument();
    expect(screen.getByText("Seo: 85%")).toBeInTheDocument();
    expect(screen.getByText("Best practices: 70%")).toBeInTheDocument();
    expect(screen.getByText("Accessibility: 60%")).toBeInTheDocument();
  });
});
