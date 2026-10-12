"use client";

import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./redux/store/store";

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <Provider store={store}>
            {children}
            <ToastContainer position="top-center" />
        </Provider>
    );
}
