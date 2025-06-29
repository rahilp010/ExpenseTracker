import React, { useEffect, useMemo, useState } from 'react';
import { CircleX, InfoIcon } from 'lucide-react';
import Loader from '../../Animations/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { months } from '../../data';
import { toast } from 'react-toastify';
import {
   loadExpense,
   selectMonthlyBalance,
   setBalanceByMonth,
} from '../../app/features/expenseSlice';

const BalanceModal = ({ setShowBalanceModal }) => {
   const dispatch = useDispatch();
   const currentDate = new Date();
   const currentMonth = useMemo(
      () => currentDate.toLocaleString('default', { month: 'long' }),
      []
   );
   const lastMonth = useMemo(() => months[currentDate.getMonth() - 1], []);
   const [isLoading, setIsLoading] = useState(false);

   const storedBalances =
      JSON.parse(localStorage.getItem('balanceByMonth')) || {};
   const lastMonthBalance = storedBalances[lastMonth] || 0;

   const balanceByMonth = useSelector((state) =>
      selectMonthlyBalance(state, currentMonth)
   );
   const [balance, setBalance] = useState(balanceByMonth || 0);
   const [showTooltip, setShowTooltip] = useState(false);

   useEffect(() => {
      dispatch(loadExpense());
      const storedBalances =
         JSON.parse(localStorage.getItem('balanceByMonth')) || {};
      if (!storedBalances[currentMonth]) {
         dispatch(
            setBalanceByMonth({ month: currentMonth, balanceByMonth: 20000 })
         );
      }
   }, [dispatch, currentMonth]);

   useEffect(() => {
      setBalance(balanceByMonth);
   }, [balanceByMonth]);

   const handleInputChanges = (e) => {
      const updatedBalance = e.target.value;
      setBalance(updatedBalance);
      dispatch(
         setBalanceByMonth({
            month: currentMonth,
            balanceByMonth: parseFloat(updatedBalance),
         })
      );
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!balance || isNaN(balance) || Number(balance) <= 0) {
         toast.error('Please enter a valid balance');
         return;
      }
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
         setIsLoading(false);
         setShowBalanceModal(false);
         toast.success('Balance updated successfully');
      }, 1000);
   };

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
         <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl animate-fadeIn scale-in">
            {isLoading && (
               <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl z-20">
                  <Loader />
               </div>
            )}

            <div
               className="absolute top-5.5 right-14 cursor-pointer"
               onMouseEnter={() => setShowTooltip(true)}
               onMouseLeave={() => setShowTooltip(false)}></div>
            <InfoIcon
               className="absolute top-4 right-4 cursor-pointer text-red-400 hover:text-red-600"
               size={25}
               onMouseEnter={() => setShowTooltip(true)}
               onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
               <div className="absolute top-12 text-center -right-4 w-40 text-xs bg-white text-gray-700 border border-gray-300 shadow-md p-2 rounded-md z-50 transition-all duration-300 ease-in-out">
                  Last month balance is{' '}
                  <span className="font-bold text-lg text-red-500">
                     {lastMonthBalance}
                  </span>
               </div>
            )}

            <div className="text-center space-y-4 mt-4">
               <h2 className="text-xl flex items-center justify-center gap-2 font-semibold text-gray-700">
                  Monthly Balance Update
               </h2>
               <p className="text-gray-500 text-sm">
                  Enter your balance for the month of <br />
                  <span className="font-bold text-lg text-[#566dff]">
                     {currentMonth}
                  </span>
               </p>
               <input
                  type="number"
                  value={balance}
                  onChange={handleInputChanges}
                  placeholder="Enter Balance"
                  className="w-full text-center font-semibold px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8896f3] transition"
               />
               <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#566dff] to-[#8896f3] text-white rounded-xl hover:opacity-90 transition font-medium cursor-pointer">
                  Update Balance
               </button>
            </div>
         </form>
      </div>
   );
};

export default BalanceModal;
