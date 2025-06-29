import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        profileSettingsData: {
            name: '',
            username: '',
            email: '',
            phone: '',
            image: '',
            isLoading: false,
        },
        accountSettingsData: {},
        theme: localStorage.getItem('theme') || 1
    },
    reducers: {
        updateProfileSettings: (state, action) => {
            state.profileSettingsData = action.payload
            localStorage.setItem('profileSettingsData', JSON.stringify(state.profileSettingsData))
        },
        loadProfileSettings: (state) => {
            const data = localStorage.getItem('profileSettingsData')
            if (data) {
                state.profileSettingsData = JSON.parse(data)
            }
        },
        setLoading: (state, action) => {
            state.profileSettingsData.isLoading = action.payload
        },
        setTheme: (state, action) => {
            state.theme = action.payload
            localStorage.setItem('theme', action.payload)
        }
    }
})

export const { updateProfileSettings, loadProfileSettings, setLoading, setTheme } = settingsSlice.actions
export default settingsSlice.reducer