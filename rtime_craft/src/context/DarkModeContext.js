import { createContext, useState, useEffect, useContext } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [ isDarkMode, setIsDarkMode ] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = savedTheme 
                                ? savedTheme === 'dark'
                                : window.matchMedia('{prefers-color-scheme: dark').matches;
        setIsDarkMode(prefersDark);
        document.documentElement.classList.toggle('dark', prefersDark);
    },[])

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
        localStorage.setItem('theme', !isDarkMode ? 'dark': 'light');
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);