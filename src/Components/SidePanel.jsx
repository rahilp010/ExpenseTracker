import React from 'react';
import { useDarkMode } from './DarkModeContext';
import Logo from '../assets/Logo.png';
import Logo1 from '../assets/Logo1.png';
import mine from '../assets/mine.jpg';
import { NavLink } from 'react-router-dom';
import { FaChartPie, FaCreditCard, FaWallet } from 'react-icons/fa';

const SidePanel = () => {
   const { isDarkMode } = useDarkMode();

   const icons = {
      dashboard: <FaChartPie className="text-xl" />,
      transactions: <FaCreditCard className="text-xl" />,
      wallet: <FaWallet className="text-xl" />,
      settings : <i className="fa-solid fa-gear"></i>
   };

   return (
      <div
         className={`${
            isDarkMode ? 'text-white bg-black' : 'text-black bg-gray-200'
         } transition-all duration-300 min-h-screen border-r border-gray-400 w-1/4 lg:w-1/5 md:w-1/3 sm:w-2/5 md:flex flex-col`}>
         <div className="flex justify-center my-5">
            <img
               src={isDarkMode ? Logo : Logo1}
               alt="logo"
               className="w-20 h-14"
            />
         </div>

         <div className="flex flex-col items-center mt-10 ">
            <img
               src={mine}
               alt="Profile"
               className="w-28 h-28 rounded-full border-2 border-gray-300"
            />
            <p className="font-bold text-lg mt-3">Rahil Patel</p>
         </div>

         <nav className="mt-10 w-full">
            <ul className="space-y-2">
               {['Dashboard', 'Transactions', 'Wallet','Settings'].map(
                  (section, index) => (
                     <li key={index}>
                        <NavLink
                           to={
                              section.toLowerCase() === 'dashboard'
                                 ? '/'
                                 : `/${section.toLowerCase()}`
                           }
                           className={({ isActive }) =>
                              `flex items-center space-x-4 px-14 py-3 rounded-lg transition-all hover:bg-gray-700 font-bold
                            ${isActive ? 'text-blue-600' : ''}`
                           }>
                           <span className="text-xl">
                              {icons[section.toLowerCase()]}
                           </span>
                           <span className="text-sm sm:text-base">
                              {section}
                           </span>
                        </NavLink>
                     </li>
                  )
               )}
            </ul>
         </nav>
      </div>
   );
};

export default SidePanel;
