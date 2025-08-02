import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
	LogOut,
	LayoutDashboard,
	Book,
	Users,
	Settings,
	List,
	Film,
} from "lucide-react";
import userService from "../services/userService";

const MainLayout = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		userService.logout();
		navigate("/login");
	};

	const navLinks = [
		{
			to: "/dashboard",
			icon: <LayoutDashboard size={20} />,
			text: "Dashboard",
		},
		{ to: "/courses", icon: <Book size={20} />, text: "Courses" },
		{ to: "/users", icon: <Users size={20} />, text: "Users" },
		{ to: "/parameters", icon: <Settings size={20} />, text: "Parameters" },
		{ to: "/subscriptions", icon: <List size={20} />, text: "Subscriptions" },
	];

	return (
		<div className="flex h-screen bg-background">
			<aside className="w-64 bg-primary text-textPrimary flex flex-col">
				<div className="p-6 text-2xl font-bold border-b border-secondary">
					Admin Panel
				</div>
				<nav className="flex-1 p-4">
					{navLinks.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className="flex items-center px-4 py-3 mb-2 text-sm rounded-lg hover:bg-secondary transition-colors"
						>
							{link.icon}
							<span className="ml-3">{link.text}</span>
						</Link>
					))}
				</nav>
				<div className="p-4 border-t border-secondary">
					<button
						onClick={handleLogout}
						className="flex items-center w-full px-4 py-3 text-sm rounded-lg hover:bg-secondary transition-colors"
					>
						<LogOut size={20} />
						<span className="ml-3">Logout</span>
					</button>
				</div>
			</aside>
			<div className="flex-1 flex flex-col overflow-hidden">
				<main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
