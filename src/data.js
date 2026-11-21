import LightMode from './assets/LightMode.png';
import DarkMode from './assets/DarkMode.png';
import System from './assets/System.png';

const expenseCategories = [
   { id: 'food', name: 'Food & Dining', color: '#f97316', icon: 'Utensils', defaultBudget: 8000 },
   { id: 'transport', name: 'Transportation', color: '#06b6d4', icon: 'Car', defaultBudget: 4000 },
   { id: 'shopping', name: 'Shopping & Apparel', color: '#ec4899', icon: 'ShoppingBag', defaultBudget: 6000 },
   { id: 'bills', name: 'Housing & Utilities', color: '#eab308', icon: 'Zap', defaultBudget: 7500 },
   { id: 'entertainment', name: 'Entertainment', color: '#8b5cf6', icon: 'Tv', defaultBudget: 3500 },
   { id: 'health', name: 'Health & Wellness', color: '#10b981', icon: 'HeartPulse', defaultBudget: 3000 },
   { id: 'travel', name: 'Travel & Trips', color: '#14b8a6', icon: 'Plane', defaultBudget: 5000 },
   { id: 'education', name: 'Education', color: '#3b82f6', icon: 'GraduationCap', defaultBudget: 2500 },
   { id: 'other', name: 'Miscellaneous', color: '#64748b', icon: 'MoreHorizontal', defaultBudget: 2000 },
];

const incomeCategories = [
   { id: 'salary', name: 'Salary & Wages', color: '#10b981', icon: 'Briefcase' },
   { id: 'freelance', name: 'Freelance & Projects', color: '#3b82f6', icon: 'Laptop' },
   { id: 'investments', name: 'Investments & Returns', color: '#6366f1', icon: 'TrendingUp' },
   { id: 'business', name: 'Business Income', color: '#0ea5e9', icon: 'Building' },
   { id: 'gifts', name: 'Gifts & Rewards', color: '#ec4899', icon: 'Gift' },
   { id: 'other_income', name: 'Other Income', color: '#84cc16', icon: 'PlusCircle' },
];

// Combine for backward compatibility
const categories = [
   { name: 'Food', color: '#f97316' },
   { name: 'Transport', color: '#06b6d4' },
   { name: 'Shopping', color: '#ec4899' },
   { name: 'Enjoy', color: '#8b5cf6' },
   { name: 'Other', color: '#64748b' },
   ...expenseCategories.map(c => ({ name: c.name, color: c.color })),
];

const paymentMethods = [
   'UPI',
   'Credit Card',
   'Debit Card',
   'Net Banking',
   'Cash',
];

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

const profileSettings = [
   {
      id: 1,
      label: 'Full Name',
      type: 'text',
      placeHolder: 'Enter your full name',
      name: 'name',
   },
   {
      id: 2,
      label: 'User Name',
      type: 'text',
      placeHolder: 'Enter your username',
      name: 'username',
   },
   {
      id: 3,
      label: 'Phone Number',
      type: 'tel',
      placeHolder: 'Enter your number',
      name: 'phone',
   },
   {
      id: 4,
      label: 'Email',
      type: 'email',
      placeHolder: 'Enter your email',
      name: 'email',
   },
   {
      id: 5,
      label: 'Currency Symbol',
      type: 'text',
      placeHolder: 'e.g. ₹ or $ or €',
      name: 'currency',
   },
];

const themes = [
   {
      id: 1,
      name: 'light',
      label: 'Light Mode',
      image: LightMode,
      description: 'Clean, crisp high-contrast daylight theme',
   },
   {
      id: 2,
      name: 'dark',
      label: 'Dark Mode',
      image: DarkMode,
      description: 'Subtle slate & charcoal theme easy on the eyes',
   },
   {
      id: 3,
      name: 'system',
      label: 'System Adaptive',
      image: System,
      description: 'Automatically switches with your device OS settings',
   },
];

export const getSampleTransactions = () => {
   const now = new Date();
   const currentYear = now.getFullYear();
   const currentMonthIndex = now.getMonth();
   const monthName = months[currentMonthIndex];

   const formatDate = (daysAgo) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
   };

   return [
      {
         id: 'tx-1',
         type: 'income',
         title: 'Monthly Salary',
         category: 'Salary & Wages',
         price: 65000,
         date: formatDate(1),
         monthOfExpense: monthName,
         paymentMethod: 'Net Banking',
         color: '#10b981',
         notes: 'Monthly corporate salary deposit',
      },
      {
         id: 'tx-2',
         type: 'income',
         title: 'Design Consulting Gig',
         category: 'Freelance & Projects',
         price: 18500,
         date: formatDate(3),
         monthOfExpense: monthName,
         paymentMethod: 'UPI',
         color: '#3b82f6',
         notes: 'Mobile app UI wireframe delivery',
      },
      {
         id: 'tx-3',
         type: 'expense',
         title: 'Grocery Superstore',
         category: 'Food & Dining',
         price: 3420,
         date: formatDate(1),
         monthOfExpense: monthName,
         paymentMethod: 'Credit Card',
         color: '#f97316',
         notes: 'Weekly fresh produce & kitchen items',
      },
      {
         id: 'tx-4',
         type: 'expense',
         title: 'High-speed Fiber Internet',
         category: 'Housing & Utilities',
         price: 1199,
         date: formatDate(4),
         monthOfExpense: monthName,
         paymentMethod: 'UPI',
         color: '#eab308',
         notes: 'Monthly 300Mbps broadband plan',
      },
      {
         id: 'tx-5',
         type: 'expense',
         title: 'Fuel Station Refill',
         category: 'Transportation',
         price: 2150,
         date: formatDate(5),
         monthOfExpense: monthName,
         paymentMethod: 'Credit Card',
         color: '#06b6d4',
         notes: 'Full tank petrol',
      },
      {
         id: 'tx-6',
         type: 'expense',
         title: 'Weekend Dining & Bistro',
         category: 'Food & Dining',
         price: 1840,
         date: formatDate(6),
         monthOfExpense: monthName,
         paymentMethod: 'UPI',
         color: '#f97316',
         notes: 'Dinner with college friends',
      },
      {
         id: 'tx-7',
         type: 'expense',
         title: 'Mechanical Keyboard Switch Set',
         category: 'Shopping & Apparel',
         price: 2890,
         date: formatDate(8),
         monthOfExpense: monthName,
         paymentMethod: 'Debit Card',
         color: '#ec4899',
         notes: 'Workstation upgrade accessory',
      },
      {
         id: 'tx-8',
         type: 'expense',
         title: 'Streaming Subscriptions Bundle',
         category: 'Entertainment',
         price: 899,
         date: formatDate(10),
         monthOfExpense: monthName,
         paymentMethod: 'Credit Card',
         color: '#8b5cf6',
         notes: 'Netflix 4K & Spotify Family',
      },
      {
         id: 'tx-9',
         type: 'expense',
         title: 'Pharmacy & Multivitamins',
         category: 'Health & Wellness',
         price: 950,
         date: formatDate(12),
         monthOfExpense: monthName,
         paymentMethod: 'UPI',
         color: '#10b981',
         notes: 'Monthly wellness essentials',
      },
   ];
};

export {
   months,
   categories,
   expenseCategories,
   incomeCategories,
   paymentMethods,
   profileSettings,
   themes,
};
