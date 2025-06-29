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
        }
    }
})

export const { updateProfileSettings, loadProfileSettings, setLoading } = settingsSlice.actions
export default settingsSlice.reducer