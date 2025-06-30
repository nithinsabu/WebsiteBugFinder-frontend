import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WebpageSummary {
  id: string;
  name?: string;
  uploadDate?: string;
  fileName?: string;
  url?: string;
}

interface AppState {
  email: string;
  webpages: WebpageSummary[];
}

const initialState: AppState = {
  email: "",
  webpages: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setWebpages(state, action: PayloadAction<WebpageSummary[]>) {
      state.webpages = action.payload;
    },
    addWebpage(state, action: PayloadAction<WebpageSummary>) {
      state.webpages.push(action.payload);
    },
    clearAll(state) {
      state.email = "";
      state.webpages = [];
    },
  },
});

export const {
  setEmail,
  setWebpages,
  addWebpage,
  clearAll,
} = appSlice.actions;

export default appSlice.reducer;
