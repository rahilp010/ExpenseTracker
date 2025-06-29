import { useState } from 'react';
import {
   LayoutPanelLeft,
   ChartSpline,
   ClockFading,
   ChevronLeft,
   UserRoundPen,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router';
import tracksy from '../../assets/Tracksy.png';
import { useDarkMode } from '../DarkModeContext';

const SidePanel = () => {
   const { isDarkMode } = useDarkMode();
   const location = useLocation();
   const [isOpen, setIsOpen] = useState(true);

   const navItems = [
      {
         name: 'Dashboard',
         icon: <LayoutPanelLeft size={20} strokeWidth={2} />,
         path: '/',
      },
      {
         name: 'Report',
         icon: <ChartSpline size={20} strokeWidth={2} />,
         path: '/report',
      },
      {
         name: 'History',
         icon: <ClockFading size={20} strokeWidth={2} />,
         path: '/history',
      },
      {
         name: 'Profile',
         icon: <UserRoundPen size={20} strokeWidth={2} />,
         path: '/settings',
      },
   ];

   return (
      <div
         className={`relative ${
            isDarkMode ? 'bg-[#222222]' : 'bg-[#e7e9f9]'
         }  py-6 px-4 flex flex-col gap-6 text-sm h-[calc(100vh-2rem)] ${
            isOpen ? 'w-20 rounded-r-xl' : 'w-60 rounded-r-3xl'
         } transition-all duration-300 overflow-hidden`}>
         <div
            className={`transition-all duration-300 ${
               isOpen ? 'left-7' : 'right-3'
            }`}
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
               <div className="flex justify-between items-center gap-3 my-3">
                  <img
                     src={tracksy}
                     alt=""
                     srcSet=""
                     className="h-14 w-full drop-shadow-2xl"
                  />
               </div>
            ) : (
               <div className="flex justify-between items-center gap-3">
                  <div className="text-2xl font-bold tracking-wider px-2 my-3 bg-gradient-to-r from-[#d4d9fb] via-[#1447e6] to-gray-800 text-transparent bg-clip-text">
                     Tracksy
                  </div>

                  <ChevronLeft className="h-10 text-gray-600" size={25} />
               </div>
            )}
         </div>

         {navItems.map((item) => (
            <NavLink
               key={item.name}
               to={item.path}
               className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200
          ${
             location.pathname === item.path
                ? 'bg-[#d4d9fb] text-blue-700 font-medium border]'
                : 'text-gray-500 hover:bg-[#d4d9fb]'
          }`}>
               <div className="text-blue-600">{item.icon}</div>
               {!isOpen && (
                  <span className="text-[16px] font-medium">{item.name}</span>
               )}
            </NavLink>
         ))}
      </div>
   );
};

export default SidePanel;
