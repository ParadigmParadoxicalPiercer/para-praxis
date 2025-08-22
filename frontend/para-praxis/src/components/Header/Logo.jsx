import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
	return (
		<Link to="/" className="flex items-center text-2xl sm:text-3xl font-extrabold tracking-widest select-none">
			<span className="text-blue-600 mr-1">PARA</span>
			<span className="text-slate-900">PRAXIS</span>
		</Link>
	);
}
