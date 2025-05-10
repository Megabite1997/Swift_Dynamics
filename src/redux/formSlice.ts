import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CitizenId {
  segment1: string;
  segment2: string;
  segment3: string;
  segment4: string;
  segment5: string;
}
export interface FormData {
  title: string;
  firstname: string;
  lastname: string;
  birthday: string | null;
  nationality: string;
  citizenId: CitizenId;
  gender: string;
  phonePrefix: string;
  phoneNumber: string;
  passport: string;
  salary: string;
}
export interface Entry extends FormData {
  id: string;
}
export interface FormState {
  formData: FormData;
  entries: Entry[];
}

const initialFormData: FormData = {
  title: "",
  firstname: "",
  lastname: "",
  birthday: null,
  nationality: "",
  citizenId: {
    segment1: "",
    segment2: "",
    segment3: "",
    segment4: "",
    segment5: "",
  },
  gender: "",
  phonePrefix: "",
  phoneNumber: "",
  passport: "",
  salary: "",
};

const initialState: FormState = {
  formData: initialFormData,
  entries: [],
};

const slice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateForm(state, action: PayloadAction<{ field: string; value: any }>) {
      const { field, value } = action.payload;
      if (field.startsWith("segment")) {
        state.formData.citizenId[field as keyof CitizenId] = value;
      } else {
        (state.formData as any)[field] = value;
      }
    },
    resetForm(state) {
      state.formData = initialFormData;
    },
    addEntry(state) {
      const id = Date.now().toString();
      state.entries.push({ id, ...state.formData });
      localStorage.setItem("entries", JSON.stringify(state.entries));
    },
    updateEntry(state, action: PayloadAction<Entry>) {
      console.log("state: ", state);

      const idx = state.entries.findIndex((e) => e.id === action.payload.id);
      if (idx >= 0) {
        state.entries[idx] = action.payload;
        localStorage.setItem("entries", JSON.stringify(state.entries));
      }
    },
    deleteEntry(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter((e) => e.id !== action.payload);
      localStorage.setItem("entries", JSON.stringify(state.entries));
    },
    deleteMultiple(state, action: PayloadAction<string[]>) {
      state.entries = state.entries.filter(
        (e) => !action.payload.includes(e.id),
      );
      localStorage.setItem("entries", JSON.stringify(state.entries));
    },
    loadEntryToForm(state, action: PayloadAction<string>) {
      const entry = state.entries.find((e) => e.id === action.payload);
      if (entry) state.formData = { ...entry };
    },
    setEntries(state, action: PayloadAction<Entry[]>) {
      state.entries = action.payload;
    },
  },
});

export const {
  updateForm,
  resetForm,
  addEntry,
  updateEntry,
  deleteEntry,
  deleteMultiple,
  loadEntryToForm,
  setEntries,
} = slice.actions;

export default slice.reducer;
