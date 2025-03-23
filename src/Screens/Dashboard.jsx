import React, { useState } from 'react';
import SidePanel from '../Components/SidePanel';
import { useDarkMode } from '../Components/DarkModeContext';
import chip from '../assets/chip.png';
import mastercard from '../assets/mastercard.png';
import { Chart as ChartJs, defaults } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { FaArrowRight } from 'react-icons/fa';
import Model from '../Components/model';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const data = [
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

console.log(labelData());

const expenseData = [550, 1000, 650, 740];

const options = {
   responsive: true,
   maintainAspectRatio: false,
   plugins: {
      title: {
         display: true,
         text: 'Expense Statistic',
         font: {
            size: 24,
            weight: 'bold',
         },
         padding: {
            top: 10,
            bottom: 20,
         },
      },
   },
   animations: {
      y: {
         duration: 2000,
         easing: 'easeOutBounce',
      },
   },
   scales: {
      y: {
         beginAtZero: true,
      },
   },
};

const Dashboard = () => {
   const { isDarkMode } = useDarkMode();
   const [isModalOpen, setIsModalOpen] = useState(false);

   const storageData = localStorage.getItem('settingsData')
   console.log(storageData);
   

   const openModal = () => {
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
   };

   return (
      <>
         <div className="flex min-h-screen transition-all duration-300">
            <SidePanel />
            {staticData.map((details) => (
               <div className={`flex-1 p-6 overflow-y-auto min-h-screen`}>
                  <div className="pb-10 flex justify-between items-center">
                     <p className="font-medium text-3xl">
                        {`Welcome back, ${details.fname}!`}
                     </p>
                     {/* <button className="p-1 px-5 text-white font-bold rounded-xl bg-[#47a37e] cursor-pointer hover:bg-[#47a37e99]" onClick={openModal}>
                     Add
                  </button> */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-x-20 gap-y-28 h-[500px]">
                     <div>
                        <div className="group relative w-full perspective-1000">
                           <div className="absolute w-full h-64 rounded-2xl bg-[#dedde4] transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                              <div className="">
                                 <p className="font-medium text-[#aaa8b0] text-xl px-7 pt-10">
                                    Available Balance
                                 </p>
                                 <div className="mx-6 flex items-center font-mono text-3xl pt-8">
                                    <img
                                       src={chip}
                                       alt="Chip"
                                       className="w-14 h-10"
                                    />
                                    <span className="px-3">{`₹ ${details.availableBalance}`}</span>
                                 </div>
                                 <div className="mx-7 flex justify-between items-center font-light text-lg pt-12">
                                    <p>{`**** **** **** ${details.accountNo}`}</p>
                                    <img
                                       src={mastercard}
                                       alt="Mastercard"
                                       className="w-18 h-12"
                                    />
                                 </div>
                              </div>
                              <div className="absolute top-0 w-full h-full perspective-1000 rounded-2xl bg-[#2f3135] text-white flex flex-col justify-center items-center rotate-y-180 backface-hidden transition-transform transform-style-3d duration-700 group-hover:rotate-y-0">
                                 <p className="text-xl font-bold">
                                    Card Details
                                 </p>
                                 <p className="text-lg mt-2">{`Account No: ${details.accountNo}`}</p>
                                 <p className="text-lg mt-1">{`Holder: ${details.holderName}`}</p>
                                 <p className="text-lg mt-1">{`Expiry: ${details.expiryDate}`}</p>
                              </div>
                           </div>
                        </div>

                        <div className="flex justify-between text-lg px-2 pt-5 items-center font-bold font-mono mt-64 ">
                           <p>Monthly Income</p>
                           <p className="bg-yellow-400 px-4 rounded-2xl text-white">
                              {`₹ ${details.monthlyIncome}`}
                           </p>
                        </div>

                        <div className="grid grid-cols-2 relative mt-6 text-center font-bold text-[#8a898e]">
                           <div className="border-r-2 p-2 border-[#dedde4]">
                              <p className="mb-2">Monthly Budget Limit</p>
                              <span className="text-lg text-white font-mono px-4 rounded-2xl py-0.5 bg-[#47a37e]">
                                 {`₹ ${details.monthlyLimit}`}
                              </span>
                           </div>
                           <div className="p-2">
                              <p className="mb-2">Spent</p>
                              <span className="text-lg text-white font-mono px-4 rounded-2xl py-0.5 bg-[#b74748]">
                                 {`₹ ${details.spent}`}
                              </span>
                           </div>
                           <progress
                              value={
                                 Number(details.monthlyLimit) -
                                 Number(details.spent)
                              }
                              max={details.monthlyLimit}
                              className="w-full h-2 rounded-2xl absolute bg-gray-300 [&::-webkit-progress-bar]:bg-gray-300 [&::-webkit-progress-value]:bg-[#A294F9] -bottom-10"></progress>
                        </div>
                     </div>
                     <div className="">
                        <Bar
                           data={{
                              labels: labelData(),
                              datasets: [
                                 {
                                    label: 'Revenue',
                                    data: expenseData,
                                    backgroundColor: [
                                       'rgba(255, 99, 132, 0.6)', // Red
                                       'rgba(54, 162, 235, 0.6)', // Blue
                                       'rgba(255, 206, 86, 0.6)', // Yellow
                                       'rgba(162, 148, 249, 0.6)', // Green
                                    ],
                                    borderColor: [
                                       'rgba(255, 99, 132, 1)',
                                       'rgba(54, 162, 235, 1)',
                                       'rgba(255, 206, 86, 1)',
                                       'rgba(162, 148, 249, 1)',
                                    ],
                                    borderWidth: 1,
                                 },
                              ],
                           }}
                           options={options}
                        />
                     </div>

                     <div className="">
                        <div className="border-b-2 border-[#ccc] pb-3 font-bold text-xl text-[#666666] mb-4">
                           Recent Payments
                        </div>

                        <div className="overflow-auto customScrollbar h-[350px]">
                           {data.map((value, index) => (
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
