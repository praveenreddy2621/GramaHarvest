"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    unit: string;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    cartTotal: number;
    subTotal: number;
    cartCount: number;
    isCartOpen: boolean;
    toggleCart: () => void;
    coupon: { code: string; discount: number; type: string; description?: string } | null;
    applyCoupon: (code: string, discount: number, type: string, description?: string) => void;
    removeCoupon: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [coupon, setCoupon] = useState<{ code: string; discount: number; type: string; description?: string } | null>(null);

    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("gramaharvest_cart");
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
        const savedCoupon = localStorage.getItem("gramaharvest_coupon");
        if (savedCoupon) {
            setCoupon(JSON.parse(savedCoupon));
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("gramaharvest_cart", JSON.stringify(items));
        }
    }, [items, isMounted]);

    useEffect(() => {
        if (isMounted) {
            if (coupon) {
                localStorage.setItem("gramaharvest_coupon", JSON.stringify(coupon));
            } else {
                localStorage.removeItem("gramaharvest_coupon");
            }
        }
    }, [coupon, isMounted]);

    const addToCart = (product: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    return { ...item, quantity: Math.max(1, item.quantity + delta) };
                }
                return item;
            })
        );
    };

    const clearCart = () => {
        setItems([]);
        setCoupon(null);
    };

    const toggleCart = () => setIsCartOpen((prev) => !prev);

    const applyCoupon = (code: string, discount: number, type: string, description?: string) => {
        setCoupon({ code, discount, type, description });
    };

    const removeCoupon = () => {
        setCoupon(null);
    };

    const subTotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const cartTotal = coupon
        ? (coupon.type === 'percentage'
            ? subTotal - (subTotal * coupon.discount / 100)
            : subTotal - coupon.discount)
        : subTotal;

    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                isCartOpen,
                toggleCart,
                coupon,
                applyCoupon,
                removeCoupon,
                subTotal
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
