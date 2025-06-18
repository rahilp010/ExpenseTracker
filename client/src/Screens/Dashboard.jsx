import React, { useEffect, useState } from 'react';
import SidePanel from '../Components/SidePanel';
import { useDarkMode } from '../Components/DarkModeContext';
import { Chart as ChartJs, defaults } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { FaArrowRight } from 'react-icons/fa';
import FlipCard from '../Animations/FlipCard';
import {
   Search,
   Bell,
   Plus,
   Mail,
   Scan,
   UserRoundCheck,
   Pencil,
   CircleX,
} from 'lucide-react';
import ExpenseCard from '../Components/ExpenseCard';
import Model from '../Components/Model';
import { useDispatch, useSelector } from 'react-redux';
import {
   loadExpense,
   selectTotalExpense,
   updateBalance,
} from '../app/features/expenseSlice';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const dataMain = [
   { transaction: 'Daily', Date: 'Sep 10, 2024', spendMoney: '₹3,000' },
   { transaction: 'Groceries', Date: 'Sep 9, 2024', spendMoney: '₹1,500' },
   { transaction: 'Subscription', Date: 'Sep 8, 2024', spendMoney: '₹899' },
];

const Dashboard = () => {
   const { isDarkMode } = useDarkMode();
   const dispatch = useDispatch();
   const addExpenseData = useSelector(
      (state) => state.expense.addExpense.expenseData
   );
   const balance = useSelector((state) => state.expense.addExpense.balance);
   const totalExpense = useSelector(selectTotalExpense);

   const [showModal, setShowModal] = useState(false);
   const [isEditingBalance, setIsEditingBalance] = useState(false);
   const [balanceInput, setBalanceInput] = useState(balance || 0);

   useEffect(() => {
      dispatch(loadExpense());
   }, [dispatch]);

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
            data: [balance, totalExpense],
            borderWidth: 2,
            cutout: '60%',
            borderColor: 'white',
            borderRadius: 10,
            animation: {
               easing: 'easeInOutQuad',
            },
         },
      ],
   };

   const handleModal = () => {
      setShowModal(true);
   };

   const handleEditBalance = (e) => {
      if (e.key === 'Enter') {
         dispatch(updateBalance(Number(balanceInput)));
         setIsEditingBalance(false);
      }
   };

   return (
      <>
         <div className="flex transition-all duration-300 border-2 border-gray-300 rounded-2xl h-[calc(100vh-2rem)] overflow-y-hidden bg-[#f5f7fb]">
            <SidePanel />
            <div
               className={`flex-1 p-6 overflow-y-auto min-h-screen customScrollbar`}>
               <div className="relative flex items-center justify-end mb-3 gap-5 -mt-2">
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
                           className="drop-shadow-lg"
                        />
                     </div>
                     {[
                        {
                           title: 'Usage',
                           color: '#FFC400',
                           value: Math.abs(data.datasets[0].data[1]),
                        },
                        {
                           title: 'Balance',
                           color: '#8F9BFF',
                           value: data.datasets[0].data[0],
                        },
                     ].map((item, index) => (
                        <div
                           className={`flex flex-col items-end mt-5 absolute top-0 ${
                              index === 0 ? 'right-7' : 'left-7'
                           }`}>
                           <span className=" flex items-center gap-2 ">
                              {item.title}
                              {item.title === 'Balance' ? (
                                 <Pencil
                                    size={15}
                                    className="cursor-pointer"
                                    onClick={() => setIsEditingBalance(true)}
                                 />
                              ) : (
                                 ''
                              )}
                           </span>
                           <div className="flex items-center gap-2 mt-1">
                              <span
                                 style={{ backgroundColor: item.color }}
                                 className={`inline-block w-4 h-2 rounded-full `}
                              />
                              <span className="text-lg font-medium text-gray-800">
                                 {isEditingBalance &&
                                 item.title === 'Balance' ? (
                                    <div className="flex items-center gap-2">
                                       <input
                                          type="number"
                                          name=""
                                          id=""
                                          value={balanceInput}
                                          onChange={(e) =>
                                             setBalanceInput(e.target.value)
                                          }
                                          className="border indent-2 border-gray-300 rounded-md w-20"
                                          onKeyDown={(e) =>
                                             handleEditBalance(e)
                                          }
                                       />
                                       <CircleX
                                          size={20}
                                          className="cursor-pointer text-red-500 hover:text-red-500/70"
                                          onClick={() =>
                                             setIsEditingBalance(false)
                                          }
                                       />
                                    </div>
                                 ) : (
                                    ` ₹ ${item.value}`
                                 )}
                              </span>
                           </div>
                        </div>
                     ))}

                     <div
                        className="bg-white mx-0 sm:mx-5 md:mx-5 lg:mx-15 rounded-2xl mb-10"
                        onClick={handleModal}>
                        <div className="p-3 flex items-center gap-2 justify-center cursor-pointer hover:bg-[#d4d9fb]/50 hover:rounded-2xl">
                           <Plus
                              size={25}
                              className="text-[#FFC400] font-bold"
                           />
                           <p className="text-lg font-medium text-gray-500 cursor-pointer">
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
                                    {/* <Item.icon
                                             size={screen.width > 768 ? 55 : 35}
                                             className="text-[#3f58f1] font-bold p-2 sm:p-2 md:p-2 lg:p-4 bg-white rounded-lg"
                                          /> */}
                                    <Item.icon className="text-[#3f58f1] font-bold p-2 bg-white rounded-lg w-[35px] h-[35px] md:w-[55px] md:h-[55px] md:p-2 lg:p-4" />

                                    <p className="text-sm font-medium text-center mt-1 text-[#3f58f1]">
                                       {Item.name}
                                    </p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="">
                     <ExpenseCard />
                  </div>

                  {showModal && <Model setShowModal={setShowModal} />}

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
         </div>
      </>
   );
};

export default Dashboard;
