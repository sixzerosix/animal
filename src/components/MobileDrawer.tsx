import React from "react";
import { X, Heart } from "lucide-react";
import {
	Activity,
	Calendar,
	Video,
	ShoppingBag,
	Bell,
	Settings,
} from "lucide-react";

type NavItemProps = {
	icon: React.ComponentType<any>;
	label: string;
	active?: boolean;
	onClick?: () => void;
	badge?: number;
	showLabel?: boolean;
};

function NavItem({
	icon: Icon,
	label,
	active,
	onClick,
	badge,
	showLabel,
}: NavItemProps) {
	return (
		<button
			onClick={onClick}
			className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all relative ${
				active
					? "bg-indigo-600 text-white shadow-lg"
					: "text-slate-500 hover:bg-slate-50"
			}`}
		>
			<Icon size={22} className="shrink-0" />
			<span
				className={`font-bold text-sm ${
					showLabel ? "block" : "hidden lg:block"
				}`}
			>
				{label}
			</span>
			{(badge ?? 0) > 0 && !active && (
				<span className="absolute right-4 top-1/2 -translate-y-1/2 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
					{badge}
				</span>
			)}
		</button>
	);
}

export type MobileDrawerProps = {
	open: boolean;
	onClose: () => void;
	activeTab: string;
	unreadNotifications: number;
	onNavClick: (tab: string) => void;
};

export function MobileDrawer({
	open,
	onClose,
	activeTab,
	unreadNotifications,
	onNavClick,
}: MobileDrawerProps) {
	// Auto-focus management and prevent scroll when drawer is open
	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [open]);

	if (!open) return null;

	return (
		<div className="md:hidden fixed inset-0 z-50 flex">
			{/* Drawer */}
			<aside className="w-72 bg-white border-r border-slate-200 p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
				<div className="flex items-center gap-3 mb-6">
					<div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl shrink-0">
						<Heart size={24} fill="currentColor" />
					</div>
					<span className="text-2xl font-black tracking-tight text-slate-800">
						VetCloud
					</span>
					<button
						onClick={onClose}
						className="ml-auto p-2 rounded-lg hover:bg-slate-100"
						aria-label="Close menu"
					>
						<X size={20} />
					</button>
				</div>

				<div className="space-y-1">
					<NavItem
						icon={Activity}
						label="Дашборд"
						showLabel
						active={activeTab === "dashboard"}
						onClick={() => {
							onNavClick("dashboard");
							onClose();
						}}
					/>
					<NavItem
						icon={Calendar}
						label="Приемы"
						showLabel
						active={activeTab === "appointments"}
						onClick={() => {
							onNavClick("appointments");
							onClose();
						}}
					/>
					<NavItem
						icon={Video}
						label="Консультации"
						showLabel
						active={activeTab === "telemed"}
						onClick={() => {
							onNavClick("telemed");
							onClose();
						}}
					/>
					<NavItem
						icon={ShoppingBag}
						label="Магазин"
						showLabel
						active={activeTab === "shop"}
						onClick={() => {
							onNavClick("shop");
							onClose();
						}}
					/>
					<div className="my-6 border-t border-slate-100" />
					<NavItem
						icon={Bell}
						label="Уведомления"
						showLabel
						badge={unreadNotifications}
						onClick={() => {
							onNavClick("notifications");
							onClose();
						}}
					/>
					<NavItem
						icon={Settings}
						label="Настройки"
						showLabel
						onClick={() => {
							onNavClick("settings");
							onClose();
						}}
					/>
				</div>

				<div className="mt-6">
					<div className="bg-slate-900 rounded-[2rem] p-5 text-white">
						<p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
							VetPass Plus
						</p>
						<p className="text-sm font-bold mb-4">
							Бесплатные выезды и скидки 15%
						</p>
						<button className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-xs font-bold transition-colors">
							Улучшить тариф
						</button>
					</div>
				</div>
			</aside>
			{/* Backdrop */}
			<div
				className="flex-1 bg-black/40 animate-in fade-in duration-300"
				onClick={onClose}
			/>
		</div>
	);
}
