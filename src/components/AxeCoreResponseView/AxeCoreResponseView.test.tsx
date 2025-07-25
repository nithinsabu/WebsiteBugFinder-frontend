import { render, screen } from "@testing-library/react";
import AxeViolationsView, { type AxeCoreViolation } from ".";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";

describe("AxeCoreResponsView Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders error message if errorFlag is true", () => {
    render(
      <AxeViolationsView
        violations={[]}
        errorFlag={true}
      />
    );
    expect(
      screen.getByText(/Accessibility Violations failed to load/i)
    ).toBeInTheDocument();
  });

  it("renders placeholder when violations is undefined and errorFlag is false", () => {
    render(
      <AxeViolationsView
        violations={undefined as unknown as AxeCoreViolation[]}
        errorFlag={false}
      />
    );
    expect(
      screen.getByText(/No Accessibility Violations Found/i)
    ).toBeInTheDocument();
  });

  it("renders placeholder when violations is empty array and errorFlag is false", () => {
    render(
      <AxeViolationsView
        violations={[]}
        errorFlag={false}
      />
    );
    expect(
      screen.getByText(/No Accessibility Violations Found/i)
    ).toBeInTheDocument();
  });

  it("renders violations with all details", () => {
    const mockViolations: AxeCoreViolation[] = [
      {
        Id: "color-contrast",
        Description: "Elements must have sufficient color contrast",
        Help: "<html> element must have a lang attribute",
        Nodes: [
          {
            Impact: "serious",
            Html: "<button>Click me</button>",
            FailureSummary: "Element has insufficient color contrast",
          },
        ],
      },
    ];

    render(<AxeViolationsView violations={mockViolations} errorFlag={false} />);

    expect(
      screen.getByText(/Accessibility Violations from Axe Core/i)
    ).toBeInTheDocument();

    expect(screen.getByText("Rule: color-contrast")).toBeInTheDocument();
    expect(
      screen.getByText(/Elements must have sufficient color contrast/)
    ).toBeInTheDocument();
    expect(screen.getByText(/<html> element must have a lang attribute/)).toBeInTheDocument();
    expect(screen.getByText("Impact:")).toBeInTheDocument();
    expect(screen.getByText("serious")).toBeInTheDocument();
    expect(screen.getByText(/<button>Click me<\/button>/)).toBeInTheDocument();
    expect(screen.getByText(/Failure Summary:/)).toBeInTheDocument();
    expect(
      screen.getByText(/Element has insufficient color contrast/)
    ).toBeInTheDocument();
  });


  it("does not render nodes section if Nodes is empty", () => {
    const mockViolations: AxeCoreViolation[] = [
      {
        Id: "no-nodes",
        Nodes: [],
      },
    ];

    render(<AxeViolationsView violations={mockViolations} errorFlag={false} />);
    expect(screen.queryByText(/Affected Nodes/)).not.toBeInTheDocument();
  });
});
