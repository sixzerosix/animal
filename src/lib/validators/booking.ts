import { z } from "zod";

export const bookingSchema = z.object({
	petId: z.string().min(1, "Выберите питомца"),
	date: z.string().min(1, "Выберите дату"),
	time: z.string().min(1, "Выберите время"),
});

export type BookingData = z.infer<typeof bookingSchema>;
