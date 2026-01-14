import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petCreateSchema, PetCreate } from "@/lib/validators/pet";
import { usePetsStore } from "@/store/pets";
import { v4 as uuidv4 } from "uuid";
import { Camera } from "lucide-react";

export default function AddPetForm({ onClose }: { onClose: () => void }) {
	const addPet = usePetsStore((s) => s.addPet);
	const [gender, setGender] = useState<string>("Мужской");

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<PetCreate>({
		resolver: zodResolver(petCreateSchema),
		defaultValues: {
			name: "",
			breed: "",
			gender: "Мужской",
			photo_url: "",
			weight: 1.0,
		},
	});

	const onSubmit = (data: PetCreate) => {
		const newPet = {
			id: uuidv4(),
			name: data.name,
			species: "",
			breed: data.breed,
			birth_date: new Date().toISOString().split("T")[0],
			gender: gender || "Мужской",
			weight:
				typeof data.weight === "number"
					? data.weight
					: Number(data.weight || 0),
			activity_level: "",
			photo_url:
				data.photo_url ||
				"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400",
			medical_history: [],
			reminders: [],
		};

		addPet(newPet);
		reset();
		onClose();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Photo + Name & Breed Section */}
			<div className="flex gap-4">
				<button
					type="button"
					className="w-24 h-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-400 transition-all shrink-0"
				>
					<Camera size={24} />
					<span className="text-[10px] font-black mt-1 uppercase">
						Фото
					</span>
				</button>

				<div className="flex-1 space-y-4">
					<div>
						<label className="block text-sm font-bold text-slate-600 mb-2">
							Кличка
						</label>
						<input
							placeholder="Кличка питомца"
							className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-200 focus:ring-1 focus:ring-indigo-100 transition-all"
							{...register("name")}
						/>
						{errors.name && (
							<p className="text-rose-500 text-xs mt-1 font-bold">
								{errors.name.message}
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-bold text-slate-600 mb-2">
							Порода
						</label>
						<input
							placeholder="Порода"
							className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-200 focus:ring-1 focus:ring-indigo-100 transition-all"
							{...register("breed")}
						/>
						{errors.breed && (
							<p className="text-rose-500 text-xs mt-1 font-bold">
								{errors.breed.message}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Gender Selection */}
			<div>
				<label className="block text-sm font-bold text-slate-600 mb-3">
					Пол
				</label>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setGender("Мужской")}
						className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${
							gender === "Мужской"
								? "bg-indigo-600 text-white"
								: "bg-slate-50 text-slate-400 border border-slate-100 hover:border-indigo-200"
						}`}
					>
						Мужской
					</button>
					<button
						type="button"
						onClick={() => setGender("Женский")}
						className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${
							gender === "Женский"
								? "bg-indigo-600 text-white"
								: "bg-slate-50 text-slate-400 border border-slate-100 hover:border-indigo-200"
						}`}
					>
						Женский
					</button>
				</div>
			</div>

			{/* Photo URL (hidden but functional) */}
			<input type="hidden" {...register("photo_url")} />

			{/* Weight */}
			<div>
				<label className="block text-sm font-bold text-slate-600 mb-2">
					Вес (кг)
				</label>
				<input
					type="number"
					step="0.1"
					placeholder="1.2"
					className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-200 focus:ring-1 focus:ring-indigo-100 transition-all"
					{...(register("weight") as any)}
				/>
				{errors.weight && (
					<p className="text-rose-500 text-xs mt-1 font-bold">
						{errors.weight.message}
					</p>
				)}
			</div>

			{/* Buttons */}
			<div className="pt-4 space-y-3">
				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
				>
					Создать профиль
				</button>
				<button
					type="button"
					onClick={onClose}
					className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors"
				>
					Отмена
				</button>
			</div>
		</form>
	);
}
