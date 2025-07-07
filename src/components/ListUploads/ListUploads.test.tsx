import { render, screen, cleanup } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { describe, it, afterEach, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import ListUploads from ".";
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../../redux/appSlice";
import type { WebpageSummary } from "../../redux/appSlice";
function renderWithState(webpages: WebpageSummary[]) {
    const store = configureStore({
        reducer: {
            app: appReducer,
        },
        preloadedState: {
            app: {
                email: "",
                webpages: webpages,
            },
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <ListUploads />
            </MemoryRouter>
        </Provider>
    );
}

describe("ListUploads Component", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders message when no URLs are uploaded", () => {
        renderWithState([]);
        expect(screen.getByText("No URLs uploaded.")).toBeInTheDocument();
    });

    it("renders list of uploaded URLs", () => {
        const webpages = [
            {
                id: "1",
                name: "Test Webpage",
                uploadDate: "2023-10-01",
                fileName: "test-webpage.html",
            },
            {
                id: "2",
                name: "Another Webpage",
                uploadDate: "2023-10-02",
                filename: "another-webpage.html",
            },
        ];
        renderWithState(webpages);

        webpages.forEach(webpage => {
            expect(screen.getByRole("link", { name: new RegExp(webpage.name, "i") })).toBeInTheDocument();
            expect(screen.getByText(new RegExp(new Date(webpage.uploadDate).toLocaleString(), "i"))).toBeInTheDocument();
        });
    });

    it("renders links with correct href", () => {
        const webpages = [
            {
                id: "1",
                name: "Test Webpage",
                uploadDate: "2023-10-01",
                fileName: "test-webpage.html",
            },
            {
                id: "2",
                name: "Another Webpage",
                uploadDate: "2023-10-02",
                filename: "another-webpage.html",
            },
        ];
        renderWithState(webpages);

        webpages.forEach(webpage => {
            expect(screen.getByRole("link", { name: new RegExp(webpage.name, "i") })).toHaveAttribute("href", `/view-webpage/${webpage.id}`);
        });
    });
});
