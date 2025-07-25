import { cleanup, render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import NuValidatorMessagesView, {type NuValidatorMessage } from ".";
import "@testing-library/jest-dom/vitest";

describe("NuValidatorMessagesView", () => {
  const sampleMessages: NuValidatorMessage[] = [
    {
      Type: "error",
      "Last Line": 12,
      "Last Column": 5,
      "First Column": 3,
      Message: "Element “img” is missing required attribute “alt”.",
      Extract: '<img src="image.jpg">',
      HiliteStart: 0,
      HiliteLength: 4,
    },
    {
      Type: "warning",
      "Last Line": 24,
      "Last Column": 10,
      "First Column": 5,
      Message: "Consider adding a lang attribute to the <html> tag.",
      Extract: "<html>",
      HiliteStart: 0,
      HiliteLength: 6,
    },
  ];
  afterEach(() => {
    cleanup();
  })
  it("renders error message if errorFlag is true", () => {
    render(<NuValidatorMessagesView messages={sampleMessages} errorFlag={true} />);
    expect(screen.getByText(/Validator Results failed to load/i)).toBeInTheDocument();
  });

  it("renders no-validation placeholder if messages is empty and errorFlag is false", () => {
    render(<NuValidatorMessagesView messages={[]} errorFlag={false} />);
    expect(screen.getByText(/No Validation Errors Found/i)).toBeInTheDocument();
  });

  it("renders validation messages if present and errorFlag is false", () => {
    render(<NuValidatorMessagesView messages={sampleMessages} errorFlag={false} />);

    expect(screen.getByText(/Validation Errors/)).toBeInTheDocument();
    expect(screen.getByText(/\(2\)/)).toBeInTheDocument();
    expect(screen.getAllByText(/Type:/i)).toHaveLength(2);
    expect(screen.getByText("error")).toBeInTheDocument();
    expect(screen.getByText("warning")).toBeInTheDocument();

    expect(screen.getByText(/Element “img” is missing required attribute “alt”/)).toBeInTheDocument();
    expect(screen.getByText(/Consider adding a lang attribute/)).toBeInTheDocument();

    expect(screen.getByText(/Line 12, Column 5 \(First Column: 3\)/)).toBeInTheDocument();
    expect(screen.getByText(/Line 24, Column 10 \(First Column: 5\)/)).toBeInTheDocument();

    // check if highlighted text is present
    const highlighted = screen.getAllByText((content, node) => {
      return node?.className === "highlighted-text";
    });

    expect(highlighted.length).toBe(2);
    expect(highlighted[0]).toHaveTextContent("<img");
    expect(highlighted[1]).toHaveTextContent("<html>");
  });
});
