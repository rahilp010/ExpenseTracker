import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
   deleteExpense,
   loadSampleData,
   clearAllData,
   setUpdateExpense,
   setIsUpdateExpense,
} from '../../app/features/expenseSlice';
import {
   Search,
   Trash2,
   Edit3,
   Download,
   Plus,
   Filter,
   ArrowDownRight,
   ArrowUpRight,
   FileSpreadsheet,
   FileJson,
   RotateCcw,
   Calendar,
   CreditCard,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useDarkMode } from '../DarkModeContext';

const Report = ({ onOpenAddModal, currency = '₹' }) => {
   const { isDarkMode } = useDarkMode();
   const dispatch = useDispatch();

   const rawTransactions = useSelector(
      (state) => state.expense.addExpense.expenseData || []
   );

   const [searchQuery, setSearchQuery] = useState('');
   const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'expense' | 'income'
   const [categoryFilter, setCategoryFilter] = useState('all');
   const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'this_month' | 'this_year'
   const [sortBy, setSortBy] = useState('date_desc'); // 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'
   const [isActionsOpen, setIsActionsOpen] = useState(false);

   // Extract available unique categories from transactions
   const availableCategories = useMemo(() => {
      const set = new Set();
      rawTransactions.forEach((t) => {
         if (t.category) set.add(t.category);
      });
      return Array.from(set);
   }, [rawTransactions]);

   // Date helper functions
   const isToday = (dateString) => {
      if (!dateString) return false;
      const today = new Date();
      const txDate = new Date(dateString);
      return (
         txDate.getDate() === today.getDate() &&
         txDate.getMonth() === today.getMonth() &&
         txDate.getFullYear() === today.getFullYear()
      );
   };

   const isThisMonth = (dateString) => {
      if (!dateString) return false;
      const today = new Date();
      const txDate = new Date(dateString);
      return (
         txDate.getMonth() === today.getMonth() &&
         txDate.getFullYear() === today.getFullYear()
      );
   };

   const isThisYear = (dateString) => {
      if (!dateString) return false;
      const today = new Date();
      const txDate = new Date(dateString);
      return txDate.getFullYear() === today.getFullYear();
   };

   // Filter and sort transactions
   const filteredTransactions = useMemo(() => {
      let list = [...rawTransactions];

      // Search query
      if (searchQuery.trim()) {
         const q = searchQuery.toLowerCase().trim();
         list = list.filter((t) => {
            const title = (t.title || '').toLowerCase();
            const cat = (t.category || '').toLowerCase();
            const notes = (t.notes || '').toLowerCase();
            const method = (t.paymentMethod || '').toLowerCase();
            const price = String(t.price || '');
            return (
               title.includes(q) ||
               cat.includes(q) ||
               notes.includes(q) ||
               method.includes(q) ||
               price.includes(q)
            );
         });
      }

      // Type filter
      if (typeFilter !== 'all') {
         list = list.filter((t) => {
            const isIncome = t.type === 'income';
            return typeFilter === 'income' ? isIncome : !isIncome;
         });
      }

      // Category filter
      if (categoryFilter !== 'all') {
         list = list.filter((t) => t.category === categoryFilter);
      }

      // Date range filter
      if (dateFilter !== 'all') {
         list = list.filter((t) => {
            if (dateFilter === 'today') return isToday(t.date);
            if (dateFilter === 'this_month') return isThisMonth(t.date);
            if (dateFilter === 'this_year') return isThisYear(t.date);
            return true;
         });
      }

      // Sorting
      list.sort((a, b) => {
         const priceA = parseFloat(a.price) || 0;
         const priceB = parseFloat(b.price) || 0;
         const dateA = new Date(a.date || 0).getTime();
         const dateB = new Date(b.date || 0).getTime();

         switch (sortBy) {
            case 'date_asc':
               return dateA - dateB;
            case 'amount_desc':
               return priceB - priceA;
            case 'amount_asc':
               return priceA - priceB;
            case 'date_desc':
            default:
               return dateB - dateA;
         }
      });

      return list;
   }, [rawTransactions, searchQuery, typeFilter, categoryFilter, dateFilter, sortBy]);

   // Handle Edit
   const handleEdit = (tx) => {
      dispatch(setUpdateExpense(tx));
      dispatch(setIsUpdateExpense(true));
      if (onOpenAddModal) onOpenAddModal();
   };

   // Handle Delete with Undo Toast
   const handleDelete = (id, title) => {
      dispatch(deleteExpense(id));
      toast.info(`Removed "${title || 'Transaction'}"`, {
         autoClose: 2500,
      });
   };

   // Export to CSV
   const handleExportCSV = () => {
      if (rawTransactions.length === 0) {
         toast.error('No transactions available to export');
         return;
      }
      const headers = ['ID', 'Type', 'Title', 'Category', 'Amount', 'Date', 'Month', 'Payment Method', 'Notes'];
      const rows = rawTransactions.map((t) => [
         `"${t.id || ''}"`,
         `"${t.type || 'expense'}"`,
         `"${(t.title || t.category || '').replace(/"/g, '""')}"`,
         `"${(t.category || '').replace(/"/g, '""')}"`,
         t.price || 0,
         `"${t.date || ''}"`,
         `"${t.monthOfExpense || ''}"`,
         `"${t.paymentMethod || ''}"`,
         `"${(t.notes || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `tracksy_transactions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CSV export generated successfully');
   };

   // Export to JSON
   const handleExportJSON = () => {
      if (rawTransactions.length === 0) {
         toast.error('No transactions available to export');
         return;
      }
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(rawTransactions, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `tracksy_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('JSON backup downloaded');
   };

   // Load Sample Data
   const handleLoadSample = () => {
      if (window.confirm('Populate realistic sample transactions? Existing entries will be refreshed.')) {
         dispatch(loadSampleData());
         toast.success('Sample transactions populated!');
      }
   };

   // Clear All Data
   const handleClearAll = () => {
      if (window.confirm('Are you sure you want to clear ALL transactions? This cannot be undone.')) {
         dispatch(clearAllData());
         toast.warning('All transactions cleared');
      }
   };

   return (
      <div className="space-y-4">
         {/* Top Header & Actions Bar */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
               <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                  Transactions & Ledger
               </h2>
               <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Showing {filteredTransactions.length} of {rawTransactions.length} recorded entries
               </p>
            </div>

            <div className="flex items-center gap-2">
               {/* Export Menu */}
               <div className="relative">
                  <button
                     onClick={() => setIsActionsOpen(!isActionsOpen)}
                     className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors
                        ${
                           isDarkMode
                              ? 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'
                        }`}
                  >
                     <Download size={14} />
                     <span>Data Tools</span>
                  </button>

                  {isActionsOpen && (
                     <div
                        className={`absolute right-0 mt-1.5 w-48 rounded-xl border p-1 shadow-xl z-20 text-xs
                           ${
                              isDarkMode
                                 ? 'bg-zinc-900 border-zinc-800 text-zinc-200'
                                 : 'bg-white border-slate-200 text-slate-700'
                           }`}
                     >
                        <button
                           onClick={() => {
                              handleExportCSV();
                              setIsActionsOpen(false);
                           }}
                           className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors"
                        >
                           <FileSpreadsheet size={15} className="text-emerald-500" />
                           <span>Export to CSV</span>
                        </button>
                        <button
                           onClick={() => {
                              handleExportJSON();
                              setIsActionsOpen(false);
                           }}
                           className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors"
                        >
                           <FileJson size={15} className="text-blue-500" />
                           <span>Export to JSON</span>
                        </button>
                        <div className="my-1 border-t border-slate-100 dark:border-zinc-800" />
                        <button
                           onClick={() => {
                              handleLoadSample();
                              setIsActionsOpen(false);
                           }}
                           className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-left transition-colors"
                        >
                           <RotateCcw size={15} className="text-indigo-500" />
                           <span>Reset Sample Data</span>
                        </button>
                        <button
                           onClick={() => {
                              handleClearAll();
                              setIsActionsOpen(false);
                           }}
                           className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-left transition-colors"
                        >
                           <Trash2 size={15} />
                           <span>Clear All Records</span>
                        </button>
                     </div>
                  )}
               </div>

               {onOpenAddModal && (
                  <button
                     onClick={onOpenAddModal}
                     className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-600/30"
                  >
                     <Plus size={15} strokeWidth={2.4} />
                     <span>Add Entry</span>
                  </button>
               )}
            </div>
         </div>

         {/* Filters & Search Control Row */}
         <div
            className={`p-3 rounded-2xl border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3
               ${
                  isDarkMode
                     ? 'bg-zinc-900/60 border-zinc-800/80'
                     : 'bg-white border-slate-200/80 shadow-xs'
               }`}
         >
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
               <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500"
               />
               <input
                  type="text"
                  placeholder="Search description, category, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-none transition-all
                     ${
                        isDarkMode
                           ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500'
                           : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:bg-white'
                     }`}
               />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
               {/* Type Filter */}
               <div
                  className={`flex p-0.5 rounded-xl border text-xs
                     ${
                        isDarkMode
                           ? 'bg-zinc-950 border-zinc-800 text-zinc-400'
                           : 'bg-slate-100 border-slate-200 text-slate-600'
                     }`}
               >
                  {['all', 'expense', 'income'].map((t) => (
                     <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`px-2.5 py-1 rounded-lg capitalize transition-all text-xs
                           ${
                              typeFilter === t
                                 ? isDarkMode
                                    ? 'bg-zinc-800 text-white font-medium shadow-xs'
                                    : 'bg-white text-slate-900 font-semibold shadow-xs'
                                 : 'hover:text-slate-900 dark:hover:text-zinc-200'
                           }`}
                     >
                        {t}
                     </button>
                  ))}
               </div>

               {/* Category Filter */}
               <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs border outline-none cursor-pointer
                     ${
                        isDarkMode
                           ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                           : 'bg-slate-50 border-slate-200 text-slate-700'
                     }`}
               >
                  <option value="all">All Categories</option>
                  {availableCategories.map((c) => (
                     <option key={c} value={c}>
                        {c}
                     </option>
                  ))}
               </select>

               {/* Date Period Filter */}
               <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs border outline-none cursor-pointer
                     ${
                        isDarkMode
                           ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                           : 'bg-slate-50 border-slate-200 text-slate-700'
                     }`}
               >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="this_month">This Month</option>
                  <option value="this_year">This Year</option>
               </select>

               {/* Sort Order */}
               <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs border outline-none cursor-pointer
                     ${
                        isDarkMode
                           ? 'bg-zinc-950 border-zinc-800 text-zinc-300'
                           : 'bg-slate-50 border-slate-200 text-slate-700'
                     }`}
               >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="amount_desc">Highest Amount</option>
                  <option value="amount_asc">Lowest Amount</option>
               </select>
            </div>
         </div>

         {/* Transactions Table / List View */}
         <div
            className={`rounded-2xl border overflow-hidden transition-all
               ${
                  isDarkMode
                     ? 'bg-zinc-900/70 border-zinc-800/80'
                     : 'bg-white border-slate-200/80 shadow-sm'
               }`}
         >
            {filteredTransactions.length === 0 ? (
               <div className="py-16 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-slate-400 dark:text-zinc-500">
                     <Filter size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                     No transactions found
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                     {searchQuery || typeFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all'
                        ? 'Try loosening your search terms or resetting filters.'
                        : 'Start tracking by recording your first income or expense entry.'}
                  </p>
                  {onOpenAddModal && (
                     <button
                        onClick={onOpenAddModal}
                        className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                     >
                        Add Transaction
                     </button>
                  )}
               </div>
            ) : (
               <div className="overflow-x-auto customScrollbar">
                  <table className="w-full text-left text-xs border-collapse">
                     <thead>
                        <tr
                           className={`border-b text-[11px] font-semibold uppercase tracking-wider
                              ${
                                 isDarkMode
                                    ? 'border-zinc-800 bg-zinc-950/40 text-zinc-400'
                                    : 'border-slate-100 bg-slate-50/70 text-slate-500'
                              }`}
                        >
                           <th className="py-3 px-4">Transaction</th>
                           <th className="py-3 px-3">Category</th>
                           <th className="py-3 px-3">Method</th>
                           <th className="py-3 px-3">Date</th>
                           <th className="py-3 px-4 text-right">Amount</th>
                           <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                        {filteredTransactions.map((tx) => {
                           const isIncome = tx.type === 'income';
                           return (
                              <tr
                                 key={tx.id}
                                 className="hover:bg-slate-50/80 dark:hover:bg-zinc-850/50 transition-colors group"
                              >
                                 {/* Title & Notes */}
                                 <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                       <div
                                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0
                                             ${
                                                isIncome
                                                   ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                   : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                             }`}
                                       >
                                          {isIncome ? (
                                             <ArrowUpRight size={16} strokeWidth={2.2} />
                                          ) : (
                                             <ArrowDownRight size={16} strokeWidth={2.2} />
                                          )}
                                       </div>
                                       <div className="min-w-0">
                                          <div className="font-semibold text-slate-900 dark:text-zinc-100 truncate">
                                             {tx.title || tx.category}
                                          </div>
                                          {tx.notes && (
                                             <div className="text-[11px] text-slate-400 dark:text-zinc-500 truncate max-w-xs">
                                                {tx.notes}
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 </td>

                                 {/* Category */}
                                 <td className="py-3 px-3 whitespace-nowrap">
                                    <span
                                       style={{
                                          borderColor: `${tx.color || '#64748b'}40`,
                                          backgroundColor: `${tx.color || '#64748b'}15`,
                                          color: tx.color || '#64748b',
                                       }}
                                       className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                                    >
                                       <span
                                          style={{ backgroundColor: tx.color || '#64748b' }}
                                          className="w-1.5 h-1.5 rounded-full"
                                       />
                                       {tx.category || 'Other'}
                                    </span>
                                 </td>

                                 {/* Payment Method */}
                                 <td className="py-3 px-3 whitespace-nowrap">
                                    <span
                                       className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md
                                          ${
                                             isDarkMode
                                                ? 'bg-zinc-800/80 text-zinc-300'
                                                : 'bg-slate-100 text-slate-600'
                                          }`}
                                    >
                                       <CreditCard size={12} />
                                       <span>{tx.paymentMethod || 'UPI'}</span>
                                    </span>
                                 </td>

                                 {/* Date */}
                                 <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-zinc-400 text-[11px]">
                                    <div className="flex items-center gap-1">
                                       <Calendar size={12} />
                                       <span>{tx.date || 'Recent'}</span>
                                    </div>
                                 </td>

                                 {/* Amount */}
                                 <td className="py-3 px-4 text-right whitespace-nowrap">
                                    <span
                                       className={`font-semibold font-mono text-sm
                                          ${
                                             isIncome
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-rose-600 dark:text-rose-400'
                                          }`}
                                    >
                                       {isIncome ? '+' : '-'}
                                       {currency}
                                       {Number(tx.price || 0).toLocaleString()}
                                    </span>
                                 </td>

                                 {/* Actions */}
                                 <td className="py-3 px-3 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                       <button
                                          onClick={() => handleEdit(tx)}
                                          className={`p-1.5 rounded-lg transition-colors
                                             ${
                                                isDarkMode
                                                   ? 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100'
                                                   : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                                             }`}
                                          title="Edit transaction"
                                       >
                                          <Edit3 size={14} />
                                       </button>
                                       <button
                                          onClick={() => handleDelete(tx.id, tx.title)}
                                          className={`p-1.5 rounded-lg transition-colors text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40`}
                                          title="Delete transaction"
                                       >
                                          <Trash2 size={14} />
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
            )}
         </div>
      </div>
   );
};

export default Report;
