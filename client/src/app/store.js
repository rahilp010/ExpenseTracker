import { configureStore } from '@reduxjs/toolkit'
import expenseReducer from './features/expenseSlice'
import credentialReducer from './features/credentialSlice'

const savedToken = localStorage.getItem('accessToken');

export const store = configureStore({
    reducer: {
        expense: expenseReducer,
        credential: credentialReducer   
    },
    preloadedState: {
        credential: {
            isAuthenticated: savedToken ? true : false,
            accessToken: savedToken
        }
    }
})