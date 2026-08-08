import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) => ({
            client: null,
            cart: [],
            cartDiscount: 0,

            setClient: (client) =>
                set({ client }),

            addProduct: (product) =>
                set((state) => {
                    const existingProduct = state.cart.find(
                        (item) =>
                            item._id === product._id &&
                            item.size === product.size
                    );

                    if (existingProduct) {
                        return {
                            cart: state.cart.map((item) =>
                                item._id === product._id &&
                                item.size === product.size
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
                                quantity: 1,
                                discount: 0
                            }
                        ]
                    };
                }),

            removeProduct: (id) =>
                set((state) => ({
                    cart: state.cart.filter(
                        (product) => product._id !== id
                    )
                })),

            // Remise sur un article
            setProductDiscount: (id, discount) =>
                set((state) => ({
                    cart: state.cart.map((product) =>
                        product._id === id
                            ? {
                                ...product,
                                discount: Number(discount) || 0
                            }
                            : product
                    )
                })),

            // Remise sur tout le panier
            setCartDiscount: (discount) =>
                set({
                    cartDiscount: Number(discount) || 0
                }),

            // Sous-total avant remise
            getSubtotal: () => {
                return get().cart.reduce(
                    (total, product) =>
                        total +
                        product.priceTTC * product.quantity,
                    0
                );
            },

            // Total après remises articles
            getProductsTotal: () => {
                return get().cart.reduce((total, product) => {
                    const productTotal =
                        product.priceTTC * product.quantity;

                    const discount =
                        productTotal * (product.discount || 0) / 100;

                    return total + productTotal - discount;
                }, 0);
            },

            // Total final après remise panier
            getTotal: () => {
                const productsTotal = get().getProductsTotal();

                const cartDiscount =
                    productsTotal * (get().cartDiscount || 0) / 100;

                return productsTotal - cartDiscount;
            },

            clearCart: () =>
                set({
                    cart: [],
                    cartDiscount: 0,
                    client: null
                })
        }),
        {
            name: "cart-storage"
        }
    )
);