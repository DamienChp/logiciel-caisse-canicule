import { create } from "zustand";
import { persist } from "zustand/middleware";

const createCart = (id) => ({
    id,
    client: null,
    cart: [],
    cartDiscount: 0
});

export const useCartStore = create(
    persist(
        (set, get) => ({

            // ======================================================
            // LES 3 VENTES
            // ======================================================

            carts: [
                createCart("1"),
                createCart("2"),
                createCart("3")
            ],

            // Vente actuellement affichée
            activeCartId: "1",


            // ======================================================
            // CHANGER DE VENTE
            // ======================================================

            setActiveCart: (cartId) => {
                set({
                    activeCartId: cartId
                });
            },


            // ======================================================
            // RÉCUPÉRER LA VENTE ACTIVE
            // ======================================================

            getActiveCart: () => {
                const { carts, activeCartId } = get();

                return carts.find(
                    (cart) => cart.id === activeCartId
                );
            },


            // ======================================================
            // CLIENT
            // ======================================================

            setClient: (client) => 
                set((state) => ({
                    carts: state.carts.map((cart) =>
                        cart.id === state.activeCartId
                            ? {
                                ...cart,
                                client
                            }
                            : cart
                    )
                })),


            // ======================================================
            // AJOUTER UN PRODUIT
            // ======================================================

            addProduct: (product) =>
                set((state) => ({
                    carts: state.carts.map((cart) => {

                        if (cart.id !== state.activeCartId) {
                            return cart;
                        }

                        const existingProduct = cart.cart.find(
                            (item) =>
                                item.id === product.id &&
                                item.size === product.size
                        );

                        // Produit déjà présent
                        if (existingProduct) {

                            return {
                                ...cart,

                                cart: cart.cart.map((item) =>
                                    item.id === product.id &&
                                    item.size === product.size
                                        ? {
                                            ...item,
                                            quantity:
                                                item.quantity + 1
                                        }
                                        : item
                                )
                            };
                        }

                        // Nouveau produit
                        return {
                            ...cart,

                            cart: [
                                ...cart.cart,
                                {
                                    ...product,
                                    quantity: 1,
                                    discount: 0
                                }
                            ]
                        };
                    })
                })),


            // ======================================================
            // SUPPRIMER UN PRODUIT
            // ======================================================

            removeProduct: (id) =>
                set((state) => ({
                    carts: state.carts.map((cart) =>
                        cart.id === state.activeCartId
                            ? {
                                ...cart,
                                cart: cart.cart.filter(
                                    (product) =>
                                        product.id !== id
                                )
                            }
                            : cart
                    )
                })),


            // ======================================================
            // REMISE SUR UN ARTICLE
            // ======================================================

            setProductDiscount: (id, discount) =>
                set((state) => ({
                    carts: state.carts.map((cart) =>
                        cart.id === state.activeCartId
                            ? {
                                ...cart,

                                cart: cart.cart.map((product) =>
                                    product.id === id
                                        ? {
                                            ...product,
                                            discount:
                                                Number(discount) || 0
                                        }
                                        : product
                                )
                            }
                            : cart
                    )
                })),


            // ======================================================
            // REMISE SUR LE PANIER
            // ======================================================

            setCartDiscount: (discount) =>
                set((state) => ({
                    carts: state.carts.map((cart) =>
                        cart.id === state.activeCartId
                            ? {
                                ...cart,
                                cartDiscount:
                                    Number(discount) || 0
                            }
                            : cart
                    )
                })),


            // ======================================================
            // SOUS-TOTAL
            // ======================================================

            getSubtotal: () => {

                const activeCart = get().getActiveCart();

                if (!activeCart) return 0;

                return activeCart.cart.reduce(
                    (total, product) =>
                        total +
                        product.price_ttc *
                        product.quantity,
                    0
                );
            },


            // ======================================================
            // TOTAL APRÈS REMISES ARTICLES
            // ======================================================

            getProductsTotal: () => {

                const activeCart = get().getActiveCart();

                if (!activeCart) return 0;

                return activeCart.cart.reduce(
                    (total, product) => {

                        const productTotal =
                            product.price_ttc *
                            product.quantity;

                        const discount =
                            productTotal *
                            (product.discount || 0) /
                            100;

                        return (
                            total +
                            productTotal -
                            discount
                        );
                    },
                    0
                );
            },


            // ======================================================
            // TOTAL FINAL
            // ======================================================

            getTotal: () => {

                const activeCart = get().getActiveCart();

                if (!activeCart) return 0;

                const productsTotal =
                    get().getProductsTotal();

                const cartDiscount =
                    productsTotal *
                    (activeCart.cartDiscount || 0) /
                    100;

                return (
                    productsTotal -
                    cartDiscount
                );
            },


            // ======================================================
            // VIDER LA VENTE ACTIVE
            // ======================================================

            clearCart: () =>
                set((state) => ({
                    carts: state.carts.map((cart) =>
                        cart.id === state.activeCartId
                            ? {
                                ...cart,
                                cart: [],
                                cartDiscount: 0,
                                client: null
                            }
                            : cart
                    )
                })

            )

        }),

        {
            name: "cart-storage"
        }
    )
);