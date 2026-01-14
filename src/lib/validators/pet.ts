import { z } from "zod";

export const petCreateSchema = z.object({
  name: z.string().min(1, "Введите кличку питомца"),
  breed: z.string().min(1, "Введите породу"),
  gender: z.enum(["Мужской", "Женский"]).optional(),
  photo_url: z.string().optional(),
  weight: z.union([z.string(), z.number()]).optional(),
});

export type PetCreate = z.infer<typeof petCreateSchema>;
