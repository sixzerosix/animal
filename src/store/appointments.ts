import { create } from "zustand";

export type Appointment = {
	id: string;
	petName: string;
	doctor: string;
	date: string;
	time: string;
	status: string;
	type: string;
};

type AppointmentsState = {
	appointments: Appointment[];
	addAppointment: (appt: Appointment) => void;
	removeAppointment: (id: string) => void;
	setAppointments: (list: Appointment[]) => void;
};

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
	appointments: [
		{
			id: "a1",
			petName: "Барсик",
			doctor: "Иванов А.С. (Терапевт)",
			date: "2024-03-20",
			time: "14:30",
			status: "confirmed",
			type: "clinic",
		},
	],
	addAppointment: (appt) =>
		set((s) => ({ appointments: [appt, ...s.appointments] })),
	removeAppointment: (id) =>
		set((s) => ({ appointments: s.appointments.filter((a) => a.id !== id) })),
	setAppointments: (list) => set(() => ({ appointments: list })),
}));
