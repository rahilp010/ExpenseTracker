import React, { useState } from 'react';
import { X, Target, Sliders, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
   setBalanceByMonth,
   setCategoryBudget,
   selectCategoryBudgets,
} from '../../app/features/expenseSlice';
import { expenseCategories } from '../../data';
import { useDarkMode } from '../DarkModeContext';

const BalanceModal = ({ setShowBalanceModal, currentMonth, currency = '₹' }) => {
   const { isDarkMode } = useDarkMode();
   const dispatch = useDispatch();

   const currentStoredBalance = useSelector(
      (state) => state.expense.addExpense.balanceByMonth[currentMonth] || 25000
   );
   const currentBudgets = useSelector(selectCategoryBudgets);

   const [balance, setBalance] = useState(String(currentStoredBalance));
   const [budgets, setBudgets] = useState({ ...currentBudgets });
   const [activeSection, setActiveSection] = useState('base'); // 'base' | 'categories'

   const handleAddQuick = (amount) => {
      const current = parseFloat(balance) || 0;
      setBalance(String(current + amount));
   };

   const handleBudgetChange = (catName, val) => {
      setBudgets((prev) => ({
         ...prev,
         [catName]: parseFloat(val) || 0,
      }));
   };

   const handleSave = (e) => {
      e.preventDefault();
      const parsedBalance = parseFloat(balance);
      if (isNaN(parsedBalance) || parsedBalance < 0) {
         toast.error('Please enter a valid monthly balance amount');
         return;
      }

      // Save base monthly balance
      dispatch(
         setBalanceByMonth({
            month: currentMonth,
            balanceByMonth: parsedBalance,
         })
      );

      // Save category budgets
      Object.entries(budgets).forEach(([category, limit]) => {
         dispatch(setCategoryBudget({ category, budget: limit }));
      });

      toast.success('Budget parameters updated');
      setShowBalanceModal(false);
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
         <div
            className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all
               ${
                  isDarkMode
                     ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                     : 'bg-white border-slate-200 text-slate-800'
               }`}
         >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
               <div>
                  <h3 className="text-lg font-bold tracking-tight">
                     Budget & Balance Targets
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                     Configure targets for {currentMonth}
                  </p>
               </div>

               <button
                  onClick={() => setShowBalanceModal(false)}
                  className={`p-1.5 rounded-lg border transition-colors
                     ${
                        isDarkMode
                           ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                           : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                     }`}
                  aria-label="Close"
               >
                  <X size={18} />
               </button>
            </div>

            {/* Sub-nav toggle */}
            <div
               className={`flex p-1 rounded-xl border text-xs font-semibold my-4
                  ${
                     isDarkMode
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-400'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
            >
               <button
                  type="button"
                  onClick={() => setActiveSection('base')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5
                     ${
                        activeSection === 'base'
                           ? isDarkMode
                              ? 'bg-zinc-800 text-white shadow-xs'
                              : 'bg-white text-slate-900 shadow-xs'
                           : ''
                     }`}
               >
                  <Target size={14} />
                  <span>Base Balance</span>
               </button>
               <button
                  type="button"
                  onClick={() => setActiveSection('categories')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5
                     ${
                        activeSection === 'categories'
                           ? isDarkMode
                              ? 'bg-zinc-800 text-white shadow-xs'
                              : 'bg-white text-slate-900 shadow-xs'
                           : ''
                     }`}
               >
                  <Sliders size={14} />
                  <span>Category Limits</span>
               </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
               {activeSection === 'base' ? (
                  <div>
                     <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                        Monthly Base Target ({currency})
                     </label>
                     <div className="relative mb-3">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 dark:text-zinc-500">
                           {currency}
                        </span>
                        <input
                           type="number"
                           step="any"
                           value={balance}
                           onChange={(e) => setBalance(e.target.value)}
                           className={`w-full pl-8 pr-4 py-2.5 rounded-xl text-lg font-bold font-mono border outline-none
                              ${
                                 isDarkMode
                                    ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500'
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:bg-white'
                              }`}
                           autoFocus
                        />
                     </div>

                     {/* Quick Increment Chips */}
                     <div className="flex flex-wrap gap-2 pt-1">
                        {[1000, 5000, 10000].map((amt) => (
                           <button
                              key={amt}
                              type="button"
                              onClick={() => handleAddQuick(amt)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors
                                 ${
                                    isDarkMode
                                       ? 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800'
                                       : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                                 }`}
                           >
                              +{currency}
                              {amt.toLocaleString()}
                           </button>
                        ))}
                     </div>
                  </div>
               ) : (
                  <div className="max-h-60 overflow-y-auto customScrollbar space-y-2.5 pr-1">
                     {expenseCategories.map((cat) => (
                        <div
                           key={cat.name}
                           className="flex items-center justify-between text-xs p-2 rounded-xl border border-slate-100 dark:border-zinc-800"
                        >
                           <div className="flex items-center gap-2 truncate pr-2">
                              <span
                                 style={{ backgroundColor: cat.color }}
                                 className="w-2.5 h-2.5 rounded-full shrink-0"
                              />
                              <span className="font-medium truncate">{cat.name}</span>
                           </div>
                           <div className="flex items-center gap-1 shrink-0 w-28">
                              <span className="text-slate-400 dark:text-zinc-500">
                                 {currency}
                              </span>
                              <input
                                 type="number"
                                 value={budgets[cat.name] ?? cat.defaultBudget}
                                 onChange={(e) =>
                                    handleBudgetChange(cat.name, e.target.value)
                                 }
                                 className={`w-full px-2 py-1 rounded-lg text-xs font-mono font-medium border text-right outline-none
                                    ${
                                       isDarkMode
                                          ? 'bg-zinc-950 border-zinc-800 text-zinc-100'
                                          : 'bg-slate-50 border-slate-200 text-slate-800'
                                    }`}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {/* Submit CTA */}
               <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-zinc-800">
                  <button
                     type="button"
                     onClick={() => setShowBalanceModal(false)}
                     className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors
                        ${
                           isDarkMode
                              ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                  >
                     Cancel
                  </button>

                  <button
                     type="submit"
                     className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                  >
                     <Check size={14} strokeWidth={2.4} />
                     <span>Save Target</span>
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default BalanceModal;
