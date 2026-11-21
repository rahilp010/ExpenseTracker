import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext({
   isDarkMode: false,
   toggleDarkMode: () => {},
   setIsDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
   const [isDarkMode, setIsDarkMode] = useState(() => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === '2') return true;
      if (storedTheme === '1') return false;
      if (storedTheme === '3') {
         return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      }
      const storedDark = localStorage.getItem('darkMode');
      if (storedDark !== null) return storedDark === 'true';
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
   });

   useEffect(() => {
      if (isDarkMode) {
         document.documentElement.classList.add('dark');
      } else {
         document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
   }, [isDarkMode]);

   const toggleDarkMode = () => {
      setIsDarkMode((prev) => {
         const next = !prev;
         localStorage.setItem('theme', next ? '2' : '1');
         return next;
      });
   };

   return (
      <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, setIsDarkMode }}>
         {children}
      </DarkModeContext.Provider>
   );
};
