import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, afterEach, expect } from "vitest";
import PageSpeedResponseView, { type PageSpeedResponse } from ".";
import "@testing-library/jest-dom/vitest";

describe("PageSpeedResponseView", () => {
  afterEach(() => cleanup());

  it("shows error when errorFlag is true", () => {
    render(<PageSpeedResponseView data={null} errorFlag={true} />);
    expect(screen.getByText(/Pagespeed Results failed to load/i)).toBeInTheDocument();
  });

  it("shows fallback when data is null and errorFlag is false", () => {
    render(<PageSpeedResponseView data={null} errorFlag={false} />);
    expect(screen.getByText(/PageSpeed data not available for HTML file/i)).toBeInTheDocument();
  });

  it("renders metrics and scores when data is present", () => {
    const mockData: PageSpeedResponse = {
      loadingExperience: {
        labTest: false,
        overall_category: "FAST",
        metrics: {
          CUMULATIVE_LAYOUT_SHIFT_SCORE: {
            percentile: 5,
            category: "FAST",
            distributions: [
              { min: 0, max: 0.1, proportion: 0.6 },
              { min: 0.1, max: 0.25, proportion: 0.3 },
              { min: 0.25, proportion: 0.1 },
            ],
          },
          EXPERIMENTAL_TIME_TO_FIRST_BYTE: {
            percentile: 100,
            category: "FAST",
            distributions: [
              { min: 0, max: 300, proportion: 0.5 },
              { min: 300, max: 600, proportion: 0.3 },
              { min: 600, proportion: 0.2 },
            ],
          },
          FIRST_CONTENTFUL_PAINT_MS: {
            percentile: 1500,
            category: "AVERAGE",
            distributions: [
              { min: 0, max: 1800, proportion: 0.7 },
              { min: 1800, max: 3000, proportion: 0.2 },
              { min: 3000, proportion: 0.1 },
            ],
          },
          INTERACTION_TO_NEXT_PAINT: {
            percentile: 200,
            category: "GOOD",
            distributions: [
              { min: 0, max: 200, proportion: 0.4 },
              { min: 200, max: 500, proportion: 0.4 },
              { min: 500, proportion: 0.2 },
            ],
          },
          LARGEST_CONTENTFUL_PAINT_MS: {
            percentile: 2100,
            category: "AVERAGE",
            distributions: [
              { min: 0, max: 2500, proportion: 0.5 },
              { min: 2500, max: 4000, proportion: 0.3 },
              { min: 4000, proportion: 0.2 },
            ],
          },
        },
      },
      lighthouseResult: {
        categories: {
          performance: { score: 0.92 },
          seo: { score: 0.88 },
          accessibility: { score: 0.75 },
          "best-practices": { score: 0.67 },
        },
      },
    };

    render(<PageSpeedResponseView data={mockData} errorFlag={false} />);

    expect(screen.getByText(/PageSpeed Metrics:/i)).toBeInTheDocument();
    expect(screen.getByText(/Overall Category:/i)).toBeInTheDocument();
    expect(screen.getByText(/Overall Category:/i).parentElement).toHaveTextContent(/FAST/i);
    
    // Check metric headings
    expect(screen.getByText("Cumulative Layout Shift")).toBeInTheDocument();
    expect(screen.getByText("Time To First Byte")).toBeInTheDocument();
    expect(screen.getByText("First Contentful Paint")).toBeInTheDocument();
    expect(screen.getByText("Interaction To Next Paint")).toBeInTheDocument();
    expect(screen.getByText("Largest Contentful Paint")).toBeInTheDocument();

    // Check Lighthouse Scores
    expect(screen.getByText("Performance: 92%")).toBeInTheDocument();
    expect(screen.getByText("Seo: 88%")).toBeInTheDocument();
    expect(screen.getByText("Accessibility: 75%")).toBeInTheDocument();
    expect(screen.getByText("Best practices: 67%")).toBeInTheDocument();
  });
});
