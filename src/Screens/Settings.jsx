import React, { useState } from 'react';
import SidePanel from '../Components/Dashboard/SidePanel';
import ProfileSettings from '../Components/SettingsTabs/ProfileSettings';
import Display from '../Components/SettingsTabs/Display';
import DataSettings from '../Components/SettingsTabs/DataSettings';
import { useDarkMode } from '../Components/DarkModeContext';
import { User, Palette, Database } from 'lucide-react';

const Settings = () => {
   const { isDarkMode } = useDarkMode();
   const [activeTab, setActiveTab] = useState(0);

   const tabs = [
      {
         id: 'profile',
         title: 'Profile & Currency',
         icon: User,
         component: <ProfileSettings />,
      },
      {
         id: 'display',
         title: 'Appearance & Themes',
         icon: Palette,
         component: <Display />,
      },
      {
         id: 'data',
         title: 'Data Vault & Exports',
         icon: Database,
         component: <DataSettings />,
      },
   ];

   return (
      <div
         className={`min-h-screen flex transition-colors duration-200
            ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}
      >
         <SidePanel />

         <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full pb-24 md:pb-12 space-y-6">
            {/* Header */}
            <div>
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                  Settings & Preferences
               </h1>
               <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                  Customize your personal profile, local currency, visual themes, and local data vault
               </p>
            </div>

            {/* Segmented Tab Headers */}
            <div
               className={`flex p-1 rounded-2xl border text-xs font-semibold max-w-lg
                  ${
                     isDarkMode
                        ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
            >
               {tabs.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === idx;
                  return (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(idx)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl transition-all
                           ${
                              isActive
                                 ? isDarkMode
                                    ? 'bg-zinc-800 text-white shadow-xs'
                                    : 'bg-white text-slate-900 shadow-xs font-bold'
                                 : 'hover:text-slate-900 dark:hover:text-zinc-200'
                           }`}
                     >
                        <Icon size={14} />
                        <span className="hidden sm:inline">{tab.title}</span>
                        <span className="sm:hidden">{tab.title.split(' ')[0]}</span>
                     </button>
                  );
               })}
            </div>

            {/* Active Tab Panel */}
            <div
               className={`p-6 rounded-2xl border transition-all
                  ${
                     isDarkMode
                        ? 'bg-zinc-900/70 border-zinc-800/80 text-zinc-100'
                        : 'bg-white border-slate-200/80 text-slate-800 shadow-sm'
                  }`}
            >
               {tabs[activeTab].component}
            </div>
         </main>
      </div>
   );
};

export default Settings;
