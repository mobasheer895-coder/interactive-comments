import { createSlice } from "@reduxjs/toolkit";

interface CurrentUser {
    id: number;
    role: "USER" | "ADMIN";
}

interface AuthState {
    currentUser: CurrentUser | null;
}

const initialState: AuthState = {
    currentUser: null,
};

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setCurrentUser: (state, action) => {
        state.currentUser = action.payload
    },

    clearCurrentUser: (state) => {
        state.currentUser = null
    },
    }
})

export const { setCurrentUser, clearCurrentUser } = authSlice.actions;

export default authSlice.reducer;