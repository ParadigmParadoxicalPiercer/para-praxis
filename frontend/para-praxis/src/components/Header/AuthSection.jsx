import React from "react";
import { Link } from "react-router-dom";

function LoggedInText({ user }) {
	return (
		<span className="font-semibold text-blue-700 whitespace-nowrap text-sm md:text-base">
			Hi, {user?.name || "User"}
		</span>
	);
}

function ProfileButton() {
	return (
		<Link
			className="px-3 py-1.5 rounded border border-blue-700 bg-blue-600 text-white font-semibold hover:bg-blue-700"
			to="/user"
		>
			PROFILE
		</Link>
	);
}

function LogoutButton({ onLogout }) {
	return (
		<button
			className="px-3 py-1.5 rounded border border-slate-300 bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300"
			onClick={onLogout}
		>
			LOGOUT
		</button>
	);
}

function LoginButton() {
	return (
		<Link
			className="px-3 py-1.5 rounded border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-50"
			to="/auth/login"
		>
			LOGIN
		</Link>
	);
}

function RegisterButton() {
	return (
		<Link
			className="px-3 py-1.5 rounded border border-blue-700 bg-blue-600 text-white font-semibold hover:bg-blue-700"
			to="/auth/register"
		>
			REGISTER
		</Link>
	);
}

export default function AuthSection({ isLoggedIn, user, onLogout }) {
	if (isLoggedIn) {
		return (
			<div className="flex items-center gap-3">
				<LoggedInText user={user} />
				<ProfileButton />
				<LogoutButton onLogout={onLogout} />
			</div>
		);
	}
	return (
		<div className="flex items-center gap-3">
			<LoginButton />
			<RegisterButton />
		</div>
	);
}
