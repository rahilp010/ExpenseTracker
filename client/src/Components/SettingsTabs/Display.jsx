import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../DarkModeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../app/features/settingsSlice';
import { themes } from '../../data';

const Display = () => {
   const dispatch = useDispatch();
   const theme = useSelector((state) => state.settings.theme);
   console.log('theme', theme);
   const { isDarkMode, setIsDarkMode } = useDarkMode();

   const [selectedTheme, setSelectedTheme] = useState(themes[0].id);

   const handleThemeChange = (themeId) => {
      localStorage.setItem('theme', themeId); // optional: persist
      setSelectedTheme(themeId); // update local state
      dispatch(setTheme(themeId)); // update Redux state

      if (themeId === 1) setIsDarkMode(false);
      else if (themeId === 2) setIsDarkMode(true);
      else if (themeId === 3) {
         const mediaQuery = window.matchMedia(
            '(prefers-color-scheme: dark)'
         ).matches;
         console.log('systemTheme', mediaQuery);

         mediaQuery ? setIsDarkMode(true) : setIsDarkMode(false);
         console.log('isDarkMode', isDarkMode);
      }
   };

   useEffect(() => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
         setSelectedTheme(parseInt(storedTheme));
         dispatch(setTheme(parseInt(storedTheme)));
         if (storedTheme === '1') setIsDarkMode(false);
         else if (storedTheme === '2') setIsDarkMode(true);
         else if (storedTheme === '3') {
            const mediaQuery = window.matchMedia(
               '(prefers-color-scheme: dark)'
            ).matches;
            mediaQuery ? setIsDarkMode(true) : setIsDarkMode(false);
         }
      }
   }, [dispatch]);

   useEffect(() => {
      if (isDarkMode) {
         document.documentElement.classList.add('dark');
      } else {
         document.documentElement.classList.remove('dark');
      }
   }, [isDarkMode]);

   return (
      <div className="flex flex-col gap-4 my-7 overflow-y-auto h-[calc(100vh-10rem)]">
         <div>
            <p className="text-lg font-bold">Themes</p>
            <p className="text-sm font-thin text-gray-500">
               Choose your style or customize your theme
            </p>
         </div>

         <div className="grid grid-cols-3 rounded-lg">
            {themes.map((theme) => {
               return (
                  <div
                     key={theme.id}
                     onClick={() => handleThemeChange(theme.id)}
                     className={`flex flex-col gap-2 hover:cursor-pointer rounded-lg ${
                        isDarkMode
                           ? 'hover:bg-white/10'
                           : 'hover:bg-gray-200/60'
                     }  p-5
                     ${
                        selectedTheme === theme.id
                           ? `${
                                isDarkMode ? 'bg-black/10' : 'bg-gray-200/60'
                             } border-2 border-b-5 border-[#6766e8]`
                           : ``
                     }
                     `}>
                     <img
                        src={theme.image}
                        alt={theme.name}
                        className="h-52 rounded-4xl"
                     />
                     <p
                        className={`text-sm text-center
                        ${
                           selectedTheme === theme.id
                              ? 'text-[#6766e8] font-bold'
                              : ''
                        }
                        `}>
                        {theme.name.charAt(0).toUpperCase() +
                           theme.name.slice(1)}{' '}
                        Mode
                     </p>
                  </div>
               );
            })}
         </div>
      </div>
   );
};

export default Display;
