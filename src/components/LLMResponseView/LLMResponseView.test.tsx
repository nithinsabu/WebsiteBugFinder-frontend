import { cleanup, render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import LLMResponseView, {type LLMResponse } from ".";
import "@testing-library/jest-dom/vitest";

describe("LLMResponseView Component", () => {
  afterEach(() => {
    cleanup();
  })
  it("renders error message when errorFlag is true", () => {
    render(<LLMResponseView llmResponseResult={null} errorFlag={true} />);
    expect(screen.getByText(/Gemini Review failed to load/i)).toBeInTheDocument();
  });

  it("renders placeholder when llmResponseResult is null and no error", () => {
    render(<LLMResponseView llmResponseResult={null} errorFlag={false} />);
    expect(screen.getByText(/No Gemini Result Available/i)).toBeInTheDocument();
  });

  it("renders executive summary if present", () => {
    const mockResponse: LLMResponse = {
      "Executive Summary": "This is the summary.",
    };

    render(<LLMResponseView llmResponseResult={mockResponse} errorFlag={false} />);
    expect(screen.getByText(/Executive Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/This is the summary/i)).toBeInTheDocument();
  });

  it("renders all detailed analysis sections with findings", () => {
    const mockResponse: LLMResponse = {
      "Detailed Analysis": {
        "Content Discrepancies": {
          Summary: "Content issues found.",
          Findings: [
            {
              Issue: "Missing title tag",
              Section: "Header",
              Details: "The page is missing a <title> tag.",
              Category: "HTML",
              Code: "<head></head>",
              "Recommended Fix": "Add a <title> tag.",
            },
          ],
        },
        "Styling Discrepancies": {
          Summary: "Styling issues found.",
          Findings: [
            {
              Issue: "Inconsistent font sizes",
              Section: "Main content",
              Details: "Fonts vary too much across sections.",
              Category: "CSS",
              Code: "font-size: 12px; font-size: 20px;",
              "Recommended Fix": "Standardize font sizes.",
            },
          ],
        },
        "Intentional Flaws And Known Issues": {
          Summary: "Known intentional issues.",
          Findings: [
            {
              Issue: "Test element intentionally broken",
              Section: "Footer",
              Details: "For testing error boundaries.",
              Category: "Test",
              Code: "<div class='broken'></div>",
              "Recommended Fix": "No fix needed.",
            },
          ],
        },
        "Functional Discrepancies": {
          Summary: "Functional issues detected.",
          Findings: [
            {
              Issue: "Button not clickable",
              Section: "Contact form",
              Details: "JavaScript error blocks interaction.",
              Category: "JS",
              Code: "<button disabled></button>",
              "Recommended Fix": "Fix the JS error or remove disabled.",
            },
          ],
        },
      },
    };
  
    render(<LLMResponseView llmResponseResult={mockResponse} errorFlag={false} />);
  
    // Common section header
    expect(screen.getByText(/Detailed Analysis/i)).toBeInTheDocument();
  
    // Content Discrepancies
    expect(screen.getByText(/Content Discrepancies/i)).toBeInTheDocument();
    expect(screen.getByText(/Content issues found/i)).toBeInTheDocument();
    expect(screen.getByText(/Missing title tag/i)).toBeInTheDocument();
    expect(screen.getByText(/Header/i)).toBeInTheDocument();
    expect(screen.getByText(/The page is missing a <title> tag./i)).toBeInTheDocument();
    expect(screen.getByText(/Add a <title> tag./i)).toBeInTheDocument();
  
    // Styling Discrepancies
    expect(screen.getByText(/Styling Discrepancies/i)).toBeInTheDocument();
    expect(screen.getByText(/Styling issues found/i)).toBeInTheDocument();
    expect(screen.getByText(/Inconsistent font sizes/i)).toBeInTheDocument();
    expect(screen.getByText(/Main content/i)).toBeInTheDocument();
    expect(screen.getByText(/Fonts vary too much/i)).toBeInTheDocument();
    expect(screen.getByText(/Standardize font sizes/i)).toBeInTheDocument();
  
    // Intentional Flaws And Known Issues
    expect(screen.getByText(/Intentional Flaws And Known Issues/i)).toBeInTheDocument();
    expect(screen.getByText(/Known intentional issues/i)).toBeInTheDocument();
    expect(screen.getByText(/Test element intentionally broken/i)).toBeInTheDocument();
    expect(screen.getByText(/Footer/i)).toBeInTheDocument();
    expect(screen.getByText(/For testing error boundaries/i)).toBeInTheDocument();
    expect(screen.getByText(/No fix needed/i)).toBeInTheDocument();
  
    // Functional Discrepancies
    expect(screen.getByText(/Functional Discrepancies/i)).toBeInTheDocument();
    expect(screen.getByText(/Functional issues detected/i)).toBeInTheDocument();
    expect(screen.getByText(/Button not clickable/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact form/i)).toBeInTheDocument();
    expect(screen.getByText(/JavaScript error blocks interaction/i)).toBeInTheDocument();
    expect(screen.getByText(/Fix the JS error or remove disabled/i)).toBeInTheDocument();
  });
  

  it("renders all Non-LLM evaluations if present", () => {
    const mockResponse: LLMResponse = {
      "Non-LLM Evaluations": {
        "Accessibility Report": {
          Summary: "Accessibility summary",
          "Key Findings": [
            { Issue: "Low contrast text", "Recommended Fix": "Use higher contrast colors" },
          ],
          "Recommended Fix": "Fix accessibility.",
        },
        "Performance Report": {
          Summary: "Performance summary",
          "Key Findings": [
            { Issue: "Slow page load", "Recommended Fix": "Optimize images" },
          ],
          "Recommended Fix": "Improve performance.",
        },
        "Validation Report": {
          Summary: "Validation summary",
          "Key Findings": [
            { Issue: "Invalid HTML", "Recommended Fix": "Fix HTML structure" },
          ],
          "Recommended Fix": "Ensure valid markup.",
        },
        "Layout Report": {
          Summary: "Layout summary",
          "Key Findings": [
            { Issue: "Overlapping elements", "Recommended Fix": "Use flexbox properly" },
          ],
          "Recommended Fix": "Fix layout issues.",
        },
      },
    };
  
    render(<LLMResponseView llmResponseResult={mockResponse} errorFlag={false} />);
  
    // Accessibility Report
    expect(screen.getByText(/Accessibility Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Accessibility summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Low contrast text/i)).toBeInTheDocument();
    expect(screen.getByText(/Use higher contrast colors/i)).toBeInTheDocument();
    expect(screen.getByText(/Fix accessibility/i)).toBeInTheDocument();
  
    // Performance Report
    expect(screen.getByText(/Performance Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Slow page load/i)).toBeInTheDocument();
    expect(screen.getByText(/Optimize images/i)).toBeInTheDocument();
    expect(screen.getByText(/Improve performance/i)).toBeInTheDocument();
  
    // Validation Report
    expect(screen.getByText(/Validation Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Validation summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Invalid HTML/i)).toBeInTheDocument();
    expect(screen.getByText(/Fix HTML structure/i)).toBeInTheDocument();
    expect(screen.getByText(/Ensure valid markup/i)).toBeInTheDocument();
  
    // Layout Report
    expect(screen.getByText(/Layout Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Layout summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Overlapping elements/i)).toBeInTheDocument();
    expect(screen.getByText(/Use flexbox properly/i)).toBeInTheDocument();
    expect(screen.getByText(/Fix layout issues/i)).toBeInTheDocument();
  });
  

  it("renders other issues if present", () => {
    const mockResponse: LLMResponse = {
      "Other Issues": [
        {
          Issue: "Broken link",
          Details: "The link to /home does not work.",
        },
      ],
    };

    render(<LLMResponseView llmResponseResult={mockResponse} errorFlag={false} />);
    expect(screen.getByText(/Other Issues/i)).toBeInTheDocument();
    expect(screen.getByText(/Broken link/i)).toBeInTheDocument();
    expect(screen.getByText(/The link to \/home does not work./i)).toBeInTheDocument();
  });
});
