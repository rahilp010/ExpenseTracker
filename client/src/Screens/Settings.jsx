import React, { useEffect, useState } from 'react';
import SidePanel from '../Components/Dashboard/SidePanel';
import ProfileSettings from '../Components/SettingsTabs/ProfileSettings';
import AccountSettings from '../Components/SettingsTabs/AccountSettings';

const Settings = () => {
   const Tabs = [
      {
         id: 1,
         title: 'Profile',
         component: <ProfileSettings />,
      },
      {
         id: 2,
         title: 'Account',
         component: <AccountSettings />,
      },
      {
         id: 3,
         title: 'Display',
         component: <ProfileSettings />,
      },
      {
         id: 4,
         title: 'Notification',
         component: <ProfileSettings />,
      },
   ];

   const [activeTab, setActiveTab] = useState(0);

   return (
      <div className="flex transition-all duration-300 border-2 border-gray-300 rounded-2xl h-[calc(100vh-2rem)] overflow-y-hidden bg-[#f5f7fb] relative">
         <SidePanel />
         <div className="flex-1 p-6 overflow-y-auto min-h-screen customScrollbar">
            <div className="flex gap-4 items-center absolute bottom-0 font-medium -translate-1/2 left-9 text-gray-500 text-sm">
               <p className="text-[#6766e8]">v1.0.0</p>
            </div>
            {/* <div className="flex justify-between items-center">
                     <p className="font-bold bg-gradient-to-r from-[#d4d9fb] via-[#1447e6] to-gray-800 text-transparent bg-clip-text text-xl tracking-wider">
                        Tracksy
                     </p>
                     <p className="">© 2025 Tracksy. All rights reserved.</p>
                  </div> */}
            <div className="h-[calc(100vh-8rem)] ">
               <p className="text-2xl font-bold">Settings</p>

               <div className="flex border w-fit my-5  border-gray-300 rounded-xl overflow-hidden">
                  {Tabs.map((tab, index) => (
                     <div
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`p-1.5 px-6 hover:bg-gray-200 cursor-pointer transition-all duration-200 ${
                           index === 0 ? 'rounded-l-xl' : ''
                        } ${
                           index === Tabs.length - 1 ? 'rounded-r-xl' : ''
                        } hover:border-b-3 hover:border-[#6766e8] ${
                           activeTab === index
                              ? 'text-[#6766e8] border-b-3 border-[#6766e8] bg-gray-200 font-bold transition-all duration-200 '
                              : ''
                        }`}>
                        {tab.title}
                     </div>
                  ))}
               </div>
               {/* <div className="flex flex-col gap-4 my-7">
                  <div className="flex flex-col">
                     <p className="text-lg font-bold">Profile</p>
                     <p className="text-sm font-thin text-gray-500">
                        Update your photo and personal details here.
                     </p>
                  </div>
                  <p className="border-b-1 border-gray-300 w-full"></p>
                  <div className="flex items-center gap-5">
                     <img
                        src={image || mine}
                        alt="mine"
                        className="w-32 h-32 rounded-2xl"
                     />
                     <div>
                        <p className="font-medium">Profile Picture</p>
                        <div className="my-2 flex gap-3">
                           <label
                              htmlFor="image"
                              className="w-full p-1.5 px-5 rounded-lg flex items-center justify-center bg-[#6766e8] text-white hover:bg-[#6766e8]/80  cursor-pointer transition duration-300">
                              <div className="flex items-center justify-center gap-2">
                                 <Upload size={15} />
                                 <p>Upload Image</p>
                              </div>
                              <input
                                 type="file"
                                 name="image"
                                 id="image"
                                 accept="image/*"
                                 className="hidden"
                                 onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                       const reader = new FileReader();
                                       reader.onload = (event) => {
                                          setImage(event.target.result);
                                       };
                                       reader.readAsDataURL(file);
                                    }
                                 }}
                              />
                           </label>
                           <div className="flex p-2 px-5 rounded-lg bg-[#e51e1e] text-white hover:bg-[#e51e1e]/80  cursor-pointer transition duration-300">
                              <div className="flex items-center justify-center gap-2">
                                 <Trash size={15} />
                                 <p>Remove</p>
                              </div>
                           </div>
                        </div>
                        <div>
                           <p className="text-sm font-thin text-gray-500">
                              We support PNGs, JPGs, and GIFs under 10MB.
                           </p>
                        </div>
                     </div>
                  </div>
               </div> */}
               {Tabs[activeTab].component}
            </div>
         </div>
      </div>
   );
};

export default Settings;
