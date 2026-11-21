import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
   loadSampleData,
   clearAllData,
   importTransactions,
} from '../../app/features/expenseSlice';
import {
   FileSpreadsheet,
   FileJson,
   Upload,
   RotateCcw,
   Trash2,
   ShieldAlert,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useDarkMode } from '../DarkModeContext';

const DataSettings = () => {
   const { isDarkMode } = useDarkMode();
   const dispatch = useDispatch();

   const transactions = useSelector(
      (state) => state.expense.addExpense.expenseData || []
   );

   const handleExportCSV = () => {
      if (transactions.length === 0) {
         toast.error('No transactions to export');
         return;
      }
      const headers = ['ID', 'Type', 'Title', 'Category', 'Amount', 'Date', 'Month', 'Payment Method', 'Notes'];
      const rows = transactions.map((t) => [
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
      link.setAttribute('download', `tracksy_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CSV export generated successfully');
   };

   const handleExportJSON = () => {
      if (transactions.length === 0) {
         toast.error('No transactions to export');
         return;
      }
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `tracksy_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('JSON backup downloaded');
   };

   const handleImportJSON = (e) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onload = (event) => {
            try {
               const parsed = JSON.parse(event.target.result);
               if (Array.isArray(parsed)) {
                  dispatch(importTransactions(parsed));
                  toast.success(`Imported ${parsed.length} transactions successfully`);
               } else {
                  toast.error('Invalid JSON format: Expected transaction array');
               }
            } catch (err) {
               toast.error('Failed to parse JSON file');
            }
         };
         reader.readAsText(file);
      }
   };

   const handleLoadSample = () => {
      if (window.confirm('Populate fresh sample transactions?')) {
         dispatch(loadSampleData());
         toast.success('Sample transactions populated!');
      }
   };

   const handleClearAll = () => {
      if (window.confirm('Clear all transaction records from local storage? This cannot be undone.')) {
         dispatch(clearAllData());
         toast.warning('All transaction records wiped');
      }
   };

   return (
      <div className="space-y-6 max-w-2xl">
         <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
               Data Vault & Backups
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
               Export your records for spreadsheets, restore backups, or reset your local store.
            </p>
         </div>

         {/* Export & Import Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
               className={`p-4 rounded-2xl border flex flex-col justify-between
                  ${
                     isDarkMode
                        ? 'bg-zinc-900/60 border-zinc-800'
                        : 'bg-white border-slate-200 shadow-xs'
                  }`}
            >
               <div>
                  <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-slate-900 dark:text-zinc-100">
                     <FileSpreadsheet size={18} className="text-emerald-500" />
                     <span>Spreadsheet Export (CSV)</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                     Download standard CSV format compatible with Microsoft Excel, Google Sheets, or Apple Numbers.
                  </p>
               </div>
               <button
                  onClick={handleExportCSV}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
               >
                  Download CSV
               </button>
            </div>

            <div
               className={`p-4 rounded-2xl border flex flex-col justify-between
                  ${
                     isDarkMode
                        ? 'bg-zinc-900/60 border-zinc-800'
                        : 'bg-white border-slate-200 shadow-xs'
                  }`}
            >
               <div>
                  <div className="flex items-center gap-2 mb-2 font-semibold text-sm text-slate-900 dark:text-zinc-100">
                     <FileJson size={18} className="text-blue-500" />
                     <span>JSON Full Backup</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
                     Complete lossless backup containing all transaction IDs, categories, dates, and metadata.
                  </p>
               </div>
               <button
                  onClick={handleExportJSON}
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
               >
                  Download JSON
               </button>
            </div>
         </div>

         {/* Import Box */}
         <div
            className={`p-4 rounded-2xl border flex items-center justify-between
               ${
                  isDarkMode
                     ? 'bg-zinc-900/40 border-zinc-800'
                     : 'bg-white border-slate-200 shadow-xs'
               }`}
         >
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                  <Upload size={18} />
               </div>
               <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                     Restore / Import Backup
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                     Load a previously exported Tracksy JSON backup file
                  </div>
               </div>
            </div>

            <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
               <span>Select File</span>
               <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportJSON}
               />
            </label>
         </div>

         {/* Danger Zone */}
         <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-500">
               <ShieldAlert size={14} />
               <span>Reset & Danger Zone</span>
            </div>

            <div className="flex flex-wrap gap-3">
               <button
                  onClick={handleLoadSample}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors
                     ${
                        isDarkMode
                           ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                           : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                     }`}
               >
                  <RotateCcw size={14} className="text-indigo-500" />
                  <span>Restore Sample Transactions</span>
               </button>

               <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
               >
                  <Trash2 size={14} />
                  <span>Wipe All Data</span>
               </button>
            </div>
         </div>
      </div>
   );
};

export default DataSettings;
