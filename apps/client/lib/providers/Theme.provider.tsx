import React, { createContext, FC, useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import light from "@themes/light";
import dark from "@themes/dark";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}

const getThemeByName = (theme: Theme) => {
  return themeMap[theme];
};

const themeMap: { [key: string]: any } = {
  [Theme.LIGHT]: light,
  [Theme.DARK]: dark,
};

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: Theme.LIGHT,
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  useEffect(() => {
    const storageTheme = localStorage.getItem("theme");
    if (storageTheme) {
      setTheme(storageTheme as Theme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  const currentTheme = useMemo(() => {
    return getThemeByName(theme);
  }, [theme]);

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={currentTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
