import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Theme } from "../definitions";
import { localStorageManager, themeKey } from "../utils";

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
    const storedTheme = localStorageManager.get(themeKey);
    if (storedTheme !== "dark" && storedTheme !== "light") {
      setTheme(defaultTheme);
    }
    setTheme(storedTheme as Theme);
  }, []);

  React.useEffect(() => {
    localStorageManager.set(themeKey, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorageManager.set(themeKey, newTheme);
  };

  const icons = [
    <FontAwesomeIcon icon={["fas", "moon"]} key="moon" />,
    <FontAwesomeIcon icon={["fas", "right-left"]} key="right-left" />,
    <FontAwesomeIcon icon={["fas", "sun"]} key="sun" />,
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
