import React from "react";
import { RiArrowLeftRightFill, RiMoonFill, RiSunFill } from "react-icons/ri";
import { Theme } from "../definitions";
import { StorageKeys, localStorageManager } from "../utils";

const defaultTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)")
  .matches
  ? "dark"
  : "light";

export interface IThemeToggleProps {}
export const ThemeToggle: React.FunctionComponent<IThemeToggleProps> = (
  props: IThemeToggleProps
) => {
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

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorageManager.set(StorageKeys.theme, newTheme);
  };

  const icons = [
    <RiMoonFill key="moon" />,
    <RiArrowLeftRightFill key="arrows" />,
    <RiSunFill key="sun" />,
  ];

  return (
    <button
      className="theme-toggle"
      onClick={handleThemeToggle}
      title="Toggle dark/light theme"
    >
      {theme === "dark" ? icons : icons.reverse()}
    </button>
  );
};
