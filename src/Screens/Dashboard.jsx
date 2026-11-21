import React, { useEffect, useState, useMemo } from 'react';
import SidePanel from '../Components/Dashboard/SidePanel';
import { useDarkMode } from '../Components/DarkModeContext';
import {
   Plus,
   Calendar,
   SlidersHorizontal,
   Zap,
   Coffee,
   Car,
   ShoppingBag,
} from 'lucide-react';
import ExpenseCard from '../Components/Dashboard/ExpenseCard';
import Model from '../Components/Dashboard/Model';
import BalanceModal from '../Components/Dashboard/BalanceModal';
import StatCards from '../Components/Dashboard/StatCards';
import Report from '../Components/Dashboard/Report';
import { useDispatch, useSelector } from 'react-redux';
import {
   loadExpense,
   selectMonthlyBalance,
   selectTotalExpense,
   selectTotalIncome,
   selectNetSavings,
   addExpense,
} from '../app/features/expenseSlice';
import {
   loadProfileSettings,
} from '../app/features/settingsSlice';
import { months } from '../data';
import { toast } from 'react-toastify';

const Dashboard = () => {
   const { isDarkMode } = useDarkMode();
   const dispatch = useDispatch();

   // Month state
   const [selectedMonthIndex, setSelectedMonthIndex] = useState(() => new Date().getMonth());
   const currentMonthName = months[selectedMonthIndex];

   // Redux selectors
   const profileData = useSelector(
      (state) => state.settings.profileSettingsData
   );

   const currency = profileData.currency || '₹';

   const totalExpense = useSelector((state) =>
      selectTotalExpense(state, currentMonthName)
   );
   const totalIncome = useSelector((state) =>
      selectTotalIncome(state, currentMonthName)
   );
   const baseBalance = useSelector((state) =>
      selectMonthlyBalance(state, currentMonthName)
   );
   const netBalance = useSelector((state) =>
      selectNetSavings(state, currentMonthName)
   );

   // Modal visibility states
   const [showAddModal, setShowAddModal] = useState(false);
   const [showBalanceModal, setShowBalanceModal] = useState(false);

   useEffect(() => {
      dispatch(loadExpense());
      dispatch(loadProfileSettings());
   }, [dispatch]);

   const userName = useMemo(() => {
      if (profileData?.name) {
         return profileData.name.split(' ')[0];
      }
      return 'Friend';
   }, [profileData]);

   const todayFormatted = useMemo(() => {
      return new Date().toLocaleDateString('en-US', {
         weekday: 'long',
         month: 'short',
         day: 'numeric',
         year: 'numeric',
      });
   }, []);

   // Quick 1-click transaction shortcuts
   const handleQuickAdd = (title, category, amount, color) => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      dispatch(
         addExpense({
            title,
            category,
            price: amount,
            type: 'expense',
            paymentMethod: 'UPI',
            date: dateStr,
            monthOfExpense: currentMonthName,
            color,
            notes: 'Quick recorded from dashboard shortcuts',
         })
      );
      toast.success(`Quick added: ${title} (${currency}${amount})`);
   };

   return (
      <div
         className={`min-h-screen flex transition-colors duration-200
            ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}
      >
         {/* Navigation Sidebar */}
         <SidePanel onAddTransaction={() => setShowAddModal(true)} />

         {/* Main View Area */}
         <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-12 space-y-8 overflow-x-hidden">
            {/* Top Bar / Greeting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1">
                     <Calendar size={14} className="text-indigo-500" />
                     <span>{todayFormatted}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
                     Welcome back, {userName} 👋
                  </h1>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                     Here is your financial snapshot for {currentMonthName}
                  </p>
               </div>

               {/* Header Action Buttons */}
               <div className="flex items-center gap-2.5">
                  <button
                     onClick={() => setShowBalanceModal(true)}
                     className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all
                        ${
                           isDarkMode
                              ? 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
                        }`}
                  >
                     <SlidersHorizontal size={14} />
                     <span>Adjust Budget</span>
                  </button>

                  <button
                     onClick={() => setShowAddModal(true)}
                     className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-600/30"
                  >
                     <Plus size={16} strokeWidth={2.4} />
                     <span>New Entry</span>
                  </button>
               </div>
            </div>

            {/* Top KPI Metrics Row */}
            <StatCards
               netBalance={netBalance}
               totalIncome={totalIncome}
               totalExpense={totalExpense}
               baseBalance={baseBalance}
               onEditBalance={() => setShowBalanceModal(true)}
               currency={currency}
            />

            {/* Middle Section: Financial Distribution & Quick Shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Left (2 Cols): Category Breakdown & Budgets */}
               <div className="lg:col-span-2">
                  <ExpenseCard
                     currentMonthIndex={selectedMonthIndex}
                     onChangeMonth={setSelectedMonthIndex}
                     currency={currency}
                     onOpenBudgetModal={() => setShowBalanceModal(true)}
                  />
               </div>

               {/* Right (1 Col): Quick Action Presets & Insights */}
               <div
                  className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200
                     ${
                        isDarkMode
                           ? 'bg-zinc-900/70 border-zinc-800/80 text-zinc-100'
                           : 'bg-white border-slate-200/80 text-slate-800 shadow-sm'
                     }`}
               >
                  <div>
                     <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-zinc-800 mb-4">
                        <Zap size={16} className="text-amber-500" />
                        <h3 className="text-sm font-bold tracking-tight">
                           Quick Expense Presets
                        </h3>
                     </div>

                     <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                        Tap any frequent expense to record it instantly with zero typing:
                     </p>

                     <div className="space-y-2.5">
                        <button
                           onClick={() =>
                              handleQuickAdd('Morning Coffee & Snack', 'Food & Dining', 220, '#f97316')
                           }
                           className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all group
                              ${
                                 isDarkMode
                                    ? 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/60'
                                    : 'border-slate-100 bg-slate-50/70 hover:bg-indigo-50/50 hover:border-indigo-100'
                              }`}
                        >
                           <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                 <Coffee size={16} />
                              </div>
                              <div className="text-left">
                                 <div className="font-semibold text-slate-900 dark:text-zinc-100">
                                    Coffee / Tea
                                 </div>
                                 <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                                    Food & Dining
                                 </div>
                              </div>
                           </div>
                           <span className="font-bold font-mono text-slate-700 dark:text-zinc-300">
                              {currency}220
                           </span>
                        </button>

                        <button
                           onClick={() =>
                              handleQuickAdd('Metro / Cab Ride', 'Transportation', 180, '#06b6d4')
                           }
                           className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all group
                              ${
                                 isDarkMode
                                    ? 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/60'
                                    : 'border-slate-100 bg-slate-50/70 hover:bg-indigo-50/50 hover:border-indigo-100'
                              }`}
                        >
                           <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                                 <Car size={16} />
                              </div>
                              <div className="text-left">
                                 <div className="font-semibold text-slate-900 dark:text-zinc-100">
                                    Cab / Commute
                                 </div>
                                 <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                                    Transportation
                                 </div>
                              </div>
                           </div>
                           <span className="font-bold font-mono text-slate-700 dark:text-zinc-300">
                              {currency}180
                           </span>
                        </button>

                        <button
                           onClick={() =>
                              handleQuickAdd('Daily Supermarket Run', 'Food & Dining', 750, '#f97316')
                           }
                           className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all group
                              ${
                                 isDarkMode
                                    ? 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800/60'
                                    : 'border-slate-100 bg-slate-50/70 hover:bg-indigo-50/50 hover:border-indigo-100'
                              }`}
                        >
                           <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                                 <ShoppingBag size={16} />
                              </div>
                              <div className="text-left">
                                 <div className="font-semibold text-slate-900 dark:text-zinc-100">
                                    Essentials & Groceries
                                 </div>
                                 <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                                    Food & Dining
                                 </div>
                              </div>
                           </div>
                           <span className="font-bold font-mono text-slate-700 dark:text-zinc-300">
                              {currency}750
                           </span>
                        </button>
                     </div>
                  </div>

                  {/* Vault note */}
                  <div
                     className={`mt-4 p-3 rounded-xl border text-[11px] leading-relaxed
                        ${
                           isDarkMode
                              ? 'bg-zinc-950/40 border-zinc-800/80 text-zinc-400'
                              : 'bg-slate-50 border-slate-200/80 text-slate-500'
                        }`}
                  >
                     <p className="font-semibold text-slate-700 dark:text-zinc-300 mb-0.5">
                        💡 Smart Financial Rule:
                     </p>
                     Aim to allocate at least 20% of monthly earnings into savings or investments before discretionary spending.
                  </div>
               </div>
            </div>

            {/* Bottom Full-Width Section: Transactions & Ledger */}
            <div className="pt-2">
               <Report
                  onOpenAddModal={() => setShowAddModal(true)}
                  currency={currency}
               />
            </div>
         </main>

         {/* Transaction Modal (Add / Edit) */}
         {showAddModal && (
            <Model
               setShowModal={setShowAddModal}
               currentMonth={currentMonthName}
               currency={currency}
            />
         )}

         {/* Budget & Target Modal */}
         {showBalanceModal && (
            <BalanceModal
               setShowBalanceModal={setShowBalanceModal}
               currentMonth={currentMonthName}
               currency={currency}
            />
         )}
      </div>
   );
};

export default Dashboard;
