import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import LLMResponseView, { type LLMResponse } from ".";

describe("LLMResponseView", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders placeholder when llmResponseResult is null", () => {
    render(<LLMResponseView llmResponseResult={null} />);
    expect(screen.getByText("No LLM Result Available")).toBeInTheDocument();
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });

  it("renders Executive Summary", () => {
    const mock: LLMResponse = { "Executive Summary": "Test summary." };
    render(<LLMResponseView llmResponseResult={mock} />);
    expect(screen.getByText("Gemini Review:")).toBeInTheDocument();
    expect(screen.getByText("Executive Summary")).toBeInTheDocument();
    expect(screen.getByText("Test summary.")).toBeInTheDocument();
  });

  it("renders Detailed Analysis with Findings", () => {
    const mock: LLMResponse = {
      "Detailed Analysis": {
        "Content Discrepancies": {
          Summary: "Content summary",
          Findings: [
            {
              Issue: "Missing content",
              Section: "Header",
              Details: "Details here",
              Code: "<div></div>",
              "Recommended Fix": "Fix it",
            },
          ],
        },
      },
    };
    render(<LLMResponseView llmResponseResult={mock} />);

    expect(screen.getByText("Detailed Analysis")).toBeInTheDocument();
    expect(screen.getByText("Content Discrepancies")).toBeInTheDocument();
    expect(screen.getByText("Content summary")).toBeInTheDocument();

    const listItem = screen.getByRole("listitem");
    expect(listItem).toHaveTextContent("Issue: Missing content");
    expect(listItem).toHaveTextContent("Section: Header");
    expect(listItem).toHaveTextContent("Details: Details here");
    expect(listItem).toHaveTextContent("Code: <div></div>");
    expect(listItem).toHaveTextContent("Recommended Fix: Fix it");
  });

  it("renders Non-LLM Evaluations with Key Findings and Recommended Fix", () => {
    const mock: LLMResponse = {
      "Non-LLM Evaluations": {
        "Accessibility Report": {
          Summary: "Accessibility summary",
          "Key Findings": [{ Issue: "Alt missing", "Recommended Fix": "Add alt" }],
          "Recommended Fix": "General fix",
        },
      },
    };
    render(<LLMResponseView llmResponseResult={mock} />);

    expect(screen.getByText("Non-LLM Evaluations")).toBeInTheDocument();
    expect(screen.getByText("Accessibility Report")).toBeInTheDocument();
    expect(screen.getByText("Accessibility summary")).toBeInTheDocument();

    const listItem = screen.getByRole("listitem");
    expect(listItem).toHaveTextContent("Issue: Alt missing");
    expect(listItem).toHaveTextContent("Recommended Fix: Add alt");

    expect(screen.getByText("General fix")).toBeInTheDocument();
  });

  it("renders Other Issues", () => {
    const mock: LLMResponse = {
      "Other Issues": [
        {
          Issue: "Deprecated tag",
          Details: "Use div instead",
          Code: "<font></font>",
          "Recommended Fix": "Replace with div",
        },
      ],
    };
    render(<LLMResponseView llmResponseResult={mock} />);
    expect(screen.getByText("Other Issues")).toBeInTheDocument();

    const listItem = screen.getByRole("listitem");
    expect(listItem).toHaveTextContent("Issue: Deprecated tag");
    expect(listItem).toHaveTextContent("Details: Use div instead");
    expect(listItem).toHaveTextContent("Code: <font></font>");
    expect(listItem).toHaveTextContent("Recommended Fix: Replace with div");
  });
});
