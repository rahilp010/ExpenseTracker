import { useState } from 'react';
import {
   LayoutPanelLeft,
   ChartSpline,
   ClockFading,
   ChevronLeft,
   Activity,
   UserRoundPen,
} from 'lucide-react';
import { GiRadarSweep  } from 'react-icons/gi';

const SidePanel = () => {
   const [active, setActive] = useState('Dashboard');
   const [isOpen, setIsOpen] = useState(true);

   const navItems = [
      {
         name: 'Dashboard',
         icon: <LayoutPanelLeft size={20} strokeWidth={2} />,
      },
      { name: 'Reports', icon: <ChartSpline size={20} strokeWidth={2} /> },
      { name: 'History', icon: <ClockFading size={20} strokeWidth={2} /> },
      { name: 'Profile', icon: <UserRoundPen size={20} strokeWidth={2} /> },
   ];

   return (
      <div
         className={`relative bg-[#e7e9f9] py-6 px-4 flex flex-col gap-6 text-sm h-[calc(100vh-2rem)] ${
            isOpen ? 'w-20 rounded-r-xl' : 'w-60 rounded-r-3xl'
         } transition-all duration-300 overflow-hidden`}>
         <div
            class={`transition-all duration-300 ${
               isOpen ? 'left-7' : 'right-3'
            }`}
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
               <div className='flex justify-between items-center gap-3 my-3 ml-3'>
                  <GiRadarSweep className="h-10 text-yellow-400 -ml-2" size={35} />
               </div>
            ) : (
               <div className='flex justify-between items-center gap-3'>
                  <div className={`text-2xl font-bold tracking-wider px-2 my-3 text-yellow-400`}>Tracksy</div>
                  <ChevronLeft className="h-10 text-gray-600" size={25} />
               </div>
            )}
         </div>

         {navItems.map((item) => (
            <div
               key={item.name}
               onClick={() => setActive(item.name)}
               className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200
          ${
             active === item.name
                ? 'bg-[#d4d9fb] text-blue-700 font-medium border]'
                : 'text-gray-500 hover:bg-[#d4d9fb]'
          }`}>
               <div className="text-blue-600">{item.icon}</div>
               {!isOpen && <span className="text-[16px] font-medium">{item.name}</span>}
            </div>
         ))}
      </div>
   );
};

export default SidePanel;
