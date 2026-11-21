import { createSlice } from '@reduxjs/toolkit';
import { getSampleTransactions } from '../../data';

const getInitialExpenseData = () => {
   try {
      const data = localStorage.getItem('expenseData');
      if (data) {
         const parsed = JSON.parse(data);
         if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
         }
      }
   } catch (e) {
      console.error('Failed reading expenseData', e);
   }
   // Provide sensible initial sample data if empty so user experiences a lively dashboard
   const sample = getSampleTransactions();
   localStorage.setItem('expenseData', JSON.stringify(sample));
   return sample;
};

const getInitialBudgets = () => {
   try {
      const data = localStorage.getItem('categoryBudgets');
      if (data) return JSON.parse(data);
   } catch (e) {}
   return {
      'Food & Dining': 10000,
      'Transportation': 5000,
      'Shopping & Apparel': 6000,
      'Housing & Utilities': 8000,
      'Entertainment': 4000,
      'Health & Wellness': 3000,
      'Travel & Trips': 5000,
      'Education': 3000,
      'Miscellaneous': 2500,
      'Food': 8000,
      'Transport': 4000,
      'Shopping': 5000,
      'Enjoy': 3000,
      'Other': 2000,
   };
};

export const expenseSlice = createSlice({
   name: 'expense',
   initialState: {
      addExpense: {
         expenseData: getInitialExpenseData(),
         balanceByMonth: JSON.parse(localStorage.getItem('balanceByMonth')) || {},
         categoryBudgets: getInitialBudgets(),
         totalExpenses: 0,
         updateExpense: null,
         deleteExpense: null,
         isUpdateExpense: false,
      },
   },
   reducers: {
      addExpense: (state, action) => {
         const newTx = {
            id: action.payload.id || `tx-${Date.now()}`,
            type: action.payload.type || 'expense',
            title: action.payload.title || action.payload.category || 'Transaction',
            category: action.payload.category || 'Other',
            price: parseFloat(action.payload.price) || 0,
            date: action.payload.date || new Date().toISOString().split('T')[0],
            monthOfExpense: action.payload.monthOfExpense || action.payload.currentMonth || 'January',
            color: action.payload.color || '#64748b',
            paymentMethod: action.payload.paymentMethod || 'UPI',
            notes: action.payload.notes || '',
         };
         state.addExpense.expenseData.unshift(newTx);
         localStorage.setItem('expenseData', JSON.stringify(state.addExpense.expenseData));
      },

      loadExpense: (state) => {
         try {
            const data = localStorage.getItem('expenseData');
            const balanceByMonth = localStorage.getItem('balanceByMonth');
            const categoryBudgets = localStorage.getItem('categoryBudgets');

            if (data) {
               state.addExpense.expenseData = JSON.parse(data);
            }
            if (balanceByMonth) {
               state.addExpense.balanceByMonth = JSON.parse(balanceByMonth);
            }
            if (categoryBudgets) {
               state.addExpense.categoryBudgets = JSON.parse(categoryBudgets);
            }
         } catch (e) {
            console.error('Error loading expense data', e);
         }
      },

      updateBalance: (state, action) => {
         state.addExpense.balanceByMonth = action.payload;
         localStorage.setItem('balanceByMonth', JSON.stringify(state.addExpense.balanceByMonth));
      },

      updateExpense: (state, action) => {
         const { id, type, title, category, price, date, color, currentMonth, monthOfExpense, paymentMethod, notes } = action.payload;
         const index = state.addExpense.expenseData.findIndex((item) => String(item.id) === String(id));

         if (index !== -1) {
            state.addExpense.expenseData[index] = {
               ...state.addExpense.expenseData[index],
               type: type || state.addExpense.expenseData[index].type || 'expense',
               title: title || state.addExpense.expenseData[index].title || category,
               category: category || state.addExpense.expenseData[index].category,
               price: parseFloat(price) || 0,
               date: date || state.addExpense.expenseData[index].date,
               monthOfExpense: monthOfExpense || currentMonth || state.addExpense.expenseData[index].monthOfExpense,
               color: color || state.addExpense.expenseData[index].color,
               paymentMethod: paymentMethod || state.addExpense.expenseData[index].paymentMethod || 'UPI',
               notes: notes !== undefined ? notes : state.addExpense.expenseData[index].notes,
            };
            localStorage.setItem('expenseData', JSON.stringify(state.addExpense.expenseData));
         }
      },

      setUpdateExpense: (state, action) => {
         state.addExpense.updateExpense = action.payload;
         if (action.payload) {
            localStorage.setItem('updateExpense', JSON.stringify(action.payload));
         } else {
            localStorage.removeItem('updateExpense');
         }
      },

      setIsUpdateExpense: (state, action) => {
         state.addExpense.isUpdateExpense = action.payload;
      },

      deleteExpense: (state, action) => {
         state.addExpense.expenseData = state.addExpense.expenseData.filter(
            (item) => String(item.id) !== String(action.payload)
         );
         localStorage.setItem('expenseData', JSON.stringify(state.addExpense.expenseData));
      },

      setBalanceByMonth: (state, action) => {
         const { month, balanceByMonth } = action.payload;
         const current = state.addExpense.balanceByMonth || {};
         const updatedBalances = { ...current, [month]: parseFloat(balanceByMonth) || 0 };
         state.addExpense.balanceByMonth = updatedBalances;
         localStorage.setItem('balanceByMonth', JSON.stringify(updatedBalances));
      },

      setCategoryBudget: (state, action) => {
         const { category, budget } = action.payload;
         const current = state.addExpense.categoryBudgets || {};
         const updated = { ...current, [category]: parseFloat(budget) || 0 };
         state.addExpense.categoryBudgets = updated;
         localStorage.setItem('categoryBudgets', JSON.stringify(updated));
      },

      loadSampleData: (state) => {
         const sample = getSampleTransactions();
         state.addExpense.expenseData = sample;
         localStorage.setItem('expenseData', JSON.stringify(sample));
      },

      clearAllData: (state) => {
         state.addExpense.expenseData = [];
         localStorage.setItem('expenseData', JSON.stringify([]));
      },

      importTransactions: (state, action) => {
         if (Array.isArray(action.payload)) {
            state.addExpense.expenseData = action.payload;
            localStorage.setItem('expenseData', JSON.stringify(action.payload));
         }
      },
   },
});

// Selectors
export const selectTotalExpense = (state, month) => {
   const expenses = state.expense.addExpense.expenseData || [];
   return expenses
      .filter((item) => {
         const isExpense = !item.type || item.type === 'expense';
         if (!month) return isExpense;
         return isExpense && item.monthOfExpense === month;
      })
      .reduce((acc, item) => acc + Math.abs(parseFloat(item.price) || 0), 0);
};

export const selectTotalIncome = (state, month) => {
   const expenses = state.expense.addExpense.expenseData || [];
   return expenses
      .filter((item) => {
         const isIncome = item.type === 'income';
         if (!month) return isIncome;
         return isIncome && item.monthOfExpense === month;
      })
      .reduce((acc, item) => acc + Math.abs(parseFloat(item.price) || 0), 0);
};

export const selectMonthlyBalance = (state, month) => {
   const balances = state.expense.addExpense.balanceByMonth || {};
   return balances[month] ?? 25000;
};

export const selectNetSavings = (state, month) => {
   const income = selectTotalIncome(state, month);
   const expense = selectTotalExpense(state, month);
   const base = selectMonthlyBalance(state, month);
   return base + income - expense;
};

export const selectCategoryBudgets = (state) => {
   return state.expense.addExpense.categoryBudgets || {};
};

export const {
   addExpense,
   loadExpense,
   updateBalance,
   updateExpense,
   setIsUpdateExpense,
   setUpdateExpense,
   deleteExpense,
   setBalanceByMonth,
   setCategoryBudget,
   loadSampleData,
   clearAllData,
   importTransactions,
} = expenseSlice.actions;

export default expenseSlice.reducer;
