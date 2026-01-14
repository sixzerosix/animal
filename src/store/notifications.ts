import { create } from "zustand";

export type NotificationItem = {
	id: number;
	text: string;
	time: string;
	read: boolean;
};

type NotificationsState = {
	notifications: NotificationItem[];
	addNotification: (n: NotificationItem) => void;
	removeNotification: (id: number) => void;
	clearAllNotifications: () => void;
	setNotifications: (list: NotificationItem[]) => void;
};

export const useNotificationsStore = create<NotificationsState>((set) => ({
	notifications: [
		{
			id: 1,
			text: "Пора кормить Барсика",
			time: "5 мин назад",
			read: false,
		},
		{
			id: 2,
			text: "Запись к врачу завтра в 14:30",
			time: "1 час назад",
			read: false,
		},
	],
	addNotification: (n) =>
		set((s) => ({ notifications: [n, ...s.notifications] })),
	removeNotification: (id) =>
		set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
	clearAllNotifications: () => set(() => ({ notifications: [] })),
	setNotifications: (list) => set(() => ({ notifications: list })),
}));
