import React from "react";
import { RiArrowLeftRightFill, RiMoonFill, RiSunFill } from "react-icons/ri";
import type { Theme } from "../definitions";
import {
	StorageKeys,
	accessibleClickHandler,
	localStorageManager,
} from "../utils";

const defaultTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)")
	.matches
	? "dark"
	: "light";

export const ThemeToggle: React.FunctionComponent = () => {
	const [theme, setTheme] = React.useState<Theme>(defaultTheme);

	React.useEffect(() => {
		const storedTheme = localStorageManager.get(StorageKeys.theme);
		if (storedTheme !== "dark" && storedTheme !== "light") {
			setTheme(defaultTheme);
		}
		setTheme(storedTheme as Theme);
	}, []);

	React.useEffect(() => {
		localStorageManager.set(StorageKeys.theme, theme);
		document.documentElement.setAttribute("data-theme", theme);
	}, [theme]);

	const handleThemeToggle = accessibleClickHandler(() => {
		const newTheme = theme === "dark" ? "light" : "dark";
		setTheme(newTheme);
		document.documentElement.setAttribute("data-theme", newTheme);
		localStorageManager.set(StorageKeys.theme, newTheme);
	});

	const icons = [
		<RiMoonFill key="moon" />,
		<RiArrowLeftRightFill key="arrows" />,
		<RiSunFill key="sun" />,
	];

	return (
		<button
			type="button"
			className="theme-toggle"
			onClick={handleThemeToggle}
			onKeyUp={handleThemeToggle}
			title="Toggle dark/light theme"
		>
			{theme === "dark" ? icons : icons.reverse()}
		</button>
	);
};
