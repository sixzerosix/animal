import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, BookingData } from "@/lib/validators/booking";
import { X, ShieldCheck } from "lucide-react";

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
	medical_history: any[];
	reminders: any[];
};

export type BookingModalProps = {
	type: "clinic" | "grooming" | "telemed";
	pets: Pet[];
	onClose: () => void;
	onSave: (data: {
		petName?: string;
		doctor?: string;
		date?: string;
		time?: string;
		type?: string;
	}) => void;
};

export function BookingModal({
	type,
	pets,
	onClose,
	onSave,
}: BookingModalProps) {
	const [selectedPetId, setSelectedPetId] = useState<string>(
		pets[0]?.id || ""
	);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<BookingData>({
		resolver: zodResolver(bookingSchema),
		defaultValues: {
			petId: pets[0]?.id || "",
			date: "",
			time: "10:00",
		},
	});

	const onSubmit = (data: BookingData) => {
		const pet = pets.find((p) => p.id === selectedPetId);
		onSave({
			petName: pet?.name || "Питомец",
			doctor:
				type === "grooming"
					? "Грумер (выезд)"
					: type === "telemed"
					? "Онлайн-консультант"
					: "Терапевт (клиника)",
			date: data.date,
			time: data.time,
			type,
		});
	};

	return (
		<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="bg-white rounded-[3rem] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in-95 duration-200"
			>
				<div className="flex justify-between items-center mb-8">
					<h3 className="text-3xl font-black text-slate-800">
						Запись
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-slate-400 hover:text-slate-600 p-2"
					>
						<X size={28} />
					</button>
				</div>

				<div className="space-y-6">
					{/* Pet Selection */}
					<div>
						<label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
							Выберите питомца
						</label>
						<div className="grid grid-cols-3 gap-3">
							{pets.map((p) => (
								<button
									key={p.id}
									type="button"
									onClick={() => setSelectedPetId(p.id)}
									className={`p-3 rounded-2xl border-2 font-bold text-xs transition-all ${
										selectedPetId === p.id
											? "border-indigo-600 bg-indigo-50 text-indigo-600"
											: "border-slate-100 text-slate-400 hover:border-indigo-200"
									}`}
								>
									{p.name}
								</button>
							))}
						</div>
					</div>

					{/* Date & Time */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
								Дата
							</label>
							<input
								type="date"
								className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-200 focus:ring-1 focus:ring-indigo-100 transition-all"
								{...register("date")}
							/>
							{errors.date && (
								<p className="text-rose-500 text-xs mt-2 font-bold">
									{errors.date.message}
								</p>
							)}
						</div>

						<div>
							<label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
								Время
							</label>
							<input
								type="time"
								className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-200 focus:ring-1 focus:ring-indigo-100 transition-all"
								{...register("time")}
							/>
							{errors.time && (
								<p className="text-rose-500 text-xs mt-2 font-bold">
									{errors.time.message}
								</p>
							)}
						</div>
					</div>

					{/* Info Banner */}
					<div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-3">
						<ShieldCheck
							className="text-indigo-600 shrink-0"
							size={24}
						/>
						<p className="text-xs font-bold text-indigo-900">
							Вы получите напоминание за 2 часа до начала визита в
							приложении.
						</p>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
					>
						Подтвердить запись
					</button>
				</div>
			</form>
		</div>
	);
}
