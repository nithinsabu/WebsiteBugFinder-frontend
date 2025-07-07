import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import Upload from ".";
describe("Upload", () => {

    beforeEach(() =>{
        vi.stubGlobal("fetch", vi.fn(() =>
            Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ email: "test@example.com" }),
            } as Response)
          ));
          vi.stubGlobal("alert", vi.fn());
          const store = configureStore({
                reducer: {
                    app: appReducer,
                },
                preloadedState: {
                    app: {
                        email: "",
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
    })
    afterEach(() => cleanup())
    it("Renders component", () => {
        expect(screen.getByRole("button", { name: "Upload HTML File" })).toBeInTheDocument();
        expect(screen.getByText("Enter URL:")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Upload HTML File" })).toBeInTheDocument();
        expect(screen.getByLabelText("Enter URL:")).toBeInTheDocument();
        expect(screen.getByLabelText("Optional: Upload design file:")).toBeInTheDocument();
        expect(screen.getByLabelText("Optional: Specifications design file:")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    });
    it("Upload HTML and Enter URL button toggles", async () => {
        await userEvent.click(screen.getByRole("button", { name: "Upload HTML File" }));
        expect(screen.getByRole("button", { name: "Enter URL" })).toBeInTheDocument();
        await userEvent.click(screen.getByRole("button", { name: "Enter URL" }));
        expect(screen.getByRole("button", { name: "Upload HTML File" })).toBeInTheDocument();
    });
    it("Upload files work", async () => {
        await userEvent.click(screen.getByRole("button", { name: "Upload HTML File" }));
        const htmlFileInput = screen.getByLabelText("Upload HTML File:") as HTMLInputElement;
        const designFileInput = screen.getByLabelText("Optional: Upload design file:") as HTMLInputElement;
        const specFileInput = screen.getByLabelText("Optional: Specifications design file:") as HTMLInputElement;

        const htmlFile = new File(["<html></html>"], "index.html", { type: "text/html" });
        const designFile = new File(["design"], "design.png", { type: "image/png" });
        const specFile = new File(["specs"], "specs.pdf", { type: "application/pdf" });

        await userEvent.upload(htmlFileInput, htmlFile);
        await userEvent.upload(designFileInput, designFile);
        await userEvent.upload(specFileInput, specFile);

        expect(htmlFileInput.files?.[0]).toBe(htmlFile);
        expect(htmlFileInput.files).toHaveLength(1);

        expect(designFileInput.files?.[0]).toBe(designFile);
        expect(designFileInput.files).toHaveLength(1);

        expect(specFileInput.files?.[0]).toBe(specFile);
        expect(specFileInput.files).toHaveLength(1);
    });
    it("Submit button Enables", async () => {
        await userEvent.click(screen.getByRole("button", { name: "Upload HTML File" }));
        const htmlFileInput = screen.getByLabelText("Upload HTML File:");
       
        const file = new File(["<html></html>"], "index.html", { type: "text/html" });
        await userEvent.upload(htmlFileInput, file);
        const submitButton = screen.getByRole("button", { name: /submit/i });
        expect(submitButton).toBeEnabled();
    });
});
