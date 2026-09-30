import { create } from "zustand";

interface Data {
  id: number;
  todo: string;
  userId: number;
}

interface DataStore {
  data: Data[];
  setData: (data: Data[]) => void;

  selectedId: number | null;
  setSelectedId: (id: number) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  data: [],

  setData: (data) =>
    set({
      data,
    }),

  selectedId: null,

  setSelectedId: (id) =>
    set({
      selectedId: id,
    }),
}));
