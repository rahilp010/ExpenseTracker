import React, { useEffect, useState, useCallback, useMemo } from 'react';
import SidePanel from '../Components/Dashboard/SidePanel';
import { useDarkMode } from '../Components/DarkModeContext';
import { Chart as ChartJs, defaults } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import {
   Bell,
   Plus,
   Mail,
   Scan,
   UserRoundCheck,
   Pencil,
   CircleX,
} from 'lucide-react';
import ExpenseCard from '../Components/Dashboard/ExpenseCard';
import Model from '../Components/Dashboard/Model';
import { useDispatch, useSelector } from 'react-redux';
import {
   loadExpense,
   selectMonthlyBalance,
   selectTotalExpense,
   setBalanceByMonth,
} from '../app/features/expenseSlice';
import Report from '../Components/Dashboard/Report';
import { months, themes } from '../data';
import Loader from '../Animations/Loader';
import BalanceModal from '../Components/Dashboard/BalanceModal';
import {
   loadProfileSettings,
   setTheme,
   updateProfileSettings,
} from '../app/features/settingsSlice';

// Chart.js defaults configuration
defaults.maintainAspectRatio = false;
defaults.responsive = true;

const Dashboard = () => {
   const { isDarkMode, setIsDarkMode } = useDarkMode();
   const dispatch = useDispatch();

   // Memoize current month calculation
   const currentMonth = useMemo(() => months[new Date().getMonth()], []);

   // Redux selectors
   const addExpenseData = useSelector(
      (state) => state.expense.addExpense?.expenseData || []
   );
   const balanceByMonth = useSelector((state) =>
      selectMonthlyBalance(state, currentMonth)
   );
   const profileSettingsData = useSelector(
      (state) => state.settings.profileSettingsData
   );
   const totalExpense = useSelector(selectTotalExpense);
   const theme = useSelector((state) => state.settings.theme);

   // Local state
   const [showModal, setShowModal] = useState(false);
   const [showBalanceModal, setShowBalanceModal] = useState(false);
   const [isEditingBalance, setIsEditingBalance] = useState(false);
   const [balanceInput, setBalanceInput] = useState(balanceByMonth || 0);
   const [selectedTheme, setSelectedTheme] = useState(themes[0].id);

   // Memoize expensive calculations
   const currentMonthExpenses = useMemo(
      () =>
         addExpenseData.filter((item) => item.monthOfExpense === currentMonth),
      [addExpenseData, currentMonth]
   );

   const validBalance = useMemo(
      () => (typeof balanceByMonth === 'number' ? Math.abs(balanceByMonth) : 0),
      [balanceByMonth]
   );

   const isDarkModeState = useSelector((state) => state.settings.isDarkMode);

   console.log('isDarkModeState', isDarkModeState);

   const validExpense = useMemo(
      () =>
         currentMonthExpenses.reduce(
            (acc, item) => acc + Number(item.price || 0),
            0
         ),
      [currentMonthExpenses]
   );

   const remainingBalance = useMemo(
      () => Math.max(validBalance - validExpense, 0),
      [validBalance, validExpense]
   );

   // Chart configuration
   const centerTextPlugin = useMemo(
      () => ({
         id: 'centerText',
         beforeDraw(chart) {
            const { width, height, ctx } = chart;
            ctx.restore();

            const remaining = chart.data.datasets[0].data[0];

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = isDarkModeState ? 'white' : '#9CA3AF';
            ctx.font = `${height * 0.07}px sans-serif`;
            ctx.fillText('Remaining', width / 2, height / 2.2);

            ctx.fillStyle = isDarkModeState ? 'white' : '#111827';
            ctx.font = `bold ${height * 0.08}px sans-serif`;
            ctx.fillText(`₹${remaining}`, width / 2, height / 1.6);

            ctx.save();
         },
      }),
      [isDarkModeState]
   );

   const chartData = useMemo(
      () => ({
         datasets: [
            {
               backgroundColor: ['#8896f3', '#ffc100'],
               data: [remainingBalance, validExpense],
               borderWidth: 2,
               cutout: '60%',
               borderColor: 'white',
               borderRadius: 10,
               animation: {
                  easing: 'easeInOutQuad',
               },
            },
         ],
      }),
      [remainingBalance, validExpense]
   );

   const balanceDisplayItems = useMemo(
      () => [
         {
            title: 'Usage',
            color: '#FFC400',
            value: Math.abs(chartData.datasets[0].data[1]),
         },
         {
            title: 'Balance',
            color: '#8F9BFF',
            value: balanceByMonth,
         },
      ],
      [chartData.datasets, balanceByMonth]
   );

   const expenseInputMethods = useMemo(
      () => [
         { icon: Mail, name: 'Mail' },
         { icon: Scan, name: 'Library' },
         { icon: UserRoundCheck, name: 'Manually' },
      ],
      []
   );

   // Event handlers
   const handleModal = useCallback(() => {
      setShowModal(true);
   }, []);

   const handleEditBalance = useCallback(
      (e) => {
         if (e.key === 'Enter') {
            dispatch(
               setBalanceByMonth({
                  month: currentMonth,
                  balanceByMonth: parseFloat(balanceInput),
               })
            );
            setIsEditingBalance(false);
         }
      },
      [dispatch, currentMonth, balanceInput]
   );

   const handleBalanceInputChange = useCallback(
      (e) => {
         const value = e.target.value;
         setBalanceInput(value);
         dispatch(
            setBalanceByMonth({
               month: currentMonth,
               balanceByMonth: parseFloat(value),
            })
         );
      },
      [dispatch, currentMonth]
   );

   const handleEditBalanceToggle = useCallback(() => {
      setIsEditingBalance(true);
   }, []);

   const handleEditBalanceCancel = useCallback(() => {
      setIsEditingBalance(false);
   }, []);

   // Effects
   useEffect(() => {
      dispatch(loadExpense());

      // Handle monthly balance initialization
      const storedBalances =
         JSON.parse(localStorage.getItem('balanceByMonth')) || {};
      if (!storedBalances[currentMonth]) {
         dispatch(
            setBalanceByMonth({
               month: currentMonth,
               balanceByMonth: profileSettingsData.balance || 0,
            })
         );
      }

      // Handle profile settings initialization
      const profileData = JSON.parse(
         localStorage.getItem('profileSettingsData')
      );
      if (profileData) {
         dispatch(updateProfileSettings(profileData));
      }
   }, [dispatch, currentMonth, profileSettingsData.balance]);

   useEffect(() => {
      const today = new Date();
      if (today.getDate() === 1) {
         setShowBalanceModal(true);
      }
   }, []);

   useEffect(() => {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
         const themeId = parseInt(storedTheme);
         setSelectedTheme(themeId);
         dispatch(setTheme(themeId));

         // Apply theme-based dark mode
         switch (themeId) {
            case 1:
               setIsDarkMode(false);
               break;
            case 2:
               setIsDarkMode(true);
               break;
            case 3:
               const mediaQuery = window.matchMedia(
                  '(prefers-color-scheme: dark)'
               ).matches;
               setIsDarkMode(mediaQuery);
               break;
            default:
               break;
         }
      }
   }, [dispatch, setIsDarkMode]);

   useEffect(() => {
      setBalanceInput(balanceByMonth);
   }, [balanceByMonth]);

   // Get user's first name safely
   const userName = useMemo(() => {
      return profileSettingsData.name?.split(' ')[0] || 'User';
   }, [profileSettingsData.name]);

   return (
      <div
         className={`flex transition-all duration-300 rounded-2xl h-[calc(100vh-2rem)] overflow-y-hidden ${
            isDarkMode
               ? 'bg-[#111111] text-white'
               : 'bg-[#f5f7fb] border-2 border-gray-300'
         }`}>
         <SidePanel />

         <div className="flex-1 p-6 overflow-y-auto min-h-screen customScrollbar">
            {/* Header */}
            <div className="relative flex items-center justify-end mb-3 gap-5 -mt-2">
               <div className="relative border-2 cursor-pointer text-[#8896f3] border-[#d4d9fb] rounded-full p-2 hover:bg-[#8896f3]/70 transition-all duration-300 hover:text-white">
                  <Bell
                     size={20}
                     strokeWidth={2}
                     className="hover:text-white transition-all duration-300"
                  />
                  <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                     1
                  </div>
               </div>
            </div>

            {/* Welcome message */}
            <div className="my-3">
               <p className="font-bold text-3xl text-[#8896f3]">
                  Hello {userName},
               </p>
               <p className="text-lg font-light my-1">
                  Take a look at your current balance 👀
               </p>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-y-5 gap-x-5">
               {/* Chart and balance section */}
               <div
                  className={`rounded-2xl shadow-lg relative ${
                     isDarkMode ? 'bg-[#222222]' : 'border-2 border-gray-200'
                  }`}>
                  {/* Chart */}
                  <div className="group p-5 relative mt-15">
                     {balanceByMonth !== undefined &&
                     totalExpense !== undefined ? (
                        <Doughnut
                           width={300}
                           height={300}
                           data={chartData}
                           plugins={[centerTextPlugin]}
                           className="drop-shadow-lg"
                        />
                     ) : (
                        <div className="text-center text-gray-400">
                           <Loader />
                        </div>
                     )}
                  </div>

                  {/* Balance display items */}
                  {balanceDisplayItems.map((item, index) => (
                     <div
                        key={item.title}
                        className={`flex flex-col items-end mt-5 absolute top-0 ${
                           index === 0 ? 'right-7' : 'left-7'
                        }`}>
                        <span className="flex items-center gap-2">
                           {item.title}
                           {item.title === 'Balance' && (
                              <Pencil
                                 size={15}
                                 className="cursor-pointer"
                                 onClick={handleEditBalanceToggle}
                              />
                           )}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                           <span
                              style={{ backgroundColor: item.color }}
                              className="inline-block w-4 h-2 rounded-full"
                           />
                           <span
                              className={`text-lg font-medium ${
                                 isDarkMode ? 'text-white' : 'text-gray-800'
                              }`}>
                              {isEditingBalance && item.title === 'Balance' ? (
                                 <div className="flex items-center gap-2">
                                    <input
                                       type="number"
                                       value={balanceInput}
                                       onChange={handleBalanceInputChange}
                                       className="border indent-2 border-gray-300 rounded-md w-20 text-black"
                                       onKeyDown={handleEditBalance}
                                       autoFocus
                                    />
                                    <CircleX
                                       size={20}
                                       className="cursor-pointer text-red-500 hover:text-red-500/70"
                                       onClick={handleEditBalanceCancel}
                                    />
                                 </div>
                              ) : (
                                 `₹ ${item.value}`
                              )}
                           </span>
                        </div>
                     </div>
                  ))}

                  {/* Add expense section */}
                  <div
                     className={`${
                        isDarkMode
                           ? 'bg-[#111111] hover:bg-white/60'
                           : 'bg-white hover:bg-[#d4d9fb]/50'
                     } mx-0 sm:mx-5 md:mx-5 lg:mx-15 rounded-2xl mb-10`}>
                     <div
                        className="p-3 flex items-center gap-2 justify-center cursor-pointer hover:rounded-2xl"
                        onClick={handleModal}>
                        <Plus size={25} className="text-[#FFC400] font-bold" />
                        <p className="text-lg font-medium text-gray-500 cursor-pointer">
                           Add New Expense
                        </p>
                     </div>

                     <div
                        className={`grid grid-cols-3 gap-3 ${
                           isDarkMode ? 'bg-[#1c1c1c]' : 'bg-[#e0e2f3]'
                        } rounded-xl h-28`}>
                        {expenseInputMethods.map((Item, index) => (
                           <div
                              key={`${Item.name}-${index}`}
                              className="flex items-center justify-center gap-2 rounded-2xl my-2">
                              <div>
                                 <Item.icon
                                    className={`text-[#3f58f1] font-bold p-2 ${
                                       isDarkMode ? 'bg-[#111111]' : 'bg-white'
                                    } rounded-lg w-[35px] h-[35px] md:w-[55px] md:h-[55px] md:p-2 lg:p-4`}
                                 />
                                 <p className="text-sm font-medium text-center mt-1 text-[#3f58f1]">
                                    {Item.name}
                                 </p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Expense card */}
               <div>
                  <ExpenseCard />
               </div>

               {/* Report section */}
               <div
                  className={`h-screen col-span-2 rounded-2xl shadow-xl ${
                     isDarkMode ? 'bg-[#222222]' : 'border-gray-200 border-2'
                  }`}>
                  <Report />
               </div>
            </div>
         </div>

         {/* Modals */}
         {showBalanceModal && (
            <BalanceModal setShowBalanceModal={setShowBalanceModal} />
         )}

         {showModal && (
            <Model
               setShowModal={setShowModal}
               currentMonth={currentMonth}
               totalExpense={totalExpense}
            />
         )}
      </div>
   );
};

export default Dashboard;
