"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
	Plus,
	Calendar,
	Clock,
	FileText,
	Bell,
	User,
	Settings,
	Activity,
	Heart,
	Search,
	ArrowLeft,
	Trash2,
	Camera,
	ChevronRight,
	CreditCard,
	ShieldCheck,
	Download,
	Filter,
	CheckCircle2,
	AlertCircle,
	X,
	ShoppingBag,
	Home,
	MessageSquare,
	Share2,
	Info,
	Zap,
	Video,
	Star,
	Menu,
	LogOut,
	ChevronLeft,
} from "lucide-react";

// --- TYPES ---
type MedicalRecord = {
	id: string;
	date: string;
	diagnosis: string;
	doctor: string;
	treatment: string;
	file?: string;
};

type Reminder = {
	id: string;
	type: string;
	date: string;
	completed: boolean;
	category: string;
};

type Pet = {
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

type ShopItem = {
	id: string;
	name: string;
	price: number;
	category: string;
	img?: string;
};

type Appointment = {
	id: string;
	petName: string;
	doctor: string;
	date: string;
	time: string;
	status: string;
	type: string;
};

type NotificationItem = {
	id: number;
	text: string;
	time: string;
	read: boolean;
};

type ModalsMap = {
	addPet: boolean;
	booking: boolean;
	grooming: boolean;
	consultation: boolean;
	cart: boolean;
};

// --- ИНИЦИАЛИЗАЦИЯ ДАННЫХ ---
const INITIAL_PETS = [
	{
		id: "1",
		name: "Барсик",
		species: "Кот",
		breed: "Британская короткошерстная",
		birth_date: "2021-05-12",
		gender: "Мужской",
		weight: 4.5,
		activity_level: "low",
		photo_url:
			"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500&auto=format&fit=crop",
		medical_history: [
			{
				id: "m1",
				date: "2023-10-15",
				diagnosis: "Ежегодная вакцинация",
				doctor: "Иванов А.С.",
				treatment: "Вакцина Nobivac",
				file: "vaccination_cert.pdf",
			},
		],
		reminders: [
			{
				id: "r1",
				type: "День рождения",
				date: "2024-05-12",
				completed: false,
				category: "event",
			},
			{
				id: "r2",
				type: "Обработка от клещей",
				date: "2024-04-01",
				completed: false,
				category: "health",
			},
		],
	},
];

const SHOP_ITEMS: ShopItem[] = [
	{
		id: "s1",
		name: "Premium Cat Food",
		price: 2500,
		category: "Корм",
		img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=400",
	},
	{
		id: "s2",
		name: 'Игрушка "Мышка"',
		price: 450,
		category: "Аксессуары",
		img: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=400",
	},
	{
		id: "s3",
		name: "Шампунь для кошек",
		price: 1200,
		category: "Уход",
		img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400",
	},
	{
		id: "s4",
		name: "Когтеточка XL",
		price: 3800,
		category: "Аксессуары",
		img: "https://images.unsplash.com/photo-1591586121043-9092898c6976?q=80&w=400",
	},
];

export default function App() {
	const [pets, setPets] = useState<Pet[]>(INITIAL_PETS as Pet[]);
	const [activeTab, setActiveTab] = useState<string>("dashboard");
	const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
	const [appointments, setAppointments] = useState<Appointment[]>([
		{
			id: "a1",
			petName: "Барсик",
			doctor: "Иванов А.С. (Терапевт)",
			date: "2024-03-20",
			time: "14:30",
			status: "confirmed",
			type: "clinic",
		},
	]);
	const [cart, setCart] = useState<ShopItem[]>([]);
	const [notifications, setNotifications] = useState<NotificationItem[]>([
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
	]);

	const [modals, setModals] = useState<ModalsMap>({
		addPet: false,
		booking: false,
		grooming: false,
		consultation: false,
		cart: false,
	});

	// mobile menu state for small screens
	const [mobileOpen, setMobileOpen] = useState<boolean>(false);

	const selectedPet = useMemo<Pet | undefined>(
		() => pets.find((p) => p.id === selectedPetId),
		[pets, selectedPetId]
	);

	// titles for non-dashboard sections
	const sectionTitles: Record<string, string> = {
		shop: "Маркет VetCloud",
		appointments: "Ваш календарь",
		social: "Сообщество",
		telemed: "Телемедицина",
		grooming_tab: "Груминг",
		notifications: "Уведомления",
		settings: "Настройки",
	};

	const toggleModal = (name: keyof ModalsMap, val: boolean) =>
		setModals((prev) => ({ ...prev, [name]: val }));

	// Обработка создания записи
	const handleCreateAppointment = (data: {
		petName?: string;
		doctor?: string;
		date?: string;
		time?: string;
		type?: string;
	}) => {
		const newAppt: Appointment = {
			id: Date.now().toString(),
			petName: data.petName || "Питомец",
			doctor: data.doctor || "Ветеринар",
			date: data.date || new Date().toISOString().split("T")[0],
			time: data.time || "12:00",
			status: "confirmed",
			type: data.type || "clinic",
		};
		setAppointments((prev) => [newAppt, ...prev]);
		(Object.keys(modals) as (keyof ModalsMap)[]).forEach((m) =>
			toggleModal(m, false)
		);
		setActiveTab("appointments");
	};

	// Удаление питомца
	const handleDeletePet = (id: string) => {
		if (confirm("Вы уверены, что хотите удалить профиль питомца?")) {
			setPets((prev) => prev.filter((p) => p.id !== id));
			setSelectedPetId(null);
		}
	};

	// Работа с корзиной
	const addToCart = (item: ShopItem) => {
		setCart((prev) => [...prev, item]);
		// Маленькое уведомление (имитация)
		setNotifications((prev) => [
			{
				id: Date.now(),
				text: `Добавлено в корзину: ${item.name}`,
				time: "сейчас",
				read: false,
			},
			...prev,
		]);
	};

	return (
		<div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
			{/* Sidebar - Desktop */}
			<nav className="w-20 lg:w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 hidden md:flex">
				<div className="p-6 lg:p-8 flex items-center gap-3">
					<div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl shadow-indigo-100 shrink-0 overflow-hidden">
						<svg
							className="size-8"
							width="469"
							height="469"
							viewBox="0 0 469 469"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M275.217 75.9635C270.945 74.6639 267.155 74.6697 262.07 76.0376C257.959 77.1247 254.565 78.6882 250.693 81.2416C227.525 96.6012 210.671 134.331 214.012 163.489C214.462 167.462 215.915 173.194 217.296 176.439C221.8 187.108 230.59 192.626 240.942 191.294C251.567 189.909 262.889 181.926 273.095 168.619C275.702 165.182 282.404 153.736 284.139 149.672C291.427 132.711 294.277 116.83 292.619 102.62C292.189 99.0817 290.694 93.2658 289.42 90.2032C288.225 87.3678 285.41 82.9594 283.639 81.1782C282.067 79.573 277.209 76.5754 275.217 75.9635Z"
								fill="#60FF82"
							/>
							<path
								d="M361.196 131.905C353.392 129.222 342.969 130.362 332.195 135.04C318.344 141.043 305.066 151.905 294.259 166.101C290.817 170.624 284.612 181.573 282.737 186.401C278.498 197.433 277.405 207.121 279.543 215.06C281.35 221.902 285.601 227.053 291.479 229.585C305.512 235.548 326.679 228.685 345.419 212.087C360.97 198.318 371.924 180.676 375.122 164.242C378.238 148.213 372.933 135.903 361.196 131.905Z"
								fill="#60FF82"
							/>
							<path
								d="M173.307 121.482C163.242 117.609 152.004 121.053 142.052 131.097C136.354 136.877 130.705 146.127 127.353 155.198C119.514 176.306 120.44 200.412 129.629 214.853C134.342 222.233 140.685 226.725 147.813 227.659C158.318 229.041 169.143 223.125 178.686 210.761C180.596 208.277 185.19 200.287 186.602 196.941C198.013 170.3 195.293 139.54 180.37 126.03C178.611 124.436 175.14 122.213 173.307 121.482Z"
								fill="#60FF82"
							/>
							<path
								d="M353.799 250.565C344.683 247.603 333.433 248.717 321.727 253.761C309.015 259.247 296.956 269.035 288.27 280.9C286.01 283.995 281.991 291.142 280.562 294.568C270.974 317.62 279.569 336.334 300.478 338.074C311.7 338.996 324.637 334.999 336.938 326.829C360.251 311.373 374.193 285.505 369.207 266.891C367.111 259.037 361.453 253.04 353.799 250.565Z"
								fill="#60FF82"
							/>
							<path
								d="M232.707 234.052C216.25 228.071 188.383 232.891 158.064 246.941C134.329 257.957 113.628 272.634 101.768 286.884C98.928 290.307 94.9562 297.058 94.0456 300.001C92.6403 304.588 92.66 308.161 94.0537 312.741C96.409 320.353 100.885 326.63 107.869 332.098C111.502 334.928 119.598 339.35 125.112 341.521C132.509 344.39 139.028 346.329 153.988 350.052C168.442 353.663 172.343 354.929 175.639 357.142C179.82 359.958 182.477 362.916 189.472 372.495C194.485 379.354 197.419 382.926 200.165 385.574C210.446 395.397 222.672 397.446 239.499 392.172C244.514 390.613 246.397 389.532 249.41 386.54C251.122 384.817 251.427 384.39 254.173 379.614C256.659 375.291 257.294 374.03 258.275 371.279C264.295 354.64 266.873 331.81 265.426 307.824C263.703 279.302 256.294 255.18 245.51 243.043C241.588 238.626 237.671 235.873 232.707 234.052Z"
								fill="#60FF82"
							/>
							<path
								d="M176.977 336.987C184.549 339.751 197.344 337.593 211.251 331.217C222.138 326.217 231.625 319.538 237.05 313.039C238.349 311.477 240.162 308.395 240.576 307.051C241.214 304.954 241.199 303.32 240.551 301.222C239.455 297.735 237.388 294.856 234.17 292.343C232.496 291.042 228.769 289.005 226.232 288.002C222.828 286.677 219.83 285.779 212.95 284.05C206.303 282.373 204.508 281.787 202.99 280.769C201.064 279.474 199.839 278.116 196.608 273.722C194.294 270.575 192.939 268.936 191.673 267.72C186.933 263.208 181.312 262.25 173.589 264.634C171.288 265.339 170.424 265.83 169.045 267.194C168.262 267.979 168.122 268.174 166.868 270.354C165.734 272.328 165.444 272.904 164.998 274.161C162.26 281.763 161.114 292.203 161.819 303.179C162.659 316.231 166.104 327.28 171.079 332.851C172.889 334.878 174.693 336.145 176.977 336.987Z"
								fill="#FF5557"
							/>
						</svg>
					</div>
					<span className="text-2xl font-black tracking-tight text-slate-800 hidden lg:block">
						<svg
							className="w-full"
							width="439"
							height="68"
							viewBox="0 0 439 68"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M61.7715 12.3355L57.9108 26.7426C56.31 32.2983 52.5434 36.4415 46.5169 39.4547C40.6788 42.2796 33.1456 44.4454 23.7292 45.7637L12.4296 47.3645L10.2638 65.9148L-6.21548e-05 67.2331L4.61397 8.66311L33.0515 3.29576C43.0329 1.41248 52.7317 2.43509e-05 58.0991 2.35412C61.3007 3.86074 63.1839 7.15648 61.7715 12.3355ZM48.306 15.9137C50.0951 8.00396 40.3963 8.85143 30.9799 10.5464L16.3845 13.183L12.9946 42.0913L26.1775 40.1139C30.8857 39.3605 35.1231 38.1364 38.7013 36.2531C42.4679 34.3699 44.6336 31.7333 45.4811 28.2492L48.306 15.9137ZM86.566 20.9986C104.175 18.0795 112.555 20.3394 109.354 33.4282L106.811 43.4096L68.2982 48.8711L67.6391 54.8976C66.9799 60.9241 73.3831 61.3949 82.517 60.2649C87.696 59.6058 94.005 58.1933 101.538 55.9334L100.126 61.4891C93.1575 63.2782 86.4718 64.5965 80.257 65.3498C64.5317 67.3272 56.9985 64.5965 57.5635 57.0634L58.6935 41.1497C59.4468 29.1908 69.2399 24.0118 86.566 20.9986ZM84.9652 27.3076C76.1138 28.72 70.1815 30.6975 69.5223 37.0064L68.769 43.7862L96.924 39.643L98.4307 32.4866C99.8431 25.8951 94.2875 25.7068 84.9652 27.3076ZM129.99 55.0859C129.237 60.9241 131.685 61.5832 140.254 60.4533C141.478 60.3591 144.209 59.7941 148.446 58.8525L147.505 63.3723C143.927 64.2198 140.16 64.879 136.205 65.3498C123.305 66.9506 119.161 65.1615 119.915 56.0276L122.269 31.1683L109.368 33.2399L109.745 27.5901L122.74 25.4243L124.246 9.51058L136.299 7.34481L134.228 23.4468L156.639 19.6803L155.415 25.8009L133.38 29.3792L129.99 55.0859ZM248.054 12.3355L244.193 26.7426C242.593 32.2983 238.826 36.4415 232.8 39.4547C226.961 42.2796 219.428 44.4454 210.012 45.7637L198.712 47.3645L196.547 65.9148L186.283 67.2331L190.897 8.66311L219.334 3.29576C229.316 1.41248 239.014 2.43509e-05 244.382 2.35412C247.583 3.86074 249.467 7.15648 248.054 12.3355ZM234.589 15.9137C236.378 8.00396 226.679 8.85143 217.263 10.5464L202.667 13.183L199.277 42.0913L212.46 40.1139C217.168 39.3605 221.406 38.1364 224.984 36.2531C228.751 34.3699 230.916 31.7333 231.764 28.2492L234.589 15.9137ZM262.773 65.8206C250.532 67.3272 245.165 65.5381 245.73 57.5342L248.084 26.2718L259.289 24.3885L255.711 55.8392C255.24 59.135 256.464 60.6416 260.137 60.9241C261.737 61.0182 263.809 60.9241 266.257 60.6416C271.813 59.8883 275.862 59.0408 278.216 58.005C280.57 56.9692 281.983 55.4626 282.453 53.4851L289.892 19.2095L302.134 17.1379L290.646 61.6774L280.288 62.9957L281.323 58.3817C279.534 62.0541 273.225 64.5965 262.773 65.8206ZM314.021 66.1031L304.699 67.2331L309.595 3.01327L321.648 0.659169L314.021 66.1031ZM348.965 48.4003C338.795 49.9069 331.827 47.9295 332.204 40.773L332.58 36.724C332.957 29.5675 342.091 24.2943 360.359 21.1869C362.336 20.9044 368.739 20.0569 379.568 18.7386L377.967 25.6126C370.811 25.8009 364.314 26.4601 358.852 27.3076C352.92 28.3434 348.776 29.3792 346.517 30.6975C344.445 31.9216 343.221 33.5224 343.032 35.594L342.562 39.3605C342.279 42.2796 345.575 43.2213 352.543 42.1855L359.323 41.2438C371.658 39.3605 377.214 41.903 375.707 48.6828L374.766 52.261C373.824 56.4984 371.093 59.6058 366.573 61.6774C362.242 63.749 356.404 65.1615 348.965 66.1031C343.409 66.7622 337.665 67.2331 331.639 67.3272L331.921 62.2424C340.302 62.1482 346.422 61.8657 349.812 61.3949C354.238 60.8299 357.628 60.1708 359.982 59.2291C362.336 58.3817 363.749 56.9692 364.125 54.9918L364.879 50.9427C365.726 46.8937 361.677 46.6112 355.274 47.5528L348.965 48.4003ZM412.469 20.9986C430.077 18.0795 438.458 20.3394 435.257 33.4282L432.714 43.4096L394.201 48.8711L393.542 54.8976C392.883 60.9241 399.286 61.3949 408.42 60.2649C413.599 59.6058 419.908 58.1933 427.441 55.9334L426.028 61.4891C419.06 63.2782 412.375 64.5965 406.16 65.3498C390.434 67.3272 382.901 64.5965 383.466 57.0634L384.596 41.1497C385.35 29.1908 395.143 24.0118 412.469 20.9986ZM410.868 27.3076C402.017 28.72 396.084 30.6975 395.425 37.0064L394.672 43.7862L422.827 39.643L424.333 32.4866C425.746 25.8951 420.19 25.7068 410.868 27.3076Z"
								fill="#4F39F6"
							/>
						</svg>
					</span>
				</div>

				<div className="flex-1 px-4 space-y-1 overflow-y-auto">
					<NavItem
						icon={Activity}
						label="Дашборд"
						active={activeTab === "dashboard"}
						onClick={() => {
							setActiveTab("dashboard");
							setSelectedPetId(null);
						}}
					/>
					<NavItem
						icon={Calendar}
						label="Приемы"
						active={activeTab === "appointments"}
						onClick={() => {
							setActiveTab("appointments");
							setSelectedPetId(null);
						}}
					/>
					<NavItem
						icon={Video}
						label="Консультации"
						active={activeTab === "telemed"}
						onClick={() => {
							setActiveTab("telemed");
							setSelectedPetId(null);
						}}
					/>
					<NavItem
						icon={ShoppingBag}
						label="Магазин"
						active={activeTab === "shop"}
						onClick={() => {
							setActiveTab("shop");
							setSelectedPetId(null);
						}}
					/>
					<NavItem
						icon={Home}
						label="Груминг"
						active={activeTab === "grooming_tab"}
						onClick={() => {
							setActiveTab("grooming_tab");
							setSelectedPetId(null);
						}}
					/>
					<NavItem
						icon={Share2}
						label="Сообщество"
						active={activeTab === "social"}
						onClick={() => {
							setActiveTab("social");
							setSelectedPetId(null);
						}}
					/>
					<div className="my-6 border-t border-slate-100 mx-4" />
					<NavItem
						icon={Bell}
						label="Уведомления"
						active={activeTab === "notifications"}
						badge={notifications.filter((n) => !n.read).length}
						onClick={() => setActiveTab("notifications")}
					/>
					<NavItem
						icon={Settings}
						label="Настройки"
						active={activeTab === "settings"}
						onClick={() => setActiveTab("settings")}
					/>
				</div>

				<div className="p-6 hidden lg:block">
					<div className="bg-slate-900 rounded-[2rem] p-5 text-white relative overflow-hidden group cursor-pointer">
						<div className="relative z-10">
							<p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
								VetPass Plus
							</p>
							<p className="text-sm font-bold mb-4">
								Бесплатные выезды и скидки 15%
							</p>
							<button className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-xs font-bold transition-all transform group-hover:scale-105">
								Улучшить тариф
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="flex-1 min-w-0">
				<header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 py-4 flex items-center justify-between">
					<div className="md:hidden flex items-center gap-3">
						<button
							onClick={() => setMobileOpen(true)}
							aria-label="Open menu"
							className="p-1 rounded-md"
						>
							<Menu className="text-slate-500" />
						</button>
						<span className="font-black text-xl">VetCloud</span>
					</div>

					<div className="hidden md:flex items-center bg-slate-100 rounded-2xl px-4 py-2 w-96 border border-transparent focus-within:border-indigo-200 transition-all">
						<Search size={18} className="text-slate-400" />
						<input
							type="text"
							placeholder="Поиск услуг, товаров..."
							className="bg-transparent border-none outline-none px-3 text-sm w-full font-medium"
						/>
					</div>

					<div className="flex items-center gap-4">
						<button
							onClick={() => toggleModal("cart", true)}
							className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 relative hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
						>
							<ShoppingBag size={20} />
							{cart.length > 0 && (
								<span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">
									{cart.length}
								</span>
							)}
						</button>
						<button
							onClick={() => setActiveTab("notifications")}
							className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 relative hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
						>
							<Bell size={20} />
							{notifications.some((n) => !n.read) && (
								<span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
							)}
						</button>
						<div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 cursor-pointer">
							ЮК
						</div>
					</div>
				</header>

				<div className="p-6 lg:p-10 max-w-7xl mx-auto">
					{selectedPet ? (
						<PetFullProfile
							pet={selectedPet}
							onBack={() => setSelectedPetId(null)}
							onBook={() => toggleModal("booking", true)}
							onGrooming={() => toggleModal("grooming", true)}
							onConsult={() => toggleModal("consultation", true)}
							onDelete={() => handleDeletePet(selectedPet.id)}
						/>
					) : (
						<div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
							{activeTab === "dashboard" ? (
								<WelcomeHeader
									onAddPet={() => toggleModal("addPet", true)}
								/>
							) : (
								<div className="flex items-center justify-between mb-6">
									<h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
										{sectionTitles[activeTab] || ""}
									</h1>
								</div>
							)}

							{activeTab === "dashboard" && (
								<DashboardContent
									pets={pets}
									onPetSelect={setSelectedPetId}
									onConsult={() =>
										toggleModal("consultation", true)
									}
								/>
							)}
							{activeTab === "shop" && (
								<ShopView
									items={SHOP_ITEMS}
									onAddToCart={addToCart}
									hideTitle
								/>
							)}
							{activeTab === "appointments" && (
								<AppointmentsView
									appointments={appointments}
									hideTitle
								/>
							)}
							{activeTab === "social" && <SocialFeed />}
							{activeTab === "telemed" && (
								<TelemedView
									onConsult={() =>
										toggleModal("consultation", true)
									}
									hideTitle
								/>
							)}
							{activeTab === "grooming_tab" && (
								<GroomingHomeView
									onOrder={() =>
										toggleModal("grooming", true)
									}
									hideTitle
								/>
							)}
							{activeTab === "notifications" && (
								<NotificationsView
									list={notifications}
									onClear={() => setNotifications([])}
									hideTitle
								/>
							)}
							{activeTab === "settings" && (
								<SettingsView hideTitle />
							)}
						</div>
					)}
				</div>

				{/* Mobile drawer */}
				{mobileOpen && (
					<div className="md:hidden fixed inset-0 z-50 flex">
						{/* Drawer */}
						<aside className="w-72 bg-white border-r border-slate-200 p-6 overflow-y-auto">
							<div className="flex items-center gap-3 mb-6">
								<div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl shrink-0">
									<Heart size={24} fill="currentColor" />
								</div>
								<span className="text-2xl font-black tracking-tight text-slate-800">
									VetCloud
								</span>
								<button
									onClick={() => setMobileOpen(false)}
									className="ml-auto p-2 rounded-lg"
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
										setActiveTab("dashboard");
										setSelectedPetId(null);
										setMobileOpen(false);
									}}
								/>
								<NavItem
									icon={Calendar}
									label="Приемы"
									showLabel
									active={activeTab === "appointments"}
									onClick={() => {
										setActiveTab("appointments");
										setMobileOpen(false);
									}}
								/>
								<NavItem
									icon={Video}
									label="Консультации"
									showLabel
									active={activeTab === "telemed"}
									onClick={() => {
										setActiveTab("telemed");
										setMobileOpen(false);
									}}
								/>
								<NavItem
									icon={ShoppingBag}
									label="Магазин"
									showLabel
									active={activeTab === "shop"}
									onClick={() => {
										setActiveTab("shop");
										setMobileOpen(false);
									}}
								/>
								<div className="my-6 border-t border-slate-100" />
								<NavItem
									icon={Bell}
									label="Уведомления"
									showLabel
									badge={
										notifications.filter((n) => !n.read)
											.length
									}
									onClick={() => {
										setActiveTab("notifications");
										setMobileOpen(false);
									}}
								/>
								<NavItem
									icon={Settings}
									label="Настройки"
									showLabel
									onClick={() => {
										setActiveTab("settings");
										setMobileOpen(false);
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
									<button className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-xs font-bold">
										Улучшить тариф
									</button>
								</div>
							</div>
						</aside>
						{/* Backdrop */}
						<div
							className="flex-1"
							onClick={() => setMobileOpen(false)}
						/>
					</div>
				)}
			</main>

			{/* MODALS */}
			{modals.addPet && (
				<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-3xl font-black">Новый питомец</h3>
							<button onClick={() => toggleModal("addPet", false)} className="p-2 hover:bg-slate-100 rounded-xl">
								<X size={24} />
							</button>
						</div>
						<div>
							{/* AddPetForm will add to mock store and close modal */}
							<AddPetForm onClose={() => toggleModal("addPet", false)} />
						</div>
					</div>
				</div>
			)}
			{modals.booking && (
				<BookingModal
					type="clinic"
					pets={pets}
					onClose={() => toggleModal("booking", false)}
					onSave={handleCreateAppointment}
				/>
			)}
			{modals.grooming && (
				<BookingModal
					type="grooming"
					pets={pets}
					onClose={() => toggleModal("grooming", false)}
					onSave={handleCreateAppointment}
				/>
			)}
			{modals.consultation && (
				<BookingModal
					type="telemed"
					pets={pets}
					onClose={() => toggleModal("consultation", false)}
					onSave={handleCreateAppointment}
				/>
			)}
			{modals.cart && (
				<CartModal
					items={cart}
					onClose={() => toggleModal("cart", false)}
					onRemove={(idx) =>
						setCart(cart.filter((_, i) => i !== idx))
					}
				/>
			)}
		</div>
	);
}

// --- КОМПОНЕНТЫ ---

function NavItem({
	icon: Icon,
	label,
	active,
	onClick,
	badge,
	showLabel,
}: {
	icon: React.ComponentType<any>;
	label: string;
	active?: boolean;
	onClick?: () => void;
	badge?: number;
	showLabel?: boolean;
}) {
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

function WelcomeHeader({ onAddPet }: { onAddPet: () => void }) {
	return (
		<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
			<div>
				<h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
					Привет, Юрий! 👋
				</h1>
				<p className="text-slate-500 font-semibold">
					Ваши питомцы чувствуют себя отлично сегодня.
				</p>
			</div>
			<button
				onClick={onAddPet}
				className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
			>
				<Plus size={20} /> Добавить питомца
			</button>
		</div>
	);
}

function DashboardContent({
	pets,
	onPetSelect,
	onConsult,
}: {
	pets: Pet[];
	onPetSelect: (id: string) => void;
	onConsult: () => void;
}) {
	return (
		<div className="space-y-10">
			<section>
				<h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
					<Heart
						className="text-rose-500"
						fill="currentColor"
						size={20}
					/>{" "}
					Ваши любимцы
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{pets.length === 0 ? (
						<div className="col-span-full py-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">
							У вас пока нет питомцев. Добавьте первого!
						</div>
					) : (
						pets.map((pet) => (
							<div
								key={pet.id}
								onClick={() => onPetSelect(pet.id)}
								className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden"
							>
								<div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-indigo-100 transition-colors" />
								<img
									src={pet.photo_url}
									className="w-20 h-20 rounded-3xl object-cover mb-4 relative z-10 shadow-md border-4 border-white"
									alt={pet.name}
								/>
								<h3 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
									{pet.name}
								</h3>
								<p className="text-slate-400 font-bold text-sm mb-4">
									{pet.breed}
								</p>
								<div className="flex gap-2">
									<span className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-500 uppercase rounded-full">
										{pet.weight} кг
									</span>
									<span className="px-3 py-1 bg-emerald-50 text-[10px] font-black text-emerald-500 uppercase rounded-full">
										Здоров
									</span>
								</div>
							</div>
						))
					)}
				</div>
			</section>

			<div className="grid md:grid-cols-2 gap-8">
				<section className="bg-indigo-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
					<div className="relative z-10">
						<div className="inline-flex items-center gap-2 bg-indigo-500/30 px-4 py-1.5 rounded-full mb-4">
							<Zap
								size={16}
								className="text-yellow-400"
								fill="currentColor"
							/>
							<span className="text-xs font-black uppercase tracking-widest">
								Vet AI Совет
							</span>
						</div>
						<h2 className="text-3xl font-black mb-4 leading-tight">
							Пора обновить диету
						</h2>
						<p className="text-indigo-100 font-medium mb-6 opacity-80">
							Рекомендуем добавить в рацион больше Омега-3 для
							поддержания блеска шерсти.
						</p>
						<button className="bg-white text-indigo-900 px-8 py-3.5 rounded-2xl font-black shadow-lg hover:bg-indigo-50 transition-colors">
							Посмотреть меню
						</button>
					</div>
				</section>

				<section className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-xl font-black">Быстрый доступ</h3>
						<Info size={18} className="text-slate-300" />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<button
							onClick={onConsult}
							className="p-4 bg-rose-50 rounded-2xl text-rose-600 flex flex-col items-center gap-2 hover:bg-rose-100 transition-colors"
						>
							<Video size={24} />
							<span className="text-xs font-black">
								Врач онлайн
							</span>
						</button>
						<button className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 flex flex-col items-center gap-2 hover:bg-indigo-100 transition-colors">
							<FileText size={24} />
							<span className="text-xs font-black">Справки</span>
						</button>
					</div>
				</section>
			</div>
		</div>
	);
}

function PetFullProfile({
	pet,
	onBack,
	onBook,
	onGrooming,
	onConsult,
	onDelete,
}: {
	pet: Pet;
	onBack: () => void;
	onBook: () => void;
	onGrooming: () => void;
	onConsult: () => void;
	onDelete: () => void;
}) {
	const [activeTab, setActiveTab] = useState("medical");

	return (
		<div className="animate-in fade-in zoom-in-95 duration-300">
			<div className="flex items-center justify-between mb-8">
				<button
					onClick={onBack}
					className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors"
				>
					<ChevronLeft size={24} /> Назад к списку
				</button>
				<button
					onClick={onDelete}
					className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
				>
					<Trash2 size={20} />
				</button>
			</div>

			<div className="grid lg:grid-cols-12 gap-8">
				<div className="lg:col-span-4 space-y-6">
					<div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm text-center">
						<div className="w-40 h-40 mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white mb-6">
							<img
								src={pet.photo_url}
								className="w-full h-full object-cover"
								alt={pet.name}
							/>
						</div>
						<h2 className="text-3xl font-black text-slate-900 mb-1">
							{pet.name}
						</h2>
						<p className="text-slate-400 font-bold mb-8">
							{pet.breed}
						</p>

						<div className="grid grid-cols-3 gap-3 mb-8">
							<div className="bg-slate-50 p-3 rounded-2xl">
								<p className="text-[10px] font-black text-slate-400 uppercase">
									Вес
								</p>
								<p className="text-sm font-black text-slate-800">
									{pet.weight}кг
								</p>
							</div>
							<div className="bg-slate-50 p-3 rounded-2xl">
								<p className="text-[10px] font-black text-slate-400 uppercase">
									Лет
								</p>
								<p className="text-sm font-black text-slate-800">
									3
								</p>
							</div>
							<div className="bg-slate-50 p-3 rounded-2xl">
								<p className="text-[10px] font-black text-slate-400 uppercase">
									Пол
								</p>
								<p className="text-sm font-black text-slate-800">
									{pet.gender === "Мужской" ? "М" : "Ж"}
								</p>
							</div>
						</div>

						<div className="space-y-3">
							<button
								onClick={onBook}
								className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
							>
								<Calendar size={20} /> Запись в клинику
							</button>
							<button
								onClick={onConsult}
								className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black bg-rose-50 text-rose-600 hover:bg-rose-100 active:scale-95 transition-all"
							>
								<Video size={20} /> Консультация
							</button>
						</div>
					</div>
				</div>

				<div className="lg:col-span-8 space-y-6">
					<div className="bg-white rounded-[2.2rem] p-2 border border-slate-100 shadow-sm flex gap-1">
						<TabButton
							active={activeTab === "medical"}
							onClick={() => setActiveTab("medical")}
							label="Медкарта"
							icon={FileText}
						/>
						<TabButton
							active={activeTab === "history"}
							onClick={() => setActiveTab("history")}
							label="История"
							icon={Clock}
						/>
					</div>

					<div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm min-h-[400px]">
						{activeTab === "medical" ? (
							<MedicalTab pet={pet} />
						) : (
							<HistoryTab pet={pet} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function TabButton({
	active,
	onClick,
	label,
	icon: Icon,
}: {
	active?: boolean;
	onClick?: () => void;
	label: string;
	icon: React.ComponentType<any>;
}) {
	return (
		<button
			onClick={onClick}
			className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all ${
				active
					? "bg-indigo-600 text-white shadow-lg"
					: "text-slate-400 hover:bg-slate-50"
			}`}
		>
			<Icon size={18} /> {label}
		</button>
	);
}

function MedicalTab({ pet }: { pet: Pet }) {
	return (
		<div className="space-y-8 animate-in fade-in duration-300">
			<h3 className="text-2xl font-black text-slate-800">
				Медицинская история
			</h3>
			{pet.medical_history.length === 0 ? (
				<p className="text-slate-400 font-medium italic">
					Записей пока нет.
				</p>
			) : (
				pet.medical_history.map((record) => (
					<div
						key={record.id}
						className="relative pl-10 border-l-2 border-slate-100 pb-10 last:pb-0"
					>
						<div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-indigo-600" />
						<div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
							<div className="flex justify-between mb-2">
								<span className="text-xs font-black text-indigo-500 uppercase">
									{record.date}
								</span>
								<span className="text-xs font-bold text-slate-400 italic">
									Врач: {record.doctor}
								</span>
							</div>
							<h4 className="text-xl font-black text-slate-800 mb-2">
								{record.diagnosis}
							</h4>
							<p className="text-slate-500 font-medium mb-4">
								{record.treatment}
							</p>
							<button className="flex items-center gap-2 text-xs font-black text-indigo-600 hover:underline">
								<Download size={14} /> Скачать {record.file}
							</button>
						</div>
					</div>
				))
			)}
		</div>
	);
}

function HistoryTab({ pet }: { pet: Pet }) {
	return (
		<div className="space-y-4 animate-in fade-in duration-300">
			<h3 className="text-2xl font-black mb-6">События и напоминания</h3>
			<div className="space-y-3">
				{pet.reminders.map((r) => (
					<div
						key={r.id}
						className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100 transition-all"
					>
						<div className="flex items-center gap-4">
							<div
								className={`p-3 rounded-xl ${
									r.category === "health"
										? "bg-indigo-100 text-indigo-600"
										: "bg-rose-100 text-rose-600"
								}`}
							>
								{r.category === "health" ? (
									<Heart size={20} />
								) : (
									<Star size={20} />
								)}
							</div>
							<div>
								<p className="font-bold text-slate-800">
									{r.type}
								</p>
								<p className="text-xs text-slate-400 font-bold uppercase">
									{r.date}
								</p>
							</div>
						</div>
						<button
							className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-all ${
								r.completed
									? "bg-emerald-100 text-emerald-600 cursor-default"
									: "bg-white border border-slate-200 text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600"
							}`}
						>
							{r.completed ? "Завершено" : "Выполнить"}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

function AppointmentsView({
	appointments,
	hideTitle,
}: {
	appointments: Appointment[];
	hideTitle?: boolean;
}) {
	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
			{!hideTitle && (
				<h2 className="text-3xl font-black">Ваш календарь</h2>
			)}
			<div className="grid gap-4">
				{appointments.length === 0 ? (
					<div className="p-12 text-center text-slate-400 font-bold">
						У вас нет запланированных визитов.
					</div>
				) : (
					appointments.map((appt) => {
						const dateStr = appt.date || "2024-01-01";
						const parts = dateStr.split("-");
						const day = parts[2] || "01";
						const monthNames = [
							"ЯНВ",
							"ФЕВ",
							"МАР",
							"АПР",
							"МАЙ",
							"ИЮН",
							"ИЮЛ",
							"АВГ",
							"СЕН",
							"ОКТ",
							"НОЯ",
							"ДЕК",
						];
						const month =
							monthNames[parseInt(parts[1]) - 1] || "???";

						return (
							<div
								key={appt.id}
								className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
							>
								<div className="flex items-center gap-6">
									<div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-3xl flex flex-col items-center justify-center text-indigo-600 border border-indigo-100 shrink-0">
										<span className="text-lg font-black">
											{day}
										</span>
										<span className="text-[10px] font-bold uppercase">
											{month}
										</span>
									</div>
									<div>
										<h4 className="text-xl md:text-2xl font-black text-slate-800">
											{appt.petName}
										</h4>
										<p className="font-bold text-slate-400 flex items-center gap-2">
											<User size={16} /> {appt.doctor}
										</p>
									</div>
								</div>
								<div className="flex items-center justify-between w-full md:w-auto md:text-right md:block">
									<p className="text-2xl font-black text-slate-800 md:mb-2">
										{appt.time}
									</p>
									<div className="flex flex-col items-end">
										<span
											className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase ${
												appt.status === "confirmed"
													? "bg-emerald-100 text-emerald-600"
													: "bg-slate-100 text-slate-400"
											}`}
										>
											{appt.status === "confirmed"
												? "Подтверждено"
												: "В ожидании"}
										</span>
										{appt.type === "telemed" && (
											<span className="text-[10px] font-bold text-rose-500 mt-1 uppercase">
												Онлайн-прием
											</span>
										)}
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

function ShopView({
	items,
	onAddToCart,
	hideTitle,
}: {
	items: ShopItem[];
	onAddToCart: (item: ShopItem) => void;
	hideTitle?: boolean;
}) {
	const [filter, setFilter] = useState<string>("Все");
	const categories = ["Все", ...new Set(items.map((i) => i.category))];

	const filtered =
		filter === "Все" ? items : items.filter((i) => i.category === filter);

	return (
		<div className="animate-in fade-in duration-500 space-y-8">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				{!hideTitle && (
					<h2 className="text-3xl font-black">Маркет VetCloud</h2>
				)}
				<div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
					{categories.map((c) => (
						<button
							key={c}
							onClick={() => setFilter(c)}
							className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
								filter === c
									? "bg-indigo-600 text-white"
									: "bg-white border border-slate-100 text-slate-400 hover:border-indigo-200"
							}`}
						>
							{c}
						</button>
					))}
				</div>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
				{filtered.map((item) => (
					<div
						key={item.id}
						className="group bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full"
					>
						<div className="relative overflow-hidden rounded-[1.8rem] mb-4 aspect-square">
							<img
								src={item.img}
								className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
								alt={item.name}
							/>
							<span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black text-indigo-600 uppercase">
								{item.category}
							</span>
						</div>
						<h4 className="font-bold text-slate-800 mb-1 px-2 flex-1">
							{item.name}
						</h4>
						<div className="flex items-center justify-between mt-4 px-2">
							<span className="font-black text-xl">
								{item.price} ₽
							</span>
							<button
								onClick={() => onAddToCart(item)}
								className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white active:scale-90 transition-all"
							>
								<Plus size={20} />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function SocialFeed() {
	const [liked, setLiked] = useState<Record<number, boolean>>({});
	const posts = [
		{
			id: 1,
			user: "Анна М.",
			pet: "Марс",
			text: "Первый раз в парке! 🎉 Теперь прогулки станут нашими любимыми. Всем советуем больше гулять!",
			likes: 124,
			img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600",
		},
		{
			id: 2,
			user: "Олег К.",
			pet: "Луна",
			text: "Мы сегодня молодцы на приеме у врача! Поправились на 300 грамм.",
			likes: 89,
			img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=600",
		},
	];

	const handleLike = (id: number) => {
		setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
			<div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
				<div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-indigo-600">
					ЮК
				</div>
				<input
					placeholder="Как дела у вашего питомца?"
					className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-3 outline-none font-medium"
				/>
				<button className="p-3 bg-indigo-600 text-white rounded-xl">
					<Camera size={20} />
				</button>
			</div>

			{posts.map((post) => (
				<div
					key={post.id}
					className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
				>
					<div className="p-6 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
							<div>
								<p className="font-black text-sm">
									{post.user}
								</p>
								<p className="text-[10px] text-slate-400 font-black uppercase">
									2 часа назад • питомец: {post.pet}
								</p>
							</div>
						</div>
						<button className="text-slate-300 hover:text-slate-500">
							<Share2 size={18} />
						</button>
					</div>
					<img
						src={post.img}
						className="w-full h-80 object-cover"
						alt="Post"
					/>
					<div className="p-6">
						<p className="font-medium text-slate-700 mb-6 leading-relaxed">
							{post.text}
						</p>
						<div className="flex items-center gap-4">
							<button
								onClick={() => handleLike(post.id)}
								className={`flex items-center gap-2 font-bold transition-all ${
									liked[post.id]
										? "text-rose-500 scale-110"
										: "text-slate-400"
								}`}
							>
								<Heart
									size={20}
									fill={
										liked[post.id] ? "currentColor" : "none"
									}
								/>
								{post.likes + (liked[post.id] ? 1 : 0)}
							</button>
							<button className="flex items-center gap-2 text-slate-400 font-bold">
								<MessageSquare size={20} /> 12
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

function NotificationsView({
	list,
	onClear,
	hideTitle,
}: {
	list: NotificationItem[];
	onClear: () => void;
	hideTitle?: boolean;
}) {
	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				{!hideTitle && (
					<h2 className="text-3xl font-black">Уведомления</h2>
				)}
				<button
					onClick={onClear}
					className="text-xs font-black text-rose-500 hover:underline"
				>
					Очистить всё
				</button>
			</div>
			<div className="space-y-3">
				{list.length === 0 ? (
					<p className="text-center py-20 text-slate-400 font-bold">
						У вас нет новых уведомлений
					</p>
				) : (
					list.map((n) => (
						<div
							key={n.id}
							className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-indigo-100 transition-colors"
						>
							<div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
								<Bell size={18} />
							</div>
							<div className="flex-1">
								<p className="font-bold text-slate-800 text-sm">
									{n.text}
								</p>
								<p className="text-[10px] font-black text-slate-400 uppercase mt-1">
									{n.time}
								</p>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}

function SettingsView({ hideTitle }: { hideTitle?: boolean }) {
	return (
		<div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
			{!hideTitle && (
				<h2 className="text-3xl font-black mb-10">
					Настройки аккаунта
				</h2>
			)}
			<div className="space-y-8">
				<div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
							ЮК
						</div>
						<div>
							<p className="font-black">Юрий Кондратьев</p>
							<p className="text-xs font-bold text-slate-400">
								yuriy@vetcloud.com
							</p>
						</div>
					</div>
					<button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:border-indigo-500 hover:text-indigo-600 transition-all">
						Изменить
					</button>
				</div>

				<div className="grid gap-4">
					<SettingItem
						icon={ShieldCheck}
						label="Безопасность и пароли"
					/>
					<SettingItem icon={CreditCard} label="Методы оплаты" />
					<SettingItem icon={Bell} label="Настройка уведомлений" />
					<SettingItem
						icon={Globe}
						label="Язык интерфейса"
						value="Русский"
					/>
				</div>

				<button className="w-full flex items-center justify-center gap-2 py-4 text-rose-500 font-black hover:bg-rose-50 rounded-2xl transition-all mt-8">
					<LogOut size={20} /> Выйти из аккаунта
				</button>
			</div>
		</div>
	);
}

function SettingItem({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ComponentType<any>;
	label: string;
	value?: string;
}) {
	return (
		<div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors group">
			<div className="flex items-center gap-4">
				<Icon
					size={20}
					className="text-slate-400 group-hover:text-indigo-600"
				/>
				<span className="font-bold text-slate-700">{label}</span>
			</div>
			<div className="flex items-center gap-2">
				{value && (
					<span className="text-xs font-bold text-slate-400">
						{value}
					</span>
				)}
				<ChevronRight size={18} className="text-slate-300" />
			</div>
		</div>
	);
}

function TelemedView({
	onConsult,
	hideTitle,
}: {
	onConsult: () => void;
	hideTitle?: boolean;
}) {
	return (
		<div className="bg-indigo-900 rounded-[3rem] p-16 text-center text-white relative overflow-hidden shadow-2xl animate-in zoom-in duration-500">
			<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full -mr-20 -mt-20 opacity-50" />
			<div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full -ml-10 -mb-10" />

			<div className="relative z-10">
				<div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/20">
					<Video size={48} className="text-white" />
				</div>
				{!hideTitle && (
					<h2 className="text-4xl font-black mb-4">
						Телемедицина 24/7
					</h2>
				)}
				<p className="max-w-md mx-auto text-indigo-100 font-medium mb-10 opacity-80">
					Дежурный ветеринар ответит вам в течение 5 минут. Помощь
					рядом, где бы вы ни находились.
				</p>
				<button
					onClick={onConsult}
					className="bg-white text-indigo-900 px-12 py-5 rounded-[2rem] font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
				>
					Связаться с врачом (490 ₽)
				</button>
			</div>
		</div>
	);
}

function GroomingHomeView({
	onOrder,
	hideTitle,
}: {
	onOrder: () => void;
	hideTitle?: boolean;
}) {
	return (
		<div className="bg-white rounded-[3rem] border-4 border-dashed border-indigo-100 p-12 text-center animate-in fade-in duration-500">
			<div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
				<Home size={48} className="text-indigo-600" />
			</div>
			{!hideTitle && (
				<h2 className="text-4xl font-black text-slate-900 mb-4">
					Груминг с выездом на дом
				</h2>
			)}
			<p className="max-w-md mx-auto text-slate-500 font-bold mb-10">
				Наши мастера привезут всё необходимое оборудование с собой.
				Питомец в безопасности — дома.
			</p>
			<button
				onClick={onOrder}
				className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
			>
				Заказать мастера
			</button>
		</div>
	);
}

// --- MODALS (ВНУТРЕННИЕ) ---

function CartModal({
	items,
	onClose,
	onRemove,
}: {
	items: ShopItem[];
	onClose: () => void;
	onRemove: (idx: number) => void;
}) {
	const total = items.reduce((sum, i) => sum + i.price, 0);
	return (
		<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-end">
			<div className="bg-white w-full max-w-md h-screen p-10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
				<div className="flex justify-between items-center mb-10">
					<h3 className="text-3xl font-black">Корзина</h3>
					<button
						onClick={onClose}
						className="p-2 hover:bg-slate-100 rounded-xl"
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
								className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl"
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
									className="text-slate-300 hover:text-rose-500"
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
						<button className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl active:scale-95 transition-all">
							Оформить заказ
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

function BookingModal({
	type,
	pets,
	onClose,
	onSave,
}: {
	type: string;
	pets: Pet[];
	onClose: () => void;
	onSave: (data: {
		petName?: string;
		doctor?: string;
		date?: string;
		time?: string;
		type?: string;
	}) => void;
}) {
	const [selectedPet, setSelectedPet] = useState<string>(pets[0]?.id || "");
	const [date, setDate] = useState<string>("");
	const [time, setTime] = useState<string>("10:00");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!date) return alert("Пожалуйста, выберите дату");
		const pet = pets.find((p) => p.id === selectedPet);
		onSave({
			petName: pet?.name || "Питомец",
			doctor:
				type === "grooming"
					? "Грумер (выезд)"
					: type === "telemed"
					? "Онлайн-консультант"
					: "Терапевт (клиника)",
			date,
			time,
			type,
		});
	};

	return (
		<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
			<form
				onSubmit={handleSubmit}
				className="bg-white rounded-[3rem] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in-95 duration-200"
			>
				<div className="flex justify-between items-center mb-8">
					<h3 className="text-3xl font-black text-slate-800">
						Запись
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-slate-400 hover:text-slate-600"
					>
						<X size={28} />
					</button>
				</div>
				<div className="space-y-6">
					<div>
						<label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
							Выберите питомца
						</label>
						<div className="grid grid-cols-3 gap-3">
							{pets.map((p) => (
								<button
									key={p.id}
									type="button"
									onClick={() => setSelectedPet(p.id)}
									className={`p-3 rounded-2xl border-2 font-bold text-xs transition-all ${
										selectedPet === p.id
											? "border-indigo-600 bg-indigo-50 text-indigo-600"
											: "border-slate-100 text-slate-400"
									}`}
								>
									{p.name}
								</button>
							))}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
								Дата
							</label>
							<input
								type="date"
								required
								className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-100"
								value={date}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>
								) => setDate(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
								Время
							</label>
							<input
								type="time"
								required
								className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-100"
								value={time}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>
								) => setTime(e.target.value)}
							/>
						</div>
					</div>
					<div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-3">
						<ShieldCheck className="text-indigo-600" size={24} />
						<p className="text-xs font-bold text-indigo-900">
							Вы получите напоминание за 2 часа до начала визита в
							приложении.
						</p>
					</div>
					<button
						type="submit"
						className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
					>
						Подтвердить запись
					</button>
				</div>
			</form>
		</div>
	);
}

function AddPetModal({
	onClose,
	onSave,
}: {
	onClose: () => void;
	onSave: (p: {
		name: string;
		breed: string;
		gender: string;
		photo_url: string;
		weight: number;
	}) => void;
}) {
	const [name, setName] = useState<string>("");
	const [breed, setBreed] = useState<string>("");
	const [gender, setGender] = useState<string>("Мужской");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!name || !breed) return alert("Заполните все поля");
		onSave({
			name,
			breed,
			gender,
			photo_url:
				"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=400",
			weight: 1.2,
		});
	};

	return (
		<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
			<form
				onSubmit={handleSubmit}
				className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-200"
			>
				<h3 className="text-3xl font-black mb-8">Новый питомец</h3>
				<div className="space-y-6">
					<div className="flex gap-4">
						<button
							type="button"
							className="w-24 h-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-400 transition-all"
						>
							<Camera size={24} />
							<span className="text-[10px] font-black mt-1 uppercase">
								Фото
							</span>
						</button>
						<div className="flex-1 space-y-4">
							<input
								placeholder="Кличка"
								required
								className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-200"
								value={name}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>
								) => setName(e.target.value)}
							/>
							<input
								placeholder="Порода"
								required
								className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-200"
								value={breed}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>
								) => setBreed(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => setGender("Мужской")}
							className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all ${
								gender === "Мужской"
									? "bg-indigo-600 text-white"
									: "bg-slate-50 text-slate-400"
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
									: "bg-slate-50 text-slate-400"
							}`}
						>
							Женский
						</button>
					</div>
					<div className="pt-4 space-y-3">
						<button
							type="submit"
							className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl active:scale-95 transition-all"
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
				</div>
			</form>
		</div>
	);
}

// Заглушка для Globe, так как в lucide-react не всегда есть в списке быстрого импорта
function Globe(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="2" y1="12" x2="22" y2="12" />
			<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
		</svg>
	);
}
