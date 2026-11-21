import { useState } from 'react';
import {
   LayoutDashboard,
   Settings,
   Sun,
   Moon,
   ChevronLeft,
   ChevronRight,
   Wallet,
   ArrowUpRight,
   ShieldCheck,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useDarkMode } from '../DarkModeContext';
import tracksyLogo from '../../assets/Tracksy.png';

const SidePanel = ({ onAddTransaction }) => {
   const { isDarkMode, toggleDarkMode } = useDarkMode();
   const location = useLocation();
   const [isCollapsed, setIsCollapsed] = useState(false);

   const navItems = [
      {
         name: 'Dashboard',
         icon: <LayoutDashboard size={20} strokeWidth={2} />,
         path: '/',
      },
      {
         name: 'Settings & Profile',
         icon: <Settings size={20} strokeWidth={2} />,
         path: '/settings',
      },
   ];

   return (
      <>
         {/* Desktop & Tablet Sidebar */}
         <aside
            className={`hidden md:flex flex-col justify-between transition-all duration-300 ease-in-out border-r shrink-0 z-30 select-none
               ${isCollapsed ? 'w-20' : 'w-64'}
               ${
                  isDarkMode
                     ? 'bg-zinc-950 border-zinc-800 text-zinc-100'
                     : 'bg-white border-slate-200 text-slate-800'
               }
               min-h-screen py-5 px-3`}
         >
            {/* Top Brand Header */}
            <div>
               <div className="flex items-center justify-between px-2 mb-6">
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center shadow-xs shrink-0">
                        <Wallet size={20} strokeWidth={2.2} />
                     </div>
                     {!isCollapsed && (
                        <div className="flex flex-col leading-none">
                           <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-zinc-50">
                              Tracksy
                           </span>
                           <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
                              Finance OS
                           </span>
                        </div>
                     )}
                  </div>

                  <button
                     onClick={() => setIsCollapsed(!isCollapsed)}
                     className={`p-1.5 rounded-lg border transition-colors
                        ${
                           isDarkMode
                              ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                              : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                     title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                     aria-label="Toggle sidebar"
                  >
                     {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                  </button>
               </div>

               {/* Quick Action Button */}
               {onAddTransaction && (
                  <div className="px-1 mb-6">
                     <button
                        onClick={onAddTransaction}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm shadow-indigo-600/30
                           ${isCollapsed ? 'px-0' : ''}`}
                        title="Add New Transaction"
                     >
                        <ArrowUpRight size={18} strokeWidth={2.4} />
                        {!isCollapsed && <span>New Entry</span>}
                     </button>
                  </div>
               )}

               {/* Navigation Links */}
               <nav className="flex flex-col gap-1.5 px-1">
                  {navItems.map((item) => {
                     const isActive = location.pathname === item.path;
                     return (
                        <NavLink
                           key={item.name}
                           to={item.path}
                           className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                              ${
                                 isActive
                                    ? isDarkMode
                                       ? 'bg-zinc-800/80 text-white shadow-sm'
                                       : 'bg-indigo-50 text-indigo-700 shadow-sm'
                                    : isDarkMode
                                    ? 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                              }`}
                           title={isCollapsed ? item.name : undefined}
                        >
                           <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500'}>
                              {item.icon}
                           </span>
                           {!isCollapsed && <span>{item.name}</span>}
                        </NavLink>
                     );
                  })}
               </nav>
            </div>

            {/* Bottom Actions & Controls */}
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 dark:border-zinc-800 px-1">
               {/* Dark Mode Switcher */}
               <button
                  onClick={toggleDarkMode}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                     ${
                        isDarkMode
                           ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                           : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                     }`}
                  title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
               >
                  {isDarkMode ? (
                     <Sun size={18} className="text-amber-400" />
                  ) : (
                     <Moon size={18} className="text-indigo-600" />
                  )}
                  {!isCollapsed && (
                     <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  )}
               </button>

               {/* Security Badge */}
               {!isCollapsed && (
                  <div className={`mt-2 p-3 rounded-xl border text-[11px] leading-tight flex items-center gap-2.5
                     ${
                        isDarkMode
                           ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400'
                           : 'bg-slate-50 border-slate-200 text-slate-500'
                     }`}>
                     <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                     <span>Local Offline Vault encrypted in browser storage.</span>
                  </div>
               )}
            </div>
         </aside>

         {/* Mobile Bottom Navigation Bar */}
         <nav
            className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around py-2 px-4 shadow-lg backdrop-blur-md
               ${
                  isDarkMode
                     ? 'bg-zinc-950/90 border-zinc-800 text-zinc-200'
                     : 'bg-white/90 border-slate-200 text-slate-700'
               }`}
         >
            {navItems.map((item) => {
               const isActive = location.pathname === item.path;
               return (
                  <NavLink
                     key={item.name}
                     to={item.path}
                     className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl text-xs font-medium transition-all
                        ${
                           isActive
                              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                              : 'text-slate-500 dark:text-zinc-400'
                        }`}
                  >
                     {item.icon}
                     <span>{item.name.split(' ')[0]}</span>
                  </NavLink>
               );
            })}

            {onAddTransaction && (
               <button
                  onClick={onAddTransaction}
                  className="flex flex-col items-center gap-1 py-1 px-4 text-xs font-medium text-indigo-600 dark:text-indigo-400"
               >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                     <ArrowUpRight size={18} strokeWidth={2.4} />
                  </div>
                  <span>Add</span>
               </button>
            )}

            <button
               onClick={toggleDarkMode}
               className="flex flex-col items-center gap-1 py-1 px-4 text-xs font-medium text-slate-500 dark:text-zinc-400"
            >
               {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
               <span>Theme</span>
            </button>
         </nav>
      </>
   );
};

export default SidePanel;
