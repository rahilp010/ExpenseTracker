import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../DarkModeContext';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../app/features/settingsSlice';
import { themes } from '../../data';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const Display = () => {
   const dispatch = useDispatch();
   const theme = useSelector((state) => state.settings.theme);
   const { isDarkMode, setIsDarkMode } = useDarkMode();

   const [selectedTheme, setSelectedTheme] = useState(() => {
      const stored = localStorage.getItem('theme');
      return stored ? parseInt(stored) : 1;
   });

   const handleThemeChange = (themeId) => {
      localStorage.setItem('theme', String(themeId));
      setSelectedTheme(themeId);
      dispatch(setTheme(themeId));

      if (themeId === 1) {
         setIsDarkMode(false);
         toast.info('Switched to Light Theme');
      } else if (themeId === 2) {
         setIsDarkMode(true);
         toast.info('Switched to Dark Theme');
      } else if (themeId === 3) {
         const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
         setIsDarkMode(prefersDark);
         toast.info('Adaptive system theme activated');
      }
   };

   useEffect(() => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
         const tId = parseInt(storedTheme);
         setSelectedTheme(tId);
         dispatch(setTheme(tId));
      }
   }, [dispatch]);

   const themeIcons = {
      light: Sun,
      dark: Moon,
      system: Laptop,
   };

   return (
      <div className="space-y-6 max-w-3xl">
         <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
               Theme & Appearance
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
               Select your preferred interface aesthetic or let your system dictate daylight modes.
            </p>
         </div>

         {/* Theme Cards Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themes.map((t) => {
               const Icon = themeIcons[t.name] || Sun;
               const isSelected = selectedTheme === t.id;

               return (
                  <div
                     key={t.id}
                     onClick={() => handleThemeChange(t.id)}
                     className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between
                        ${
                           isSelected
                              ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20 dark:border-indigo-500 shadow-sm'
                              : isDarkMode
                              ? 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                  >
                     <div>
                        <div className="flex items-center justify-between mb-3">
                           <div
                              className={`p-2 rounded-xl
                                 ${
                                    isSelected
                                       ? 'bg-indigo-600 text-white'
                                       : isDarkMode
                                       ? 'bg-zinc-800 text-zinc-300'
                                       : 'bg-slate-100 text-slate-600'
                                 }`}
                           >
                              <Icon size={18} />
                           </div>

                           {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                 <Check size={12} strokeWidth={2.6} />
                              </div>
                           )}
                        </div>

                        <div className="font-semibold text-sm text-slate-900 dark:text-zinc-100">
                           {t.label || t.name}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                           {t.description || 'Interface style setting'}
                        </p>
                     </div>

                     <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                        {isSelected ? 'Currently Active' : 'Click to Apply'}
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Design system token notes */}
         <div
            className={`p-4 rounded-xl border text-xs leading-relaxed
               ${
                  isDarkMode
                     ? 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400'
                     : 'bg-slate-50 border-slate-200 text-slate-600'
               }`}
         >
            <p className="font-semibold text-slate-800 dark:text-zinc-200 mb-1">
               Accessible Contrast Standard
            </p>
            Both light and dark palettes adhere to WCAG AAA contrast guidelines for all primary financial numbers, charts, and actionable controls.
         </div>
      </div>
   );
};

export default Display;
