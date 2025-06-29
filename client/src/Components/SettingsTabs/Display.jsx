import React, { useEffect, useState } from 'react';
import LightMode from '../../assets/LightMode.png';
import DarkMode from '../../assets/DarkMode.png';
import System from '../../assets/System.png';
import { useDarkMode } from '../DarkModeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../app/features/settingsSlice';

const Display = () => {
   const dispatch = useDispatch();
   const theme = useSelector((state) => state.settings.theme);
   console.log('theme', theme);
   const { isDarkMode } = useDarkMode();
   const themes = [
      {
         id: 1,
         name: 'light',
         image: LightMode,
      },
      {
         id: 2,
         name: 'dark',
         image: DarkMode,
      },
      {
         id: 3,
         name: 'system',
         image: System,
      },
   ];

   const [selectedTheme, setSelectedTheme] = useState(themes[0].id);

   const handleThemeChange = (themeId) => {
      setSelectedTheme(themeId); // update local state
      dispatch(setTheme(themeId)); // update Redux state
      localStorage.setItem('theme', themeId); // optional: persist
   };

   useEffect(() => {
      const savedTheme = parseInt(localStorage.getItem('theme'));
      if (savedTheme) {
         setSelectedTheme(savedTheme);
         dispatch(setTheme(savedTheme));
      }

      if (savedTheme === 3) {
         const systemPrefersLight = window.matchMedia(
            '(prefers-color-scheme: light)'
         ).matches;

         dispatch(setTheme(systemPrefersLight ? 1 : 2));
      }
   }, []);

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
