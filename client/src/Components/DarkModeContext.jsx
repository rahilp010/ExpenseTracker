import { createContext, useContext, useEffect, useState } from 'react';
import { setTheme } from '../app/features/settingsSlice';

// Create Context
const DarkModeContext = createContext();

// Custom Hook to use Dark Mode Context
export const useDarkMode = () => {
   return useContext(DarkModeContext);
};

// Provider Component
export const DarkModeProvider = ({ children }) => {
   const [isDarkMode, setIsDarkMode] = useState(false); // default to false or use logic from localStorage

   const toggleDarkMode = () => {
      setIsDarkMode((prevMode) => !prevMode);
   };

   return (
      <DarkModeContext.Provider
         value={{ isDarkMode, toggleDarkMode, setIsDarkMode }}>
         {children}
      </DarkModeContext.Provider>
   );
};
