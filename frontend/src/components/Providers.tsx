"use client";
import React from 'react';
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { CartProvider } from "@/context/CartContext";

function NotificationWrapper({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    return (
        <NotificationProvider userId={user?.id}>
            {children}
        </NotificationProvider>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <NotificationWrapper>
                <CartProvider>
                    {children}
                </CartProvider>
            </NotificationWrapper>
        </AuthProvider>
    );
}
