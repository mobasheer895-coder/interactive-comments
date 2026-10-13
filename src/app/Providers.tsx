"use client";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./redux/store/store";
import AuthInitializer from "./components/auth/AuthInitializer";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <Provider store={store}>
            <AuthInitializer/>
            {children}
            <ToastContainer position="top-center" />
        </Provider>
    );
}
