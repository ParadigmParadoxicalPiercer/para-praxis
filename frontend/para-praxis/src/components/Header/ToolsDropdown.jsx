import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOOL_LINKS = [
	{ label: "Focus Timer", to: "/focus-timer" },
	{ label: "Journal / Notes", to: "/journal" },
	{ label: "Task Manager", to: "/tasks" },
	{ label: "Workout Plans", to: "/workouts" },
];

export default function ToolsDropdown() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	const handleGo = (to) => {
		setOpen(false);
		navigate(to);
	};

	useEffect(() => {
		if (!open) return;
		const onDocClick = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		const onKey = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("mousedown", onDocClick);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDocClick);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);

	return (
		<div className="relative z-50" tabIndex={0} ref={ref}>
			<button
				className="inline-flex items-center gap-2 px-3 py-1.5 text-blue-600 font-semibold rounded border border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
				onClick={() => setOpen((p) => !p)}
			>
				SELF-IMPROVEMENT TOOLS
				<span className="text-xs">{open ? "▲" : "▼"}</span>
			</button>
			{open && (
				<ul className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-[60]">
					{TOOL_LINKS.map((t) => (
						<li key={t.label}>
							<button
								onClick={() => handleGo(t.to)}
								className="w-full text-left block px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
							>
								{t.label}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
