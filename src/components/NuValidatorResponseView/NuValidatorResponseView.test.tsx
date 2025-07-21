import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import NuValidatorMessagesView, { type NuValidatorMessage } from ".";

describe("NuValidatorMessagesView", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders placeholder when messages is undefined", () => {
    render(<NuValidatorMessagesView messages={undefined as unknown as NuValidatorMessage[]} />);
    expect(
      screen.getByText(/No Validation Errors Found/i)
    ).toBeInTheDocument();
  });

  it("renders placeholder when messages is empty array", () => {
    render(<NuValidatorMessagesView messages={[]} />);
    expect(
      screen.getByText(/No Validation Errors Found/i)
    ).toBeInTheDocument();
  });

  it("renders validation message with highlighted text and location", () => {
    const mockMessages: NuValidatorMessage[] = [
      {
        Type: "error",
        Message: "An error occurred.",
        "Last Line": 10,
        "Last Column": 5,
        "First Column": 1,
        Extract: "<div>Invalid</div>",
        HiliteStart: 5,
        HiliteLength: 7,
      },
    ];

    render(<NuValidatorMessagesView messages={mockMessages} />);

    expect(screen.getByText("Validation Errors")).toBeInTheDocument();
    expect(screen.getByText("Type:")).toBeInTheDocument();
    expect(screen.getByText("error")).toBeInTheDocument();
    expect(screen.getByText("Message:")).toBeInTheDocument();
    expect(screen.getByText("An error occurred.")).toBeInTheDocument();
    expect(screen.getByText(/Location:/)).toBeInTheDocument();
    expect(
      screen.getByText(/Line 10, Column 5.*First Column: 1/)
    ).toBeInTheDocument();

    // Check highlighted text inside pre
    const highlighted = screen.getByText("Invalid");
    expect(highlighted).toBeInTheDocument();
    expect(highlighted).toHaveClass("highlighted-text");
  });

  it("renders multiple validation messages", () => {
    const mockMessages: NuValidatorMessage[] = [
      {
        Type: "warning",
        Message: "A warning occurred.",
        "Last Line": 20,
        "Last Column": 15,
        "First Column": 5,
        Extract: "<span>WarningText</span>",
        HiliteStart: 6,
        HiliteLength: 11,
      },
      {
        Type: "info",
        Message: "Just info.",
        "Last Line": 30,
        "Last Column": 25,
        "First Column": 10,
        Extract: "<p>InfoText</p>",
        HiliteStart: 3,
        HiliteLength: 8,
      },
    ];

    render(<NuValidatorMessagesView messages={mockMessages} />);

    expect(screen.getAllByText(/Type:/)).toHaveLength(2);
    expect(screen.getAllByText(/Message:/)).toHaveLength(2);
    expect(screen.getByText("warning")).toBeInTheDocument();
    expect(screen.getByText("A warning occurred.")).toBeInTheDocument();
    expect(screen.getByText("info")).toBeInTheDocument();
    expect(screen.getByText("Just info.")).toBeInTheDocument();

    // Highlighted texts
    expect(screen.getByText("WarningText")).toHaveClass("highlighted-text");
    expect(screen.getByText("InfoText")).toHaveClass("highlighted-text");
  });
});
