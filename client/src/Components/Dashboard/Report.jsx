import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteExpense } from '../../app/features/expenseSlice';
import { Funnel, Search, Trash } from 'lucide-react';
import { PiInfoThin } from 'react-icons/pi';

const Report = () => {
   const expenses = useSelector(
      (state) => state.expense.addExpense.expenseData
   );
   const dispatch = useDispatch();
   const [isFilterOpen, setIsFilterOpen] = useState(false);
   const [sort, setSort] = useState('This Month');

   const [searchQuery, setSearchQuery] = useState('');

   const isToday = (dateString) => {
      const today = new Date();
      const expenseDate = new Date(dateString);

      return (
         expenseDate.getUTCDate() === today.getDate() &&
         expenseDate.getMonth() === today.getMonth() &&
         expenseDate.getFullYear() === today.getFullYear()
      );
   };

   const isThisMonth = (dateString) => {
      const today = new Date();
      const expenseDate = new Date(dateString);

      return (
         expenseDate.getMonth() === today.getMonth() &&
         expenseDate.getFullYear() === today.getFullYear()
      );
   };

   const isThisYear = (dateString) => {
      const today = new Date();
      const expenseDate = new Date(dateString);
      return expenseDate.getFullYear() === today.getFullYear();
   };

   const filteredData = useMemo(() => {
      const query = searchQuery.toLowerCase();
      let result = expenses.filter((data) => {
         return (
            data.id.toString().includes(query) ||
            data.date?.toLowerCase().includes(query) ||
            data.category?.toLowerCase().includes(query) ||
            data.price?.toString().includes(query)
         );
      });
      if (sort) {
         result = result.filter((item) => {
            if (sort === 'Today') return isToday(item.date);
            if (sort === 'This Month') return isThisMonth(item.date);
            if (sort === 'This Year') return isThisYear(item.date);
            return true;
         });
      }
      return result;
   }, [expenses, searchQuery, sort]);

   return (
      <div className="p-6">
         {/* Title */}
         <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📊 Expense Report
         </h2>
         {isFilterOpen && (
            <div className="w-full transition-all duration-300 bg-gray-200/40 p-3 rounded-xl fade-in">
               <div className="flex flex-col w-40 border-2 border-b-4 indent-2 border-[#d4d9fb] outline-none focus:ring-2 focus:ring-[#8896f3] focus:border-b-4 rounded-2xl p-2 gap-2 bg-white">
                  <select
                     name="sort"
                     id="sort"
                     value={sort}
                     onChange={(e) => setSort(e.target.value)}
                     className="flex border-none outline-none cursor-pointer">
                     <option value="">All</option>
                     <option value="Today">Today</option>
                     <option value="This Month">This Month</option>
                     <option value="This Year">This Year</option>
                  </select>
               </div>
            </div>
         )}
         <div className="flex justify-end items-center gap-3 my-3">
            <div className="relative w-64">
               <input
                  type="text"
                  value={searchQuery?.toLowerCase() || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full p-2 rounded-xl border-2 border-b-4 indent-2 border-[#d4d9fb] outline-none focus:border-[#8896f3] focus:border-b-4"
               />
               <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  <Search
                     size={35}
                     strokeWidth={2}
                     className="text-[#2e48ef] bg-[#d4d9fb] p-2 rounded-lg"
                  />
               </div>
            </div>
            <div className="cursor-pointer">
               <Funnel
                  size={35}
                  strokeWidth={2}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="text-[#2e48ef] bg-[#d4d9fb] p-2 rounded-lg hover:scale-110 transition-all duration-300 hover:bg-[#2e48ef]/10 "
               />
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200 bg-white h-[400px] customScrollbar">
            <table className="min-w-full table-auto">
               <thead
                  className="bg-[#e0e2f3] text-gray-700 text-sm font-semibold uppercase tracking-wide"
                  style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                     <th className="px-4 py-3 text-left">ID</th>
                     <th className="px-4 py-3 text-left">Date</th>
                     <th className="px-4 py-3 text-left">Category</th>
                     <th className="px-4 py-3 text-left">Amount</th>
                     <th className="px-4 py-3 text-left">Action</th>
                  </tr>
               </thead>
               <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
                  {filteredData?.length > 0 ? (
                     filteredData.map((expense, index) => (
                        <tr
                           key={expense.id}
                           className="hover:bg-gray-100 transition-colors">
                           <td className="px-4 py-3">{index + 1}</td>
                           <td className="px-4 py-3">
                              {expense.date?.split('T')[0] || 'N/A'}
                           </td>
                           <td
                              className={`px-4 py-3 font-bold`}
                              style={{ color: expense.color }}>
                              {expense.category}
                           </td>
                           <td className="px-4 py-3">₹{expense.price}</td>
                           <td className="px-4 py-3">
                              <div className="flex gap-3">
                                 <p className="relative transition cursor-pointer flex items-center">
                                    <Trash
                                       className="text-red-500 text-sm p-2 border border-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-120"
                                       onClick={() =>
                                          dispatch(deleteExpense(expense.id))
                                       }
                                       size={33}
                                    />
                                    <PiInfoThin
                                       className="text-[#4cc458] text-sm hover:text-[#4b7e50] transition-all font-light duration-300 hover:scale-120 absolute left-10"
                                       size={20}
                                    />
                                 </p>
                              </div>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td
                           colSpan={5}
                           className="px-4 py-40 text-center text-gray-400 font-bold">
                           No Data Found.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default Report;
