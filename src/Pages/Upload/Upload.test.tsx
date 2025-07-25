import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Upload from ".";

describe("Upload Component", () => {
    let alertMock: ReturnType<typeof vi.fn>;
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        alertMock = vi.fn();
        fetchMock = vi.fn(() =>
            Promise.resolve({
                ok: true,
                text: () => Promise.resolve("Uploaded successfully"),
            } as Response)
        );

        vi.stubGlobal("alert", alertMock);
        vi.stubGlobal("fetch", fetchMock);

        const store = configureStore({
            reducer: { app: appReducer },
            preloadedState: {
                app: {
                    email: "test@example.com",
                    webpages: [],
                },
            },
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Upload />
                </MemoryRouter>
            </Provider>
        );
    });

    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
    });

    it("renders all form inputs and buttons", () => {
        expect(screen.getByRole("button", { name: "Upload HTML File" })).toBeInTheDocument();
        expect(screen.getByText("Enter URL:")).toBeInTheDocument();
        expect(screen.getByLabelText("Enter URL:")).toBeInTheDocument();
        expect(screen.getByLabelText("Optional: Upload design file:")).toBeInTheDocument();
        expect(screen.getByLabelText("Optional: Specifications file:")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });

    it("toggles between upload and URL mode", async () => {
        await userEvent.click(screen.getByRole("button", { name: "Upload HTML File" }));
        expect(screen.getByRole("button", { name: "Enter URL" })).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "Enter URL" }));
        expect(screen.getByRole("button", { name: "Upload HTML File" })).toBeInTheDocument();
    });

    it("uploads files correctly", async () => {
        await userEvent.click(screen.getByRole("button", { name: "Upload HTML File" }));

        const htmlInput: HTMLInputElement = screen.getByLabelText("Upload HTML File:");
        const designInput: HTMLInputElement = screen.getByLabelText("Optional: Upload design file:");
        const specInput: HTMLInputElement = screen.getByLabelText("Optional: Specifications file:");

        const html = new File(["<html>"], "index.html", { type: "text/html" });
        const design = new File(["img"], "design.png", { type: "image/png" });
        const spec = new File(["pdf"], "spec.pdf", { type: "application/pdf" });

        await userEvent.upload(htmlInput, html);
        await userEvent.upload(designInput, design);
        await userEvent.upload(specInput, spec);

        expect(htmlInput.files?.[0]).toBe(html);
        expect(designInput.files?.[0]).toBe(design);
        expect(specInput.files?.[0]).toBe(spec);
    });

    it("enables submit button with valid HTML and name", async () => {
        await userEvent.click(screen.getByRole("button", { name: "Upload HTML File" }));

        const file = new File(["<html>"], "index.html", { type: "text/html" });
        const htmlInput = screen.getByLabelText("Upload HTML File:");
        const nameInput = screen.getByPlaceholderText("Project Name");

        await userEvent.upload(htmlInput, file);
        await userEvent.type(nameInput, "MyProject");

        expect(screen.getByRole("button", { name: /submit/i })).toBeEnabled();
    });

    it("disables submit button if HTML file and URL are missing, then enables it when either is provided", async () => {
        await userEvent.type(screen.getByPlaceholderText("Project Name"), "TestProject");
        const submitBtn = screen.getByRole("button", { name: /submit/i });
        expect(submitBtn).toBeDisabled();
        await userEvent.type(screen.getByLabelText(/Enter URL:/), "https://example.com");
        expect(submitBtn).toBeEnabled();
    });

    it("alerts for invalid characters in name", async () => {
        await userEvent.click(screen.getByRole("button", { name: "Upload HTML File" }));

        const html = new File(["<html>"], "index.html", { type: "text/html" });
        await userEvent.upload(screen.getByLabelText("Upload HTML File:"), html);

        await userEvent.type(screen.getByPlaceholderText("Project Name"), "Invalid<Name");
        await userEvent.click(screen.getByRole("button", { name: "Submit" }));
        expect(alertMock).toHaveBeenCalledWith("Project name cannot contain escape characters.");
    });

    it("alerts for invalid design file type", async () => {
        const user = userEvent.setup({ applyAccept: false });

        await userEvent.click(screen.getByRole("button", { name: "Upload HTML File" }));

        const html = new File(["<html>"], "index.html", { type: "text/html" });
        const badDesign = new File(["exe"], "design.exe", { type: "application/octet-stream" });

        await userEvent.upload(screen.getByLabelText("Upload HTML File:"), html);
        await user.upload(screen.getByLabelText("Optional: Upload design file:"), badDesign);
        await userEvent.type(screen.getByPlaceholderText("Project Name"), "Test");

        await userEvent.click(screen.getByRole("button", { name: "Submit" }));
        expect(alertMock).toHaveBeenCalledWith("Invalid design file format. Allowed: png, jpg, jpeg, gif, bmp, svg.");
    });

    it("alerts for invalid spec file type", async () => {
        const user = userEvent.setup({ applyAccept: false });
        await userEvent.click(screen.getByRole("button", { name: "Upload HTML File" }));

        const html = new File(["<html>"], "index.html", { type: "text/html" });
        const badSpec = new File(["dummy content"], "spec.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        await userEvent.upload(screen.getByLabelText("Upload HTML File:"), html);
        await user.upload(screen.getByLabelText("Optional: Specifications file:"), badSpec);
        await userEvent.type(screen.getByPlaceholderText("Project Name"), "Test");

        await userEvent.click(screen.getByRole("button", { name: "Submit" }));
        expect(alertMock).toHaveBeenCalledWith("Invalid specification file format. Allowed: txt, pdf.");
    });

    it("submits successfully with only URL", async () => {
        await userEvent.type(screen.getByPlaceholderText("Project Name"), "MyProject");
        await userEvent.type(screen.getByLabelText("Enter URL:"), "https://example.com");

        await userEvent.click(screen.getByRole("button", { name: "Submit" }));

        expect(fetchMock).toHaveBeenCalled();
        expect(alertMock).toHaveBeenCalledWith("Upload successful");
    });

    it("alerts when upload fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    text: () => Promise.resolve("Internal Error"),
                } as Response)
            )
        );

        await userEvent.type(screen.getByPlaceholderText("Project Name"), "MyProject");
        await userEvent.type(screen.getByLabelText("Enter URL:"), "https://example.com");

        await userEvent.click(screen.getByRole("button", { name: "Submit" }));

        expect(alertMock).toHaveBeenCalledWith("Upload failed: Internal Error");
    });
});
