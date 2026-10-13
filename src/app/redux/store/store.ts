import { configureStore } from "@reduxjs/toolkit";
import commentsReducer from "./../slices"
import authReducer from "./../slices/authSlice"
const store = configureStore({reducer: {
        comments: commentsReducer,
        auth:authReducer
    },
});

export default store;