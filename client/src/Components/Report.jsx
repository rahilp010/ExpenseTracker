import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteExpense } from '../app/features/expenseSlice';
import { Search, Trash } from 'lucide-react';
import { PiInfoThin } from 'react-icons/pi';
import { IoIosInformation } from 'react-icons/io';
const Report = () => {
   const expenses = useSelector(
      (state) => state.expense.addExpense.expenseData
   );
   const dispatch = useDispatch();

   console.log(expenses);

   const [searchQuery, setSearchQuery] = useState('');

   const filteredData = expenses.filter((data) => {
      const query = searchQuery.toLowerCase();
      return (
         data.id.toString().includes(query) ||
         data.date?.toLowerCase().includes(query) ||
         data.category?.toLowerCase().includes(query) ||
         data.price?.toString().includes(query)
      );
   });

   return (
      <div className="p-6">
         {/* Title */}
         <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📊 Expense Report
         </h2>
         <div className="flex justify-end my-3">
            <div className="relative w-64">
               <input
                  type="text"
                  value={searchQuery?.toLowerCase() || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full p-2 rounded-xl border-2 indent-2 border-[#d4d9fb] outline-none focus:border-[#8896f3]"
               />
               <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  <Search
                     size={35}
                     strokeWidth={2}
                     className="text-[#2e48ef] bg-[#d4d9fb] p-2 rounded-lg"
                  />
               </div>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200 bg-white h-[400px] customScrollbar">
            <table className="min-w-full table-auto">
               <thead
                  className="bg-[#e0e2f3] text-gray-700 text-sm font-semibold uppercase tracking-wide"
                  style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
                  <tr>
                     <th className="px-4 py-3 text-left">ID</th>
                     <th className="px-4 py-3 text-left">Date</th>
                     <th className="px-4 py-3 text-left">Category</th>
                     <th className="px-4 py-3 text-left">Amount</th>
                     <th className="px-4 py-3 text-left">Action</th>
                  </tr>
               </thead>
               <tbody className="text-gray-700 text-sm divide-y divide-gray-100">
                  {filteredData.length > 0 ? (
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
                           colSpan="5"
                           className="px-4 py-6 text-center text-gray-400">
                           No expenses found.
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
