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
					<div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl shadow-indigo-100 shrink-0">
						<Heart size={24} fill="currentColor" />
					</div>
					<span className="text-2xl font-black tracking-tight text-slate-800 hidden lg:block">
						VetCloud
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
								<AppointmentsView appointments={appointments} hideTitle />
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
							{activeTab === "settings" && <SettingsView hideTitle />}
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
								<span className="text-2xl font-black tracking-tight text-slate-800">VetCloud</span>
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
									active={activeTab === "appointments"}
									onClick={() => {
										setActiveTab("appointments");
										setMobileOpen(false);
									}}
								/>
								<NavItem
									icon={Video}
									label="Консультации"
									active={activeTab === "telemed"}
									onClick={() => {
										setActiveTab("telemed");
										setMobileOpen(false);
									}}
								/>
								<NavItem
									icon={ShoppingBag}
									label="Магазин"
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
									badge={notifications.filter((n) => !n.read).length}
									onClick={() => {
										setActiveTab("notifications");
										setMobileOpen(false);
									}}
								/>
								<NavItem
									icon={Settings}
									label="Настройки"
									onClick={() => {
										setActiveTab("settings");
										setMobileOpen(false);
									}}
								/>
							</div>

							<div className="mt-6">
								<div className="bg-slate-900 rounded-[2rem] p-5 text-white">
									<p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">VetPass Plus</p>
									<p className="text-sm font-bold mb-4">Бесплатные выезды и скидки 15%</p>
									<button className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 rounded-xl text-xs font-bold">Улучшить тариф</button>
								</div>
							</div>
						</aside>
						{/* Backdrop */}
						<div className="flex-1" onClick={() => setMobileOpen(false)} />
					</div>
				)}
			</main>

			{/* MODALS */}
			{modals.addPet && (
				<AddPetModal
					onClose={() => toggleModal("addPet", false)}
					onSave={(p) => {
						setPets([
							...pets,
							{
								...p,
								id: Date.now().toString(),
								medical_history: [],
								reminders: [],
							},
						]);
						toggleModal("addPet", false);
					}}
				/>
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

function NavItem({ icon: Icon, label, active, onClick, badge }: {
	icon: React.ComponentType<any>;
	label: string;
	active?: boolean;
	onClick?: () => void;
	badge?: number;
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
			<span className="font-bold text-sm hidden lg:block">{label}</span>
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

function DashboardContent({ pets, onPetSelect, onConsult }: {
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

function TabButton({ active, onClick, label, icon: Icon }: {
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

function AppointmentsView({ appointments, hideTitle }: { appointments: Appointment[]; hideTitle?: boolean }) {
	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
			{!hideTitle && <h2 className="text-3xl font-black">Ваш календарь</h2>}
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

function ShopView({ items, onAddToCart, hideTitle }: { items: ShopItem[]; onAddToCart: (item: ShopItem) => void; hideTitle?: boolean }) {
	const [filter, setFilter] = useState<string>("Все");
	const categories = ["Все", ...new Set(items.map((i) => i.category))];

	const filtered =
		filter === "Все" ? items : items.filter((i) => i.category === filter);

	return (
		<div className="animate-in fade-in duration-500 space-y-8">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				{!hideTitle && <h2 className="text-3xl font-black">Маркет VetCloud</h2>}
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

function NotificationsView({ list, onClear, hideTitle }: { list: NotificationItem[]; onClear: () => void; hideTitle?: boolean }) {
	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="flex items-center justify-between">
				{!hideTitle && <h2 className="text-3xl font-black">Уведомления</h2>}
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
			{!hideTitle && <h2 className="text-3xl font-black mb-10">Настройки аккаунта</h2>}
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

function SettingItem({ icon: Icon, label, value }: { icon: React.ComponentType<any>; label: string; value?: string }) {
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

function TelemedView({ onConsult, hideTitle }: { onConsult: () => void; hideTitle?: boolean }) {
	return (
		<div className="bg-indigo-900 rounded-[3rem] p-16 text-center text-white relative overflow-hidden shadow-2xl animate-in zoom-in duration-500">
			<div className="absolute top-0 right-0 w-64 h-64 bg-indigo-800 rounded-full -mr-20 -mt-20 opacity-50" />
			<div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full -ml-10 -mb-10" />

			<div className="relative z-10">
				<div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/20">
					<Video size={48} className="text-white" />
				</div>
				{!hideTitle && <h2 className="text-4xl font-black mb-4">Телемедицина 24/7</h2>}
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

function GroomingHomeView({ onOrder, hideTitle }: { onOrder: () => void; hideTitle?: boolean }) {
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

function CartModal({ items, onClose, onRemove }: { items: ShopItem[]; onClose: () => void; onRemove: (idx: number) => void }) {
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

function BookingModal({ type, pets, onClose, onSave }: { type: string; pets: Pet[]; onClose: () => void; onSave: (data: { petName?: string; doctor?: string; date?: string; time?: string; type?: string }) => void }) {
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
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
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
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
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

function AddPetModal({ onClose, onSave }: { onClose: () => void; onSave: (p: { name: string; breed: string; gender: string; photo_url: string; weight: number }) => void }) {
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
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
							/>
							<input
								placeholder="Порода"
								required
								className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-200"
								value={breed}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBreed(e.target.value)}
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
