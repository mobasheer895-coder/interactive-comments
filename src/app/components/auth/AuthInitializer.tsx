"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    setCurrentUser,
    clearCurrentUser,
} from "@/app/redux/slices/authSlice";
import { getCurrentUser } from "@/app/apiCalls/auth";

export default function AuthInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        async function initializeAuth() {
            try {
                const user = await getCurrentUser();

                if (user) {
                    dispatch(setCurrentUser(user));
                } else {
                    dispatch(clearCurrentUser());
                }
            } catch (error) {
                console.error("Failed to initialize authentication:", error);
            }
        }

        initializeAuth();
    }, [dispatch]);

    return null;
}
