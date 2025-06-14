import { Doughnut } from 'react-chartjs-2';
import {
   ArrowBigLeft,
   ArrowBigRight,
   EllipsisVertical,
   MoveLeft,
   MoveRight,
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';
import { monthlyExpenses } from '../data';

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

   const expensesPerMonth = monthlyExpenses[currentIndex] || [];
   const totalExpense = expensesPerMonth.reduce(
      (acc, curr) => acc + curr.value,
      0
   );

   const handleNext = () => {
      if (currentIndex < realCurrentMonthIndex) {
         setCurrentIndex((prevIndex) => prevIndex + 1);
      }
   };

   const handlePrev = () => {
      setCurrentIndex((prevIndex) =>
         prevIndex === 0 ? months.length - 1 : prevIndex - 1
      );
   };

   const chartData = {
      datasets: [
         {
            data: expensesPerMonth.map((e) => e.value),
            backgroundColor: expensesPerMonth.map((e) => e.color),
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
      <>
         <div className="bg-white p-6 rounded-2xl shadow-md w-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
               <p className="text-lg font-semibold text-gray-800">
                  {currentMonth} Expense
               </p>
               <EllipsisVertical className="text-gray-500" size={20} />
            </div>

            {/* Chart */}
            <div className="h-40 mb-4">
               <Doughnut
                  data={chartData}
                  options={chartOptions(totalExpense)}
                  plugins={[centerTextPlugin]}
                  className='drop-shadow-lg'
               />
            </div>

            {/* Expense List */}
            <div
               className={`grid grid-cols-${
                  expensesPerMonth.filter((item) => item.value > 0).length
               } text-sm mt-4 gap-3 rounded-2xl`}>
               {expensesPerMonth
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
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-300 p-2 rounded-full shadow cursor-pointer">
               <MoveLeft onClick={handlePrev} />
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-300 p-2 rounded-full shadow cursor-pointer">
               <MoveRight onClick={handleNext} />
            </div>
         </div>
      </>
   );
};

export default ExpenseChartCard;
