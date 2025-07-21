import { render, screen } from "@testing-library/react";
import AxeViolationsView, { type AxeCoreViolation } from ".";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";

describe("AxeCoreResponseView", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders placeholder when violations is undefined", () => {
    render(<AxeViolationsView violations={undefined as unknown as AxeCoreViolation[]} />);
    expect(
      screen.getByText(/No Accessibility Violations/i)
    ).toBeInTheDocument();
  });

  it("renders placeholder when violations is empty array", () => {
    render(<AxeViolationsView violations={[]} />);
    expect(
      screen.getByText(/No Accessibility Violations/i)
    ).toBeInTheDocument();
  });

  it("renders violations with all details", () => {
    const mockViolations: AxeCoreViolation[] = [
      {
        Id: "color-contrast",
        Description: "Elements must have sufficient color contrast",
        Help: "https://example.com/help",
        Nodes: [
          {
            Impact: "serious",
            Html: "<button>Click me</button>",
            "Failure Summary": "Element has insufficient color contrast",
          },
        ],
      },
    ];

    render(<AxeViolationsView violations={mockViolations} />);

    expect(
      screen.getByText("Accessibility Violations (Axe Core)")
    ).toBeInTheDocument();

    expect(screen.getByText("color-contrast")).toBeInTheDocument();
    expect(
      screen.getByText(/Elements must have sufficient color contrast/)
    ).toBeInTheDocument();
    expect(screen.getByText(/https:\/\/example.com\/help/)).toBeInTheDocument();
    expect(screen.getByText(/Impact:/)).toBeInTheDocument();
    expect(screen.getByText("serious")).toBeInTheDocument();
    expect(screen.getByText(/Click me/)).toBeInTheDocument();
    expect(
      screen.getByText(/Element has insufficient color contrast/)
    ).toBeInTheDocument();
  });

  it("renders violation with missing optional fields", () => {
    const mockViolations: AxeCoreViolation[] = [
      {
        Nodes: [],
      },
    ];

    render(<AxeViolationsView violations={mockViolations} />);
    expect(screen.getByText("Unknown Violation")).toBeInTheDocument();
    expect(screen.getByText(/Description:/)).toBeInTheDocument();
    expect(screen.getByText(/Help:/)).toBeInTheDocument();
  });

  it("does not render nodes section if Nodes is empty", () => {
    const mockViolations: AxeCoreViolation[] = [
      {
        Id: "no-nodes",
        Nodes: [],
      },
    ];

    render(<AxeViolationsView violations={mockViolations} />);
    expect(screen.queryByText(/Affected Nodes:/)).not.toBeInTheDocument();
  });
});
