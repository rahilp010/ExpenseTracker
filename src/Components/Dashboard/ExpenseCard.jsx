import { useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
   Chart as ChartJS,
   ArcElement,
   Tooltip,
   Legend,
} from 'chart.js';
import {
   ChevronLeft,
   ChevronRight,
   PieChart,
   Sliders,
   AlertCircle,
   CheckCircle2,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { months } from '../../data';
import { useDarkMode } from '../DarkModeContext';
import { selectCategoryBudgets } from '../../app/features/expenseSlice';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseCard = ({
   currentMonthIndex,
   onChangeMonth,
   currency = '₹',
   onOpenBudgetModal,
}) => {
   const { isDarkMode } = useDarkMode();
   const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'budgets'

   const allTransactions = useSelector(
      (state) => state.expense.addExpense.expenseData || []
   );
   const categoryBudgets = useSelector(selectCategoryBudgets);

   const currentMonthName = months[currentMonthIndex];

   // Filter expenses for this selected month
   const monthExpenses = useMemo(() => {
      return allTransactions.filter((tx) => {
         const isExpense = !tx.type || tx.type === 'expense';
         if (!isExpense) return false;

         if (tx.date) {
            const dateParts = tx.date.split('-');
            if (dateParts.length >= 2) {
               const mIndex = parseInt(dateParts[1], 10) - 1;
               return mIndex === currentMonthIndex;
            }
         }
         return tx.monthOfExpense === currentMonthName;
      });
   }, [allTransactions, currentMonthIndex, currentMonthName]);

   // Group expenses by category
   const categoryBreakdown = useMemo(() => {
      const map = {};
      monthExpenses.forEach((item) => {
         const cat = item.category || 'Other';
         if (!map[cat]) {
            map[cat] = {
               name: cat,
               color: item.color || '#64748b',
               total: 0,
               count: 0,
            };
         }
         map[cat].total += parseFloat(item.price) || 0;
         map[cat].count += 1;
      });
      return Object.values(map).sort((a, b) => b.total - a.total);
   }, [monthExpenses]);

   const totalMonthExpense = useMemo(() => {
      return categoryBreakdown.reduce((sum, c) => sum + c.total, 0);
   }, [categoryBreakdown]);

   // Chart.js data
   const chartData = useMemo(() => {
      if (categoryBreakdown.length === 0) {
         return {
            labels: ['No Expenses Recorded'],
            datasets: [
               {
                  data: [1],
                  backgroundColor: [isDarkMode ? '#27272a' : '#e2e8f0'],
                  borderWidth: 0,
               },
            ],
         };
      }

      return {
         labels: categoryBreakdown.map((c) => c.name),
         datasets: [
            {
               data: categoryBreakdown.map((c) => c.total),
               backgroundColor: categoryBreakdown.map((c) => c.color),
               borderColor: isDarkMode ? '#18181b' : '#ffffff',
               borderWidth: 2,
               cutout: '72%',
               borderRadius: 4,
            },
         ],
      };
   }, [categoryBreakdown, isDarkMode]);

   const chartOptions = useMemo(() => {
      return {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
            legend: {
               display: false,
            },
            tooltip: {
               callbacks: {
                  label: (ctx) => {
                     if (categoryBreakdown.length === 0) return ' No data';
                     const value = ctx.parsed || 0;
                     const percentage =
                        totalMonthExpense > 0
                           ? Math.round((value / totalMonthExpense) * 100)
                           : 0;
                     return ` ${ctx.label}: ${currency}${value.toLocaleString()} (${percentage}%)`;
                  },
               },
               padding: 10,
               cornerRadius: 8,
            },
         },
      };
   }, [categoryBreakdown, totalMonthExpense, currency]);

   return (
      <div
         className={`h-full flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200
            ${
               isDarkMode
                  ? 'bg-zinc-900/70 border-zinc-800/80 text-zinc-100'
                  : 'bg-white border-slate-200/80 text-slate-800 shadow-sm'
            }`}
      >
         {/* Top Card Navigation & Switcher */}
         <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
               <button
                  onClick={() => onChangeMonth(Math.max(0, currentMonthIndex - 1))}
                  disabled={currentMonthIndex <= 0}
                  className={`p-1.5 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed
                     ${
                        isDarkMode
                           ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                           : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                     }`}
                  aria-label="Previous month"
               >
                  <ChevronLeft size={16} />
               </button>

               <span className="font-semibold text-sm tracking-tight px-1">
                  {currentMonthName} {new Date().getFullYear()}
               </span>

               <button
                  onClick={() =>
                     onChangeMonth(Math.min(months.length - 1, currentMonthIndex + 1))
                  }
                  disabled={currentMonthIndex >= months.length - 1}
                  className={`p-1.5 rounded-lg border transition-colors disabled:opacity-30 disabled:cursor-not-allowed
                     ${
                        isDarkMode
                           ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                           : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                     }`}
                  aria-label="Next month"
               >
                  <ChevronRight size={16} />
               </button>
            </div>

            {/* Segmented Tab Controls */}
            <div
               className={`flex p-1 rounded-xl border text-xs font-medium
                  ${
                     isDarkMode
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-400'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
            >
               <button
                  onClick={() => setActiveTab('chart')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all
                     ${
                        activeTab === 'chart'
                           ? isDarkMode
                              ? 'bg-zinc-800 text-white shadow-xs'
                              : 'bg-white text-slate-900 shadow-xs font-semibold'
                           : 'hover:text-slate-900 dark:hover:text-zinc-200'
                     }`}
               >
                  <PieChart size={14} />
                  <span>Chart</span>
               </button>
               <button
                  onClick={() => setActiveTab('budgets')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all
                     ${
                        activeTab === 'budgets'
                           ? isDarkMode
                              ? 'bg-zinc-800 text-white shadow-xs'
                              : 'bg-white text-slate-900 shadow-xs font-semibold'
                           : 'hover:text-slate-900 dark:hover:text-zinc-200'
                     }`}
               >
                  <Sliders size={14} />
                  <span>Budgets</span>
               </button>
            </div>
         </div>

         {/* Card Body */}
         <div className="py-4 flex-1">
            {activeTab === 'chart' ? (
               <div className="flex flex-col h-full justify-between gap-4">
                  {/* Doughnut Chart with Centered Total */}
                  <div className="relative w-full h-52 flex items-center justify-center">
                     <Doughnut data={chartData} options={chartOptions} />
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                           Total Outflow
                        </span>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 mt-0.5">
                           {currency}
                           {totalMonthExpense.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                           {categoryBreakdown.length} Categories
                        </span>
                     </div>
                  </div>

                  {/* Top Category List */}
                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto customScrollbar pr-1">
                     {categoryBreakdown.length === 0 ? (
                        <div className="text-center py-6 text-sm text-slate-400 dark:text-zinc-500">
                           No expense entries for this month yet.
                        </div>
                     ) : (
                        categoryBreakdown.map((cat) => {
                           const pct =
                              totalMonthExpense > 0
                                 ? Math.round((cat.total / totalMonthExpense) * 100)
                                 : 0;
                           return (
                              <div
                                 key={cat.name}
                                 className="flex items-center justify-between text-xs py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
                              >
                                 <div className="flex items-center gap-2.5 truncate pr-2">
                                    <span
                                       style={{ backgroundColor: cat.color }}
                                       className="w-2.5 h-2.5 rounded-full shrink-0"
                                    />
                                    <span className="font-medium truncate">{cat.name}</span>
                                    <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                                       ({cat.count})
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-semibold">
                                       {currency}
                                       {cat.total.toLocaleString()}
                                    </span>
                                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 w-8 text-right">
                                       {pct}%
                                    </span>
                                 </div>
                              </div>
                           );
                        })
                     )}
                  </div>
               </div>
            ) : (
               /* Budget Tracking Tab */
               <div className="space-y-3.5 max-h-80 overflow-y-auto customScrollbar pr-1">
                  <div className="flex items-center justify-between pb-1">
                     <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
                        Monthly Category Limits
                     </span>
                     {onOpenBudgetModal && (
                        <button
                           onClick={onOpenBudgetModal}
                           className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                           Edit Targets
                        </button>
                     )}
                  </div>

                  {Object.keys(categoryBudgets).length === 0 ? (
                     <div className="text-center py-8 text-xs text-slate-400 dark:text-zinc-500">
                        No budget targets configured yet.
                     </div>
                  ) : (
                     Object.entries(categoryBudgets)
                        .slice(0, 7)
                        .map(([catName, budgetLimit]) => {
                           const spent =
                              categoryBreakdown.find((c) => c.name === catName)?.total || 0;
                           const percent =
                              budgetLimit > 0
                                 ? Math.min(100, Math.round((spent / budgetLimit) * 100))
                                 : 0;
                           const isOver = spent > budgetLimit;
                           const isNear = percent >= 80 && !isOver;

                           return (
                              <div
                                 key={catName}
                                 className="p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/40"
                              >
                                 <div className="flex items-center justify-between text-xs mb-1.5">
                                    <div className="flex items-center gap-1.5 font-medium">
                                       {isOver ? (
                                          <AlertCircle size={14} className="text-rose-500" />
                                       ) : (
                                          <CheckCircle2 size={14} className="text-emerald-500" />
                                       )}
                                       <span>{catName}</span>
                                    </div>
                                    <div className="text-[11px] font-mono">
                                       <span
                                          className={
                                             isOver
                                                ? 'text-rose-600 dark:text-rose-400 font-bold'
                                                : isNear
                                                ? 'text-amber-600 dark:text-amber-400 font-medium'
                                                : 'text-slate-700 dark:text-zinc-300'
                                          }
                                       >
                                          {currency}
                                          {spent.toLocaleString()}
                                       </span>
                                       <span className="text-slate-400 dark:text-zinc-500">
                                          {' '}
                                          / {currency}
                                          {budgetLimit.toLocaleString()}
                                       </span>
                                    </div>
                                 </div>

                                 {/* Progress bar */}
                                 <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                                    <div
                                       style={{ width: `${percent}%` }}
                                       className={`h-full rounded-full transition-all duration-300
                                          ${
                                             isOver
                                                ? 'bg-rose-500'
                                                : isNear
                                                ? 'bg-amber-500'
                                                : 'bg-emerald-500'
                                          }`}
                                    />
                                 </div>
                              </div>
                           );
                        })
                  )}
               </div>
            )}
         </div>

         {/* Bottom Health Indicator */}
         <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-zinc-400">Monthly Cycle Status</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
               Active & Tracking
            </span>
         </div>
      </div>
   );
};

export default ExpenseCard;
