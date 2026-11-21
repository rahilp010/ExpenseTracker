import React from 'react';
import {
   TrendingUp,
   TrendingDown,
   Wallet,
   PiggyBank,
   Pencil,
   ArrowUpRight,
   ArrowDownRight,
} from 'lucide-react';
import { useDarkMode } from '../DarkModeContext';

const StatCards = ({
   netBalance,
   totalIncome,
   totalExpense,
   baseBalance,
   onEditBalance,
   currency = '₹',
}) => {
   const { isDarkMode } = useDarkMode();

   // Savings calculations
   const savingsRate =
      totalIncome > 0
         ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
         : 0;

   // Days in month calculation for daily average
   const today = new Date();
   const daysPassed = Math.max(1, today.getDate());
   const dailyAverage = Math.round(totalExpense / daysPassed);

   const cards = [
      {
         title: 'Net Available Balance',
         amount: netBalance,
         subtitle: `Target base: ${currency}${baseBalance.toLocaleString()}`,
         icon: Wallet,
         iconColor: 'text-indigo-500 bg-indigo-500/10',
         badge: netBalance >= 0 ? 'Surplus' : 'Deficit',
         badgeColor:
            netBalance >= 0
               ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60'
               : 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/60',
         showEdit: true,
      },
      {
         title: 'Total Monthly Income',
         amount: totalIncome,
         subtitle: 'All earnings this cycle',
         icon: TrendingUp,
         iconColor: 'text-emerald-500 bg-emerald-500/10',
         trendIcon: ArrowUpRight,
         trendText: 'Cash Inflow',
         trendColor: 'text-emerald-600 dark:text-emerald-400',
      },
      {
         title: 'Total Monthly Expenses',
         amount: totalExpense,
         subtitle: `Avg. ${currency}${dailyAverage.toLocaleString()} / day`,
         icon: TrendingDown,
         iconColor: 'text-rose-500 bg-rose-500/10',
         trendIcon: ArrowDownRight,
         trendText: 'Outflow',
         trendColor: 'text-rose-600 dark:text-rose-400',
      },
      {
         title: 'Monthly Savings Rate',
         customValue: `${savingsRate}%`,
         subtitle: `${savingsRate >= 20 ? 'Target achieved' : 'Under 20% benchmark'}`,
         icon: PiggyBank,
         iconColor: 'text-amber-500 bg-amber-500/10',
         badge: savingsRate >= 20 ? 'Optimal' : 'Needs Focus',
         badgeColor:
            savingsRate >= 20
               ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60'
               : 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/60',
      },
   ];

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
               <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden group
                     ${
                        isDarkMode
                           ? 'bg-zinc-900/70 border-zinc-800/80 hover:border-zinc-700'
                           : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
                     }`}
               >
                  <div className="flex items-center justify-between mb-3">
                     <span
                        className={`text-xs font-semibold uppercase tracking-wider
                           ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}
                     >
                        {card.title}
                     </span>
                     <div className={`p-2 rounded-xl ${card.iconColor}`}>
                        <Icon size={18} strokeWidth={2.2} />
                     </div>
                  </div>

                  <div className="flex items-baseline justify-between mb-1.5">
                     <div className="flex items-baseline gap-1">
                        <span
                           className={`text-2xl font-bold tracking-tight
                              ${isDarkMode ? 'text-zinc-50' : 'text-slate-900'}`}
                        >
                           {card.customValue || `${currency}${card.amount.toLocaleString()}`}
                        </span>
                     </div>

                     {card.badge && (
                        <span
                           className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${card.badgeColor}`}
                        >
                           {card.badge}
                        </span>
                     )}
                     {card.trendText && (
                        <div
                           className={`flex items-center gap-0.5 text-xs font-medium ${card.trendColor}`}
                        >
                           <card.trendIcon size={14} />
                           <span>{card.trendText}</span>
                        </div>
                     )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                     <span className={isDarkMode ? 'text-zinc-400' : 'text-slate-500'}>
                        {card.subtitle}
                     </span>

                     {card.showEdit && onEditBalance && (
                        <button
                           onClick={onEditBalance}
                           className={`flex items-center gap-1 text-[11px] font-medium transition-colors
                              ${
                                 isDarkMode
                                    ? 'text-indigo-400 hover:text-indigo-300'
                                    : 'text-indigo-600 hover:text-indigo-700'
                              }`}
                        >
                           <Pencil size={12} />
                           <span>Adjust Base</span>
                        </button>
                     )}
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default StatCards;
