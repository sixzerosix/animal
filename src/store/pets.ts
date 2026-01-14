import { create } from "zustand";

export type MedicalRecord = {
  id: string;
  date: string;
  diagnosis: string;
  doctor: string;
  treatment: string;
  file?: string;
};

export type Reminder = {
  id: string;
  type: string;
  date: string;
  completed: boolean;
  category: string;
};

export type Pet = {
  id: string;
  name: string;
  species?: string;
  breed?: string;
  birth_date?: string;
  gender?: string;
  weight?: number;
  activity_level?: string;
  photo_url?: string;
  medical_history: MedicalRecord[];
  reminders: Reminder[];
};

type PetsState = {
  pets: Pet[];
  addPet: (p: Pet) => void;
  removePet: (id: string) => void;
  setPets: (list: Pet[]) => void;
};

export const usePetsStore = create<PetsState>((set) => ({
  pets: [],
  addPet: (p) => set((s) => ({ pets: [p, ...s.pets] })),
  removePet: (id) => set((s) => ({ pets: s.pets.filter((x) => x.id !== id) })),
  setPets: (list) => set(() => ({ pets: list })),
}));
