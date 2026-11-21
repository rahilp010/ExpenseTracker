import React, { useEffect, useState } from 'react';
import {
   X,
   Plus,
   ArrowDownRight,
   ArrowUpRight,
   Calendar,
   Tag,
   FileText,
   CreditCard,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
   addExpense,
   updateExpense,
   setIsUpdateExpense,
   setUpdateExpense,
} from '../../app/features/expenseSlice';
import {
   expenseCategories,
   incomeCategories,
   paymentMethods,
   months,
} from '../../data';
import { useDarkMode } from '../DarkModeContext';

const Model = ({ setShowModal, currentMonth, currency = '₹' }) => {
   const { isDarkMode } = useDarkMode();
   const dispatch = useDispatch();

   const isUpdate = useSelector(
      (state) => state.expense.addExpense.isUpdateExpense
   );
   const updateTarget = useSelector(
      (state) => state.expense.addExpense.updateExpense
   );

   const [type, setType] = useState('expense'); // 'expense' | 'income'
   const [title, setTitle] = useState('');
   const [amount, setAmount] = useState('');
   const [category, setCategory] = useState(expenseCategories[0].name);
   const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
   const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
   const [notes, setNotes] = useState('');

   // Populate fields if editing
   useEffect(() => {
      if (isUpdate && updateTarget) {
         setType(updateTarget.type || 'expense');
         setTitle(updateTarget.title || updateTarget.category || '');
         setAmount(String(updateTarget.price || ''));
         setCategory(updateTarget.category || expenseCategories[0].name);
         setPaymentMethod(updateTarget.paymentMethod || paymentMethods[0]);
         setDate(updateTarget.date || new Date().toISOString().split('T')[0]);
         setNotes(updateTarget.notes || '');
      }
   }, [isUpdate, updateTarget]);

   const activeCategoryList = type === 'income' ? incomeCategories : expenseCategories;

   // When switching type, reset category if not in active list
   const handleTypeSwitch = (newType) => {
      setType(newType);
      const list = newType === 'income' ? incomeCategories : expenseCategories;
      setCategory(list[0].name);
   };

   const handleClose = () => {
      dispatch(setIsUpdateExpense(false));
      dispatch(setUpdateExpense(null));
      setShowModal(false);
   };

   const handleSubmit = (e) => {
      e.preventDefault();

      const parsedAmount = parseFloat(amount);
      if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
         toast.error('Please enter a valid amount');
         return;
      }

      if (!title.trim()) {
         toast.error('Please enter a description or merchant name');
         return;
      }

      const selectedCatObj = activeCategoryList.find((c) => c.name === category);
      const color = selectedCatObj ? selectedCatObj.color : '#64748b';

      const txDate = new Date(date);
      const monthOfTx = months[txDate.getMonth()] || currentMonth;

      const payload = {
         id: isUpdate && updateTarget?.id ? updateTarget.id : `tx-${Date.now()}`,
         type,
         title: title.trim(),
         category,
         price: parsedAmount,
         date,
         monthOfExpense: monthOfTx,
         paymentMethod,
         notes: notes.trim(),
         color,
      };

      if (isUpdate) {
         dispatch(updateExpense(payload));
         toast.success('Transaction updated successfully');
      } else {
         dispatch(addExpense(payload));
         toast.success('Transaction recorded successfully');
      }

      handleClose();
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
         <div
            className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl transition-all
               ${
                  isDarkMode
                     ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                     : 'bg-white border-slate-200 text-slate-800'
               }`}
         >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
               <div>
                  <h3 className="text-lg font-bold tracking-tight">
                     {isUpdate ? 'Edit Transaction' : 'Record Transaction'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                     Keep your financial records accurate and up to date
                  </p>
               </div>

               <button
                  onClick={handleClose}
                  className={`p-1.5 rounded-lg border transition-colors
                     ${
                        isDarkMode
                           ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                           : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                     }`}
                  aria-label="Close modal"
               >
                  <X size={18} />
               </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
               {/* Type Selector (Expense vs Income) */}
               <div
                  className={`grid grid-cols-2 p-1 rounded-xl border
                     ${
                        isDarkMode
                           ? 'bg-zinc-950 border-zinc-800'
                           : 'bg-slate-100 border-slate-200'
                     }`}
               >
                  <button
                     type="button"
                     onClick={() => handleTypeSwitch('expense')}
                     className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all
                        ${
                           type === 'expense'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                        }`}
                  >
                     <ArrowDownRight size={16} strokeWidth={2.4} />
                     <span>Expense (Outflow)</span>
                  </button>

                  <button
                     type="button"
                     onClick={() => handleTypeSwitch('income')}
                     className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all
                        ${
                           type === 'income'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                        }`}
                  >
                     <ArrowUpRight size={16} strokeWidth={2.4} />
                     <span>Income (Inflow)</span>
                  </button>
               </div>

               {/* Amount Input */}
               <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                     Amount ({currency})
                  </label>
                  <div className="relative">
                     <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 dark:text-zinc-500">
                        {currency}
                     </span>
                     <input
                        type="number"
                        step="any"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={`w-full pl-8 pr-4 py-2.5 rounded-xl text-lg font-bold font-mono border outline-none transition-all
                           ${
                              isDarkMode
                                 ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500'
                                 : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:bg-white'
                           }`}
                        autoFocus
                     />
                  </div>
               </div>

               {/* Title / Description */}
               <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5">
                     Description / Payee
                  </label>
                  <input
                     type="text"
                     placeholder="e.g. Grocery store, Client deposit, Electric bill"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none transition-all
                        ${
                           isDarkMode
                              ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500'
                              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500 focus:bg-white'
                        }`}
                  />
               </div>

               {/* Category & Payment Method 2-Col Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                     <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                        <Tag size={12} />
                        <span>Category</span>
                     </label>
                     <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none cursor-pointer
                           ${
                              isDarkMode
                                 ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
                                 : 'bg-slate-50 border-slate-200 text-slate-800'
                           }`}
                     >
                        {activeCategoryList.map((cat) => (
                           <option key={cat.id || cat.name} value={cat.name}>
                              {cat.name}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                        <CreditCard size={12} />
                        <span>Payment Method</span>
                     </label>
                     <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none cursor-pointer
                           ${
                              isDarkMode
                                 ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
                                 : 'bg-slate-50 border-slate-200 text-slate-800'
                           }`}
                     >
                        {paymentMethods.map((m) => (
                           <option key={m} value={m}>
                              {m}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>

               {/* Date & Optional Notes */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                     <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Date</span>
                     </label>
                     <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none cursor-pointer
                           ${
                              isDarkMode
                                 ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
                                 : 'bg-slate-50 border-slate-200 text-slate-800'
                           }`}
                     />
                  </div>

                  <div>
                     <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1">
                        <FileText size={12} />
                        <span>Notes (Optional)</span>
                     </label>
                     <input
                        type="text"
                        placeholder="Tag, invoice #, or note..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none
                           ${
                              isDarkMode
                                 ? 'bg-zinc-950 border-zinc-800 text-zinc-200'
                                 : 'bg-slate-50 border-slate-200 text-slate-800'
                           }`}
                     />
                  </div>
               </div>

               {/* Submit CTA */}
               <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                     type="button"
                     onClick={handleClose}
                     className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors
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
                     className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-600/30"
                  >
                     {isUpdate ? 'Save Changes' : 'Confirm & Save'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default Model;
