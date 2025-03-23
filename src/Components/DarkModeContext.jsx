import { createContext, useContext, useState } from 'react';

// Create Context
const DarkModeContext = createContext();

// Custom Hook to use Dark Mode Context
export const useDarkMode = () => {
   return useContext(DarkModeContext);
};

// Provider Component
export const DarkModeProvider = ({ children }) => {
   const [isDarkMode, setIsDarkMode] = useState(true);

   const toggleDarkMode = () => {
      setIsDarkMode((prevMode) => !prevMode);
   };

   return (
      <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
         {children}
      </DarkModeContext.Provider>
   );
};
