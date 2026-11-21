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
            isDarkMode: false
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

            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) {
                state.theme = parseInt(storedTheme)
                if (storedTheme === '1') state.isDarkMode = false;
                else if (storedTheme === '2') state.isDarkMode = true;
                else if (storedTheme === '3') {
                    const mediaQuery = window.matchMedia(
                        '(prefers-color-scheme: dark)'
                    ).matches;
                    mediaQuery ? state.isDarkMode = true : state.isDarkMode = false;
                }
            }
        },
        setLoading: (state, action) => {
            state.profileSettingsData.isLoading = action.payload
        },
        setTheme: (state, action) => {
            state.theme = action.payload
            localStorage.setItem('theme', action.payload)
        },
    }
})

export const { updateProfileSettings, loadProfileSettings, setLoading, setTheme, setIsDarkMode } = settingsSlice.actions
export default settingsSlice.reducer