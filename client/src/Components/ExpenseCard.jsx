import { Doughnut } from 'react-chartjs-2';
import {
   EllipsisVertical,
   MoveLeft,
   MoveRight,
   Pencil,
   PenLine,
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import savedMoney from '../assets/savedMoney.webp';
import line from '../assets/Line.png';

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = {
   id: 'centerText',
   beforeDraw: (chart) => {
      const { width, height } = chart;
      const ctx = chart.ctx;
      ctx.restore();
      const fontSize = (height / 150).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = 'middle';

      const { text1 = 'Total', text2 = '₹0' } =
         chart?.config?.options?.plugins?.centerText || {};

      const textX1 = Math.round((width - ctx.measureText(text1).width) / 2);
      const textX2 = Math.round((width - ctx.measureText(text2).width) / 2);

      ctx.fillStyle = '#999';
      ctx.fillText(text1, textX1, height / 2.2);

      ctx.font = `bold ${fontSize * 1.2}em sans-serif`;
      ctx.fillStyle = '#333';
      ctx.fillText(text2, textX2, height / 1.6);
      ctx.save();
   },
};

const ExpenseChartCard = () => {
   const [currentIndex, setCurrentIndex] = useState(new Date().getMonth());
   const dispatch = useDispatch();
   const addExpenseData = useSelector(
      (state) => state.expense.addExpense.expenseData
   );
   const [updateModal, setUpdateModal] = useState(false);
   const [updateExpense, setUpdateExpense] = useState(null);

   console.log('addExpenseData', addExpenseData);

   const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
   ];

   const currentMonth = months[currentIndex];
   const realCurrentMonthIndex = new Date().getMonth(); // e.g. June = 5
   console.log('currentMonth', currentMonth);

   const handleNext = () => {
      if (currentIndex < realCurrentMonthIndex) {
         setCurrentIndex((prevIndex) => prevIndex + 1);
      }
   };

   const handlePrev = () => {
      if (currentIndex > 0) {
         setCurrentIndex((prevIndex) => prevIndex - 1);
      }
   };

   const getMonthIndex = (dateString) => {
      const month = parseInt(dateString.split('-')[1], 10); // "06" -> 6
      return month - 1; // convert to 0-based index
   };

   const monthWiseExpense = addExpenseData.filter((e) => {
      const expenseMonthIndex = getMonthIndex(e.date);
      return expenseMonthIndex === currentIndex;
   });

   const groupedExpense = {};

   monthWiseExpense.forEach((item) => {
      if (!groupedExpense[item.category]) {
         groupedExpense[item.category] = {
            name: item.category,
            color: item.color,
            value: 0,
         };
      }
      groupedExpense[item.category].value += parseFloat(item.price);
   });

   const categoryWiseData = Object.values(groupedExpense);

   const totalExpense = categoryWiseData.reduce(
      (sum, item) => sum + item.value,
      0
   );

   const chartData = {
      datasets: [
         {
            data: categoryWiseData.map((e) => e.value),
            backgroundColor: categoryWiseData.map((e) => e.color),
            cutout: '70%',
            borderRadius: 6,
         },
      ],
   };
   const chartOptions = (total) => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: { display: false },
         tooltip: { enabled: true },
         centerText: {
            text1: 'Total',
            text2: `₹${total}`,
         },
      },
   });

   return (
      <div className="flex flex-col gap-4 h-full relative">
         <div className="bg-white border-2 border-gray-200 p-6 rounded-2xl shadow-lg w-full h-[calc(2/3*100%)-100px] relative overflow-hidden">
            <div className="flex justify-between relative items-center mb-4">
               <p className="text-lg font-semibold text-gray-800">
                  {currentMonth} Expenses
               </p>
               <EllipsisVertical
                  className="text-gray-500 cursor-pointer"
                  size={20}
                  onClick={() => setUpdateExpense(true)}
               />
               {updateExpense && (
                  <div
                     className="absolute top-6 rounded-lg right-0 w-1/5 h-full z-10 bg-white/50 hover:bg-[#eabde6]/50 cursor-pointer "
                     onClick={() => setUpdateExpense(false)}>
                     <div className="p-1 flex items-center gap-2 justify-center border-2 border-[#eabde6] rounded-xl">
                        <PenLine size={15} />
                        <p className="text-sm font-light">Update</p>
                     </div>
                  </div>
               )}
            </div>

            <div className="h-45 mb-6">
               <Doughnut
                  data={chartData}
                  options={chartOptions(totalExpense)}
                  plugins={[centerTextPlugin]}
                  className="drop-shadow-lg"
               />
            </div>

            <div
               style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
               }}
               className={`grid text-sm mt-4 gap-3 rounded-2xl`}>
               {categoryWiseData
                  .filter((item) => item.value > 0)
                  .map((item, index) => (
                     <div
                        key={index}
                        style={{ border: `2px solid ${item.color}` }}
                        className="flex items-center justify-center text-sm font-light rounded-2xl">
                        <div className="flex items-center">
                           <p
                              className={`text-gray-900 py-1 rounded-2xl w-fit`}>
                              {item.name}
                           </p>
                        </div>
                     </div>
                  ))}
            </div>
            <div
               onClick={handlePrev}
               className={`absolute top-1/2 left-1 transform -translate-y-1/2 p-2 rounded-full shadow ${
                  currentIndex === 0
                     ? 'bg-gray-300 cursor-not-allowed'
                     : 'bg-blue-300 cursor-pointer'
               }`}>
               <MoveLeft />
            </div>
            <div
               onClick={handleNext}
               className={`absolute top-1/2 right-1 transform -translate-y-1/2 p-2 rounded-full shadow ${
                  currentIndex === realCurrentMonthIndex
                     ? 'bg-gray-300 cursor-not-allowed'
                     : 'bg-blue-300 cursor-pointer'
               }`}>
               <MoveRight />
            </div>
         </div>
         <div className="bg-white border-2 border-gray-200 p-6 rounded-2xl shadow-lg w-full h-[calc(1/3*106%)] relative overflow-hidden grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
               <p className="text-lg font-semibold text-gray-800">
                  Saved Money
               </p>
               <div className="relative w-fit my-5 z-10 bg-white ml-2 drop-shadow-lg rounded-full">
                  <p className="text-2xl font-bold text-gray-800 border-3 border-red-400 p-10 w-fit rounded-full"></p>
                  <p className="absolute top-1/2 left-1/2 text-2xl -translate-x-1/2 -translate-y-1/2 font-bold text-gray-800">
                     3000
                  </p>
               </div>
               <p className="border-t-4 border-gray-200 absolute top-1/2 left-0  mt-2 w-full"></p>
               <p className="text-red-500 text-xl font-thin absolute top-1/2 left-32 tracking-widest drop-shadow-2xl mt-1 w-full">
                  Last Month
               </p>
               <p className="border-t-4 border-gray-200 absolute top-1/2 left-0  mt-6 w-full"></p>
            </div>
            <img
               src={savedMoney}
               alt=""
               srcset=""
               className="w-96 h-40 object-cover drop-shadow-xl"
            />
         </div>
      </div>
   );
};

export default ExpenseChartCard;
