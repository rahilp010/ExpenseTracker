import React, { useState } from 'react';
import SidePanel from '../Components/SidePanel';
import { useDarkMode } from '../Components/DarkModeContext';
import { Chart as ChartJs, defaults } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { FaArrowRight } from 'react-icons/fa';
import FlipCard from '../Animations/FlipCard';
import { Search, Bell, Plus, Mail, Scan, UserRoundCheck } from 'lucide-react';
import ExpenseCard from '../Components/ExpenseCard';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const dataMain = [
   { transaction: 'Daily', Date: 'Sep 10, 2024', spendMoney: '₹3,000' },
   { transaction: 'Groceries', Date: 'Sep 9, 2024', spendMoney: '₹1,500' },
   { transaction: 'Subscription', Date: 'Sep 8, 2024', spendMoney: '₹899' },
];

const staticData = [
   {
      fname: 'Rahil',
      lname: 'Patel',
      userName: 'rp',
      availableBalance: '124000',
      accountNo: '6958',
      monthlyIncome: '30000',
      monthlyLimit: '20000',
      spent: '5000',
      holderName: 'Rahil Patel',
      expiryDate: '12/26',
   },
];

const labelData = () => {
   let labels = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEPT',
      'OCT',
      'NOV',
      'DEC',
   ];
   let month = new Date().getMonth();
   let start = Math.floor(month / 4) * 4;

   let selectedLabels = labels.slice(start, start + 4);
   return selectedLabels;
};

const Dashboard = () => {
   const { isDarkMode } = useDarkMode();

   const centerTextPlugin = {
      id: 'centerText',
      beforeDraw(chart) {
         const { width, height, ctx } = chart;
         ctx.restore();
         const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';

         ctx.fillStyle = '#9CA3AF'; // light gray
         ctx.font = `${height * 0.07}px sans-serif`;
         ctx.fillText('Total', width / 2, height / 2.2);

         ctx.fillStyle = '#111827'; // dark text
         ctx.font = `bold ${height * 0.08}px sans-serif`;
         ctx.fillText(`₹${total}`, width / 2, height / 1.6);

         ctx.save();
      },
   };

   const data = {
      datasets: [
         {
            backgroundColor: ['#8896f3', '#ffc100'],
            data: [1500, 900],
            borderWidth: 1,
            cutout: '60%',
            borderColor: 'white',
            borderRadius: 10,
            borderSkipped: false,
            hoverBorderWidth: 1,
            hoverBorderRadius: 10,
            hoverBorderSkipped: false,
            animation: {
               duration: 1000,
               easing: 'easeInOutQuad',
            },
         },
      ],
   };

   const storageData = localStorage.getItem('settingsData');
   console.log(storageData);

   return (
      <>
         <div className="flex transition-all duration-300 border-2 border-gray-300 rounded-2xl h-[calc(100vh-2rem)] overflow-y-hidden bg-[#f5f7fb]">
            <SidePanel />
            {staticData.map((details) => (
               <div
                  className={`flex-1 p-6 overflow-y-auto min-h-screen customScrollbar`}>
                  <div className="relative flex items-center justify-end mb-4 gap-5">
                     <div className="relative w-64">
                        <input
                           type="text"
                           placeholder="Search..."
                           className="w-full p-2 rounded-2xl border-2 indent-2 border-[#d4d9fb] outline-none focus:border-[#8896f3]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                           <Search
                              size={20}
                              strokeWidth={2}
                              className="text-[#8896f3]"
                           />
                        </div>
                     </div>
                     <div className="relative border-2 border-[#d4d9fb] rounded-full p-2">
                        <Bell
                           size={23}
                           strokeWidth={2}
                           className="text-[#8896f3]"
                        />
                     </div>
                  </div>
                  <div className="my-7">
                     <p className="font-bold text-3xl text-[#8896f3]">
                        Hello Rahil,
                     </p>
                     <p className="text-lg font-light my-1">
                        Take a look at your current balance 👀
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-y-28 min-h-[600px] gap-x-5">
                     <div className="border-2 border-gray-200 rounded-2xl shadow-lg relative">
                        <div className="group p-5 relative mt-15">
                           <Doughnut
                              width={300}
                              height={300}
                              data={data}
                              plugins={[centerTextPlugin]}
                              className='drop-shadow-lg'
                           />
                        </div>
                        {[
                           {
                              title: 'Unrequested',
                              color: '#FFC400',
                              value: data.datasets[0].data[0],
                           },
                           {
                              title: 'Requested',
                              color: '#8F9BFF',
                              value: data.datasets[0].data[1],
                           },
                        ].map((item, index) => (
                           <div
                              className={`flex flex-col items-end mt-5 absolute top-0 ${
                                 index === 0 ? 'right-7' : 'left-7'
                              }`}>
                              <span className="text-gray-400">
                                 {item.title}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                 <span
                                    className={`inline-block w-4 h-2 rounded-full bg-[${item.color}] `}
                                 />
                                 <span className="text-lg font-medium text-gray-800">
                                    ₹ {item.value}
                                 </span>
                              </div>
                           </div>
                        ))}

                        <div className="bg-white mx-0 sm:mx-5 md:mx-5 lg:mx-15 rounded-2xl mb-10">
                           <div className="p-3 flex items-center gap-2 justify-center cursor-pointer">
                              <Plus
                                 size={25}
                                 className="text-[#FFC400] font-bold"
                              />
                              <p className="text-lg font-medium text-gray-500">
                                 Add New Expense
                              </p>
                           </div>

                           <div className="grid grid-cols-3 gap-3 bg-[#e0e2f3] rounded-xl h-28">
                              {[
                                 { icon: Mail, name: 'Mail' },
                                 { icon: Scan, name: 'Library' },
                                 { icon: UserRoundCheck, name: 'Manually' },
                              ].map((Item, index) => (
                                 <div className="flex items-center justify-center gap-2 rounded-2xl my-2">
                                    <div>
                                       <Item.icon
                                          size={55}
                                          className="text-[#3f58f1] font-bold p-2 sm:p-2 md:p-2 lg:p-4 bg-white rounded-lg"
                                       />
                                       <p className='text-sm font-medium text-center mt-1 text-[#3f58f1]'>{Item.name}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="">
                        <ExpenseCard />
                     </div>

                     <div className="">
                        <div className="border-b-2 border-[#ccc] pb-3 font-bold text-xl text-[#666666] mb-4">
                           Recent Payments
                        </div>

                        <div className="overflow-auto customScrollbar h-[350px]">
                           {dataMain?.map((value, index) => (
                              <div
                                 key={index}
                                 className="shadow-md bg-[#dedde4] grid grid-cols-[50px_auto_auto_50px] items-center my-4 py-1 rounded-2xl">
                                 <div className=" text-center p-2">🔴</div>
                                 <div className=" text-center p-2">
                                    <div className="text-left">
                                       <p className="font-bold">
                                          {value.transaction}
                                       </p>
                                       <p className="font-light text-sm">
                                          {value.Date}
                                       </p>
                                    </div>
                                 </div>
                                 <div className=" text-center p-2">
                                    {value.spendMoney}
                                 </div>
                                 <div className=" text-center p-2">
                                    <FaArrowRight />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="h-[480px]">
                        <div className="border-b-2 border-[#ccc] pb-3 font-bold text-xl text-[#666666] mb-4">
                           Monthly Expense
                        </div>

                        <div></div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </>
   );
};

export default Dashboard;
