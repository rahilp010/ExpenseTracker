import { configureStore } from '@reduxjs/toolkit'
import expenseReducer from './features/expenseSlice'
import settingsReducer from './features/settingsSlice'

export const store = configureStore({
    reducer: {
        expense: expenseReducer,
        settings: settingsReducer
    },
})