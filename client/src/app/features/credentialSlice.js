import { createSlice } from "@reduxjs/toolkit";
import { FaXRay } from "react-icons/fa";


// const savedCredentials = JSON.parse(localStorage.getItem('credentials'));

export const credentialSlice = createSlice({
    name: 'credentials',
    initialState: {
        name: '',
        email: '',
        password: '',
        isAuthenticated: false,
        accessToken: '',
    },
    reducers: {
        setCredential: (state, action) => {
            const { name, email, password, accessToken } = action.payload
            state.email = email
            state.password = password
            state.name = name
            state.isAuthenticated = true
            state.accessToken = accessToken
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('credentials', JSON.stringify(action.payload));
        },
        hydrateCredential: (state, action) => {
            return { ...state, ...action.payload };
        },
        logout: (state) => {
            state.email = ""
            state.password = ""
            state.name = ""
            state.isAuthenticated = false
            state.accessToken = ""
            localStorage.removeItem('accessToken');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('credentials');
        }
    }
})


export const { setCredential, logout, hydrateCredential } = credentialSlice.actions
export default credentialSlice.reducer
