import { createContext, useContext, useState } from 'react';

// Create Context
const DarkModeContext = createContext();

const themeData = localStorage.getItem('theme');
console.log('themeData', themeData);

// Custom Hook to use Dark Mode Context
export const useDarkMode = () => {
   return useContext(DarkModeContext);
};

// Provider Component
export const DarkModeProvider = ({ children }) => {
   const [isDarkMode, setIsDarkMode] = useState(false);

   const toggleDarkMode = () => {
      setIsDarkMode((prevMode) => !prevMode);
      if(themeData === 1){
         setIsDarkMode(false)
      }else if ( themeData === 2){
         setIsDarkMode(true)
      } else if (themeData === 3){
         const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
         setIsDarkMode(systemPrefersLight ? false : true)
      }
   };

   return (
      <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
         {children}
      </DarkModeContext.Provider>
   );
};
