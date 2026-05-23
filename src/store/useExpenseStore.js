import { create } from "zustand";

const useExpenseStore = create((set) => ({
  total: 0,

  setTotal: (amount) =>
    set({ total: amount }),
}));

export default useExpenseStore;