import React from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";

export type ShopItem = {
	id: string;
	name: string;
	price: number;
	category: string;
	img?: string;
};

export type CartModalProps = {
	items: ShopItem[];
	onClose: () => void;
	onRemove: (idx: number) => void;
};

export function CartModal({ items, onClose, onRemove }: CartModalProps) {
	const total = items.reduce((sum, i) => sum + i.price, 0);

	return (
		<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-end">
			<div className="bg-white w-full max-w-md h-screen p-10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
				<div className="flex justify-between items-center mb-10">
					<h3 className="text-3xl font-black">Корзина</h3>
					<button
						onClick={onClose}
						className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
					>
						<X size={28} />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto space-y-6 pr-4">
					{items.length === 0 ? (
						<div className="text-center py-20">
							<ShoppingBag
								size={48}
								className="mx-auto text-slate-200 mb-4"
							/>
							<p className="text-slate-400 font-bold">
								Корзина пуста
							</p>
						</div>
					) : (
						items.map((item, i) => (
							<div
								key={i}
								className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl hover:bg-slate-100 transition-colors"
							>
								<img
									src={item.img}
									className="w-16 h-16 rounded-2xl object-cover"
									alt={item.name}
								/>
								<div className="flex-1">
									<p className="font-bold text-sm">
										{item.name}
									</p>
									<p className="font-black text-indigo-600">
										{item.price} ₽
									</p>
								</div>
								<button
									onClick={() => onRemove(i)}
									className="text-slate-300 hover:text-rose-500 transition-colors p-2"
								>
									<Trash2 size={18} />
								</button>
							</div>
						))
					)}
				</div>

				{items.length > 0 && (
					<div className="pt-8 border-t border-slate-100 mt-auto">
						<div className="flex justify-between items-end mb-6">
							<p className="text-slate-400 font-bold">Итого:</p>
							<p className="text-3xl font-black">{total} ₽</p>
						</div>
						<button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">
							Оформить заказ
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
