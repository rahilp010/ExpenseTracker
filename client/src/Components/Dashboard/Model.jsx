import React, { useEffect, useState } from 'react';
import { categories } from '../../data';
import { CircleX } from 'lucide-react';
import { toast } from 'react-toastify';
import Loader from '../../Animations/Loader';
import { useDispatch, useSelector } from 'react-redux';
import {
   addExpense,
   loadExpense,
   updateExpense,
} from '../../app/features/expenseSlice';
import { data } from 'react-router';
import { useDarkMode } from '../DarkModeContext';

const Model = ({
   setShowModal,
   setIsUpdateExpense,
   currentMonth,
   totalExpense,
}) => {
   const { isDarkMode } = useDarkMode();
   const dispatch = useDispatch();
   const addExpenseData = useSelector(
      (state) => state.expense.addExpense.expenseData
   );

   const balanceByMonth = useSelector(
      (state) => state.expense.addExpense.balanceByMonth[currentMonth]
   );
   const isUpdateExpense = useSelector(
      (state) => state.expense.addExpense.isUpdateExpense
   );
   const updateExpenseData = useSelector(
      (state) => state.expense.addExpense.updateExpense
   );
   const [price, setPrice] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const addedCategory = addExpenseData.map((e) => e.category);
   const [selectedCategories, setSelectedCategories] = useState([]);
   const [categoryPrices, setCategoryPrices] = useState({});
   const existingCategories = addExpenseData
      .filter((item) => item.monthOfExpense === currentMonth)
      .map((e) => e.category);

   const duplicateCategories = existingCategories.filter(
      (item, index) => existingCategories.indexOf(item) !== index
   );

   const uniqueDuplicatesCategory = [...new Set(selectedCategories)];

   const uniqueDuplicates = [...new Set(duplicateCategories)];

   console.log('Duplicate Categories:', uniqueDuplicates);

   const matchedExpenses = addExpenseData.filter((item) =>
      uniqueDuplicates.includes(item.category)
   );

   console.log(matchedExpenses);

   const multipleExpenseValue = matchedExpenses.filter(
      (item) => item.monthOfExpense === currentMonth
   );

   const updatedPriceAfterCombine = multipleExpenseValue?.reduce(
      (acc, curr) => acc + parseFloat(curr.price || 0),
      0
   );
   console.log(updatedPriceAfterCombine);

   console.log('Matching Expenses:', multipleExpenseValue);

   useEffect(() => {
      dispatch(loadExpense());
   }, [dispatch]);

   useEffect(() => {
      if (isUpdateExpense) {
         const prices = {};
         addExpenseData.forEach((e) => {
            prices[e.category] = e.price;
         });
         setSelectedCategories(existingCategories);
         setCategoryPrices(prices);
      }
   }, [isUpdateExpense, addExpenseData]);

   const handlePriceChange = (category, value) => {
      setCategoryPrices((prev) => ({
         ...prev,
         [category]: value,
      }));
   };

   const handleAddExpense = (e) => {
      e.preventDefault();
      setIsLoading(true);
      if (!selectedCategories.length === 0 || !price) {
         toast.error('Please Fill All Fields');
         setIsLoading(false);
         return;
      }

      if (parseFloat(price) <= 0) {
         toast.error('Price must be greater than 0');
         setIsLoading(false);
         return;
      } else if (parseFloat(price) > balanceByMonth) {
         toast.error('Balance is not enough');
         setIsLoading(false);
         return;
      }

      if (selectedCategories.length === 0 || !price) {
         toast.error('Select at least one category and enter price');
         return;
      }

      const newExpenses = selectedCategories.map((cat) => ({
         category: cat,
         price: categoryPrices[cat] || price,
         date: new Date().toISOString(),
         color: categories.find((c) => c.name === cat).color,
         monthOfExpense: currentMonth,
         id: Date.now() + Math.random(), // ensure uniqueness
         availableBalance:
            parseFloat(balanceByMonth) - parseFloat(totalExpense),
      }));

      setTimeout(() => {
         newExpenses.forEach((expense) => dispatch(addExpense(expense)));
         toast.success('Expense Added Successfully');
         setIsLoading(false);
         setShowModal(false);
         setSelectedCategories([]);
         setPrice('');
      }, 800);
   };
   console.log('hii', uniqueDuplicates.includes(data));

   const handleUpdateExpense = (e) => {
      e.preventDefault();
      setIsLoading(true);
      // if (!price || selectedCategories.length === 0) {
      //    toast.error('Please Fill All Fields');
      //    setIsLoading(false);
      //    return;
      // } else
      if (parseFloat(price) > balanceByMonth) {
         toast.error('Balance is not enough');
         setIsLoading(false);
         return;
      }

      const updateExpenseList = selectedCategories
         .map((cat, idx) => {
            const expense = addExpenseData.find((e) => e.category === cat);
            if (!expense) {
               toast.error(`${cat} not found in the expense data`);
               setIsLoading(false);
               return null;
            }

            const updatedPrice = parseFloat(categoryPrices[cat]);
            if (
               !updatedPrice ||
               updatedPrice <= 0 ||
               updatedPrice > balanceByMonth
            ) {
               toast.error(`Invalid price for ${cat}`);
               return null;
            }

            return {
               ...expense,
               price: updatedPrice,
               date: new Date().toISOString(),
               availableBalance:
                  parseFloat(expense.availableBalance) - updatedPrice,
               monthOfExpense: currentMonth,
               id: expense.id,
               color: expense.color,
            };
         })
         .filter(Boolean);

      if (updateExpenseList.length > 0) {
         setTimeout(() => {
            updateExpenseList?.forEach((expense) =>
               dispatch(updateExpense(expense))
            );
            toast.success('Expense Updated Successfully');
            setIsLoading(false);
            setShowModal(false);
            setSelectedCategories([]);
            setCategoryPrices({});
         }, 800);
      } else {
         setIsLoading(false);
      }
   };

   return (
      <div
         className="fixed inset-0 flex items-center justify-center bg-black/50 z-100 transition-all duration-300"
         aria-modal="true"
         role="dialog">
         <form
            onSubmit={isUpdateExpense ? handleUpdateExpense : handleAddExpense}>
            <div
               className={`p-6 rounded-lg shadow-lg w-full max-w-lg relative
               ${isDarkMode ? 'bg-[#222222]' : 'bg-white'}
               `}>
               <p className="text-lg font-semibold mb-4">
                  {isUpdateExpense ? 'Update Expense' : 'Add Expense'}
               </p>
               <CircleX
                  className="absolute top-4 right-4 cursor-pointer text-red-400 hover:text-red-600"
                  size={30}
                  onClick={() => {
                     setShowModal(false);
                     dispatch(setIsUpdateExpense(false));
                     // setSelectedCategories([]);
                     // setCategoryPrices({});
                     // setPrice('');
                  }}
               />
               <div className="mb-4">
                  <label
                     htmlFor="category"
                     className="block text-sm mb-1 text-gray-600">
                     Category
                  </label>
                  <div
                     className={`grid text-center gap-1 mt-2`}
                     style={{
                        gridTemplateColumns: `repeat(${
                           isUpdateExpense
                              ? uniqueDuplicatesCategory.length
                              : categories.length
                        }, minmax(0, 1fr))`,
                     }}>
                     {(isUpdateExpense
                        ? categories.filter((cat) =>
                             existingCategories.includes(cat.name)
                          )
                        : categories
                     ).map((item, index) => {
                        const isActive = selectedCategories.includes(item.name);

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
                              onClick={() => {
                                 if (isActive) {
                                    setSelectedCategories((prev) =>
                                       prev.filter((c) => c !== item.name)
                                    );
                                 } else {
                                    setSelectedCategories((prev) => [
                                       ...prev,
                                       item.name,
                                    ]);
                                 }
                              }}>
                              {item.name}
                           </p>
                        );
                     })}
                  </div>
               </div>
               {isUpdateExpense ? (
                  <div className="grid grid-cols-2 gap-3">
                     {console.log('selected', new Set(selectedCategories))}
                     {uniqueDuplicatesCategory.map((data, index) => {
                        return (
                           <div key={index}>
                              <label
                                 htmlFor="Price"
                                 className="block text-sm mb-1 text-gray-600">
                                 {data} Price
                              </label>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                 <span className="pl-3">₹</span>
                                 <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    placeholder="0.00"
                                    value={
                                       uniqueDuplicates.includes(data)
                                          ? updatedPriceAfterCombine
                                          : categoryPrices[data] || ''
                                    }
                                    onChange={(e) =>
                                       handlePriceChange(data, e.target.value)
                                    }
                                    className="w-full p-2 pl-0 indent-2 border-none outline-none"
                                 />
                              </div>
                           </div>
                        );
                     })}
                  </div>
               ) : (
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
               )}

               {isLoading && <Loader />}

               <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                     type="submit"
                     className="px-7 py-2 bg-[#566dff] hover:bg-[#566dff]/60 text-white rounded-lg transition-all duration-300 cursor-pointer">
                     {isUpdateExpense ? 'Update' : 'Add'}
                  </button>
               </div>
            </div>
         </form>
      </div>
   );
};

export default Model;
