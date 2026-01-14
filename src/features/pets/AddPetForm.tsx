import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petCreateSchema, PetCreate } from "@/lib/validators/pet";
import { usePetsStore } from "@/store/pets";
import { v4 as uuidv4 } from "uuid";

// shadcn/ui components (assumes you've added them)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddPetForm({ onClose }: { onClose: () => void }) {
  const addPet = usePetsStore((s) => s.addPet);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PetCreate>({
    resolver: zodResolver(petCreateSchema),
    defaultValues: { name: "", breed: "", gender: "Мужской", photo_url: "", weight: 1.0 },
  });

  const onSubmit = (data: PetCreate) => {
    const newPet = {
      id: uuidv4(),
      name: data.name,
      species: "",
      breed: data.breed,
      birth_date: new Date().toISOString().split("T")[0],
      gender: data.gender || "Мужской",
      weight: typeof data.weight === "number" ? data.weight : Number(data.weight || 0),
      activity_level: "",
      photo_url: data.photo_url || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400",
      medical_history: [],
      reminders: [],
    };

    addPet(newPet);
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Кличка</Label>
        <Input placeholder="Кличка питомца" {...register("name")} />
        {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label>Порода</Label>
        <Input placeholder="Порода" {...register("breed")} />
        {errors.breed && <p className="text-rose-500 text-sm mt-1">{errors.breed.message}</p>}
      </div>

      <div>
        <Label>Пол</Label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => {}} className="py-2 px-3 rounded-lg border">Мужской</button>
          <button type="button" onClick={() => {}} className="py-2 px-3 rounded-lg border">Женский</button>
        </div>
      </div>

      <div>
        <Label>Фото (URL)</Label>
        <Input placeholder="https://..." {...register("photo_url")} />
      </div>

      <div>
        <Label>Вес (кг)</Label>
        <Input type="number" step="0.1" {...register("weight") as any} />
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>Создать профиль</Button>
        <button type="button" onClick={onClose} className="text-sm text-slate-500">Отмена</button>
      </div>
    </form>
  );
}
