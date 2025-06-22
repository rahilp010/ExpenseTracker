import React from 'react';
import SidePanel from '../Components/SidePanel';

const Settings = () => {
   return (
      <div className="flex transition-all duration-300 border-2 border-gray-300 rounded-2xl h-[calc(100vh-2rem)] overflow-y-hidden bg-[#f5f7fb] relative">
         <SidePanel />
         <div className="flex-1 p-6 overflow-y-auto min-h-screen customScrollbar">
            <div className="flex flex-col gap-4">
               <div>
                  <div className="flex gap-4 items-center absolute bottom-0 font-medium -translate-1/2 left-9 text-gray-500 text-sm">
                     <p className="text-[#6766e8]">v1.0.0</p>
                  </div>
                  <div className='flex justify-between items-center'>
                     <p className="font-medium text-[#6766e8]">Tracksy</p>
                     <p className=''>© 2025 Tracksy. All rights reserved.</p>
                  </div>
               </div>
            </div>
         </div>
         <div>
            
         </div>
      </div>
   );
};

export default Settings;
