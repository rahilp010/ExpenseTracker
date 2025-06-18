import { createSlice } from "@reduxjs/toolkit";

export const expenseSlice = createSlice({
    name: "expense",
    initialState: {
        addExpense: {
            expenseData: JSON.parse(localStorage.getItem('expenseData')) || [],
            balance: JSON.parse(localStorage.getItem('balance')) || 0,
            totalExpenses: 0,
            updateExpense: null,
            deleteExpense: null,
            isUpdateExpense: false,
        },
    },
    reducers: {
        addExpense: (state, action) => {
            state.addExpense.expenseData.push(action.payload)
            const data = localStorage.setItem('expenseData', JSON.stringify(state.addExpense.expenseData))
        },
        loadExpense: (state) => {
            const data = localStorage.getItem('expenseData')
            if (data) {
                state.addExpense.expenseData = JSON.parse(data);
            }
        },
        updateBalance: (state, action) => {
            state.addExpense.balance = action.payload
            localStorage.setItem('balance', JSON.stringify(state.addExpense.balance))
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
                    availableBalance: state.addExpense.balance - parseFloat(price)
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
        }
    }
})

export const selectTotalExpense = (state) => {
    return state.expense.addExpense.expenseData.reduce(
        (acc, item) => acc - parseFloat(item.price),
        0
    );
};



export const { addExpense, loadExpense, updateBalance, updateExpense, setIsUpdateExpense, setUpdateExpense, deleteExpense } = expenseSlice.actions
export default expenseSlice.reducer

