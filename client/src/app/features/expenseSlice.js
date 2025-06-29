import { createSlice } from "@reduxjs/toolkit";

export const expenseSlice = createSlice({
    name: "expense",
    initialState: {
        addExpense: {
            expenseData: JSON.parse(localStorage.getItem('expenseData')) || [],
            balanceByMonth: JSON.parse(localStorage.getItem('balanceByMonth')) || {},
            totalExpenses: 0,
            updateExpense: null,
            deleteExpense: null,
            isUpdateExpense: false,
        },
    },
    reducers: {
        addExpense: (state, action) => {
            state.addExpense.expenseData.push(action.payload)
            localStorage.setItem('expenseData', JSON.stringify(state.addExpense.expenseData))
        },
        loadExpense: (state) => {
            const data = localStorage.getItem('expenseData');
            const balanceByMonth = localStorage.getItem('balanceByMonth');
            if (data) {
                state.addExpense.expenseData = JSON.parse(data);
            }
            if (balanceByMonth) {
                state.addExpense.balanceByMonth = JSON.parse(balanceByMonth);
            }
        },
        updateBalance: (state, action) => {
            state.addExpense.balanceByMonth = action.payload
            localStorage.setItem('balanceByMonth', JSON.stringify(state.addExpense.balanceByMonth))
        },
        updateExpense: (state, action) => {
            const { id, category, price, date, color, currentMonth } = action.payload

            const expenseIndex = state.addExpense.expenseData.findIndex(item => item.id === id)
            if (expenseIndex !== -1) {
                state.addExpense.expenseData[expenseIndex] = {
                    ...state.addExpense.expenseData[expenseIndex],
                    monthOfExpense: currentMonth,
                    category,
                    price,
                    date,
                    color,
                    availableBalance: state.addExpense.balanceByMonth[currentMonth] - parseFloat(price)
                }
            }
            localStorage.setItem('expenseData', JSON.stringify(state.addExpense.expenseData))
        },
        setUpdateExpense: (state, action) => {
            state.addExpense.updateExpense = action.payload
            localStorage.setItem('updateExpense', JSON.stringify(state.addExpense.updateExpense))
        },
        setIsUpdateExpense: (state, action) => {
            state.addExpense.isUpdateExpense = action.payload
        },
        deleteExpense: (state, action) => {
            state.addExpense.expenseData = state.addExpense.expenseData.filter(item => item.id != action.payload)
            localStorage.setItem('expenseData', JSON.stringify(state.addExpense.expenseData))
        },
        setBalanceByMonth: (state, action) => {
            const { month, balanceByMonth } = action.payload
            const current = state.addExpense.balanceByMonth || {};
            const updatedBalances = { ...current, [month]: balanceByMonth };
            state.addExpense.balanceByMonth = updatedBalances;

            localStorage.setItem('balanceByMonth', JSON.stringify(updatedBalances));
        }
    }
})

export const selectTotalExpense = (state) => {
    return state.expense.addExpense.expenseData.reduce(
        (acc, item) => acc - parseFloat(item.price),
        0
    );
};

export const selectMonthlyBalance = (state, month) => {
    return state.expense.addExpense.balanceByMonth[month] ?? 10000
}




export const { addExpense, loadExpense, updateBalance, updateExpense, setIsUpdateExpense, setUpdateExpense, deleteExpense, setBalanceByMonth } = expenseSlice.actions
export default expenseSlice.reducer

