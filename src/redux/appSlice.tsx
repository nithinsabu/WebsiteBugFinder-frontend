import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  name: string;
  email: string;
  uploadURLs: string[];
}

const initialState: AppState = {
  name: "",
  email: "",
  uploadURLs: ['webpage-1', 'webpage-2'],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    addUploadURL(state, action: PayloadAction<string>) {
      state.uploadURLs.push(action.payload);
    },
    setUploadURLs(state, action: PayloadAction<string[]>) {
      state.uploadURLs = action.payload;
    },
    clearAll(state) {
      state.name = "";
      state.email = "";
      state.uploadURLs = [];
    },
  },
});

export const {
  setName,
  setEmail,
  addUploadURL,
  setUploadURLs,
  clearAll,
} = appSlice.actions;

export default appSlice.reducer;
