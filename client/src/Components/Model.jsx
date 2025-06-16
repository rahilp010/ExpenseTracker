import React, { useEffect, useState } from 'react';
import { categories } from '../data';
import { CircleX, Cross } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../Animations/Loader';
import { useDispatch, useSelector } from 'react-redux';
import {
   addExpense,
   loadExpense,
   selectTotalExpense,
} from '../app/features/expenseSlice';

const Model = ({ setShowModal }) => {
   const [category, setCategory] = useState('');
   const dispatch = useDispatch();
   const addExpenseData = useSelector(
      (state) => state.expense.addExpense.expenseData
   );
   const balance = useSelector((state) => state.expense.addExpense.balance)
   console.log('balance', balance)
   const [price, setPrice] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const totalExpense = useSelector(selectTotalExpense);

   useEffect(() => {
      dispatch(loadExpense());

   }, [dispatch]);

   const handleAddExpense = (e) => {
      e.preventDefault();
      setIsLoading(true);
      if (!category || !price) {
         toast.error('Please Fill All Fields');
         setIsLoading(false);
         return;
      }

      if (parseFloat(price) <= 0) {
         toast.error('Price must be greater than 0');
         setIsLoading(false);
         return;
      } else if (parseFloat(price) > balance) {
         toast.error('Balance is not enough');
         setIsLoading(false);
         return;
      }

      const newExpense = {
         category,
         price,
         date: new Date().toISOString(),
         color: categories.find((c) => c.name === category).color,
         id: Date.now(),
         availableBalance : balance - parseFloat(price)
      };

      setTimeout(() => {
         console.log('Saved Expense', newExpense);
         dispatch(addExpense(newExpense));
         // setExpenseData([...expenseData, newExpense]);
         toast.success('Expense Added Successfully');
         setIsLoading(false);
         setShowModal(false);
         setCategory('');
         setPrice('');
      }, 800);
   };

   return (
      <div
         className="fixed inset-0 flex items-center justify-center bg-black/50 z-10 transition-all duration-300"
         aria-modal="true"
         role="dialog">
         <form onSubmit={handleAddExpense}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
               <p className="text-lg font-semibold mb-4">Add Expense</p>
               <CircleX
                  className="absolute top-4 right-4 cursor-pointer text-red-400 hover:text-red-600"
                  size={30}
                  onClick={() => setShowModal(false)}
               />
               <div className="mb-4">
                  <label
                     htmlFor="category"
                     className="block text-sm mb-1 text-gray-600">
                     Category
                  </label>
                  <div className="grid grid-cols-5 text-center gap-1 mt-2">
                     {categories.map((item, index) => {
                        const isActive = category === item.name;
                        return (
                           <p
                              key={index}
                              style={{
                                 border: `2px solid ${item.color}`,
                                 backgroundColor: isActive
                                    ? item.color
                                    : 'transparent',
                              }}
                              className={`text-sm p-2 rounded-xl cursor-pointer transition-colors duration-200 `}
                              onClick={() => setCategory(item.name)}>
                              {item.name}
                           </p>
                        );
                     })}
                  </div>
               </div>
               <div>
                  <label
                     htmlFor="Price"
                     className="block text-sm mb-1 text-gray-600">
                     Price
                  </label>
                  <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                     <span className="pl-3">₹</span>
                     <input
                        type="number"
                        name="price"
                        id="price"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2 pl-0 border-none outline-none"
                     />
                  </div>
               </div>

               {isLoading && <Loader />}

               <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                     type="submit"
                     className="px-7 py-2 bg-[#566dff] hover:bg-[#566dff]/60 text-white rounded-lg transition-all duration-300 cursor-pointer">
                     Add
                  </button>
               </div>
            </div>
         </form>
      </div>
   );
};

export default Model;
