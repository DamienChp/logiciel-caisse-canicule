import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) => ({
            client: null,
            cart: [],

            setClient: (client) =>
                set({ client }),

            addProduct: (product) =>
                set((state) => {

                    const existing = state.cart.find(
                        item => item._id === product._id
                    );

                    if (existing) {

                        return {
                            cart: state.cart.map(
                                item =>
                                    item._id === product._id
                                        ? {
                                            ...item,
                                            quantity: item.quantity + 1
                                        }
                                        : item
                            )
                        };
                    }

                    return {
                        cart: [
                            ...state.cart,
                            {
                                ...product,
                                quantity: 1
                            }
                        ]
                    };
                }),

            removeProduct: (productId) =>
                set((state) => ({
                    cart: state.cart.filter(
                        item => item._id !== productId
                    )
                })),

            getTotal: () => {
                return get().cart.reduce(
                    (total, product) =>
                        total +
                        product.priceTTC * product.quantity,
                    0
                );
            },

            clearSale: () =>
                set({
                    client: null,
                    cart: []
                })
        }),

        {
            name: "current-sale"
        }
    )
);