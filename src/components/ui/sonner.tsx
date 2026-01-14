"use client";

import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group [&_.sonner-toast.sonner-success]:bg-gradient-to-br [&_.sonner-toast.sonner-success]:from-indigo-50 [&_.sonner-toast.sonner-success]:to-indigo-100 [&_.sonner-toast.sonner-success]:border-indigo-300 [&_.sonner-toast.sonner-success]:text-slate-800 [&_.sonner-toast.sonner-success]:shadow-xl"
			icons={{
				success: (
					<CircleCheckIcon className="size-5 text-indigo-600 flex-shrink-0 font-bold" />
				),
				info: (
					<InfoIcon className="size-5 text-sky-500 flex-shrink-0" />
				),
				warning: (
					<TriangleAlertIcon className="size-5 text-amber-500 flex-shrink-0" />
				),
				error: (
					<OctagonXIcon className="size-5 text-rose-500 flex-shrink-0" />
				),
				loading: (
					<Loader2Icon className="size-5 animate-spin text-indigo-600 flex-shrink-0" />
				),
			}}
			style={
				{
					"--normal-bg": "#ffffff",
					"--normal-text": "#0f172a",
					"--normal-border": "#e2e8f0",
					"--border-radius": "20px",
					"--success-bg": "#f0f4ff",
					"--success-text": "#1e1b4b",
					"--success-border": "#c7d2fe",
					"--error-bg": "#fef2f2",
					"--error-text": "#7f1d1d",
					"--error-border": "#fca5a5",
					"--warning-bg": "#fffbeb",
					"--warning-text": "#78350f",
					"--warning-border": "#fde047",
					"--info-bg": "#f0f9ff",
					"--info-text": "#0c2d6b",
					"--info-border": "#7dd3fc",
				} as React.CSSProperties
			}
			visibleToasts={5}
			position="top-right"
			expand={false}
			richColors
			{...props}
		/>
	);
};

export { Toaster };
