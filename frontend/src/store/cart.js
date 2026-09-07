import { create } from "zustand";
import { persist } from "zustand/middleware";

const createCart = (id) => ({
    id,
    client: null,
    cart: [],
    cartDiscount: 0,
    cartDiscountType: "percent" // "percent" ou "amount"
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
            // OFFERT (boolean) : remise à 100% ou restauration
            // ======================================================

            toggleGift: (id, size) =>
                set((state) => ({
                    carts: state.carts.map((cart) =>
                        cart.id === state.activeCartId
                            ? {
                                ...cart,
                                cart: cart.cart.map((product) => {
                                    if (
                                        product._id !== id ||
                                        product.size !== size
                                    ) {
                                        return product;
                                    }

                                    const isGift = product.discount === 100;

                                    return {
                                        ...product,
                                        discount: isGift
                                            ? (product.previousDiscount || 0)
                                            : 100,
                                        previousDiscount: isGift
                                            ? product.previousDiscount
                                            : product.discount
                                    };
                                })
                            }
                            : cart
                    )
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
            // MODIFIER LA QUANTITÉ D'UN PRODUIT
            // ======================================================

            setProductQuantity: (id, size, quantity) =>
                set((state) => ({
                    carts: state.carts.map((cart) =>
                        cart.id === state.activeCartId
                            ? {
                                ...cart,
                                cart: cart.cart.map((product) =>
                                    product.id === id
                                    product.size === size
                                        ? {
                                            ...product,
                                            quantity: Math.max(
                                                1,
                                                Number(quantity) || 1
                                            )
                                        }
                                        : product
                                )
                            }
                            : cart
                    )
                })),


            // ======================================================
            // REMISE SUR UN ARTICLE
            // ======================================================

            setProductDiscount: (id, size, discount) =>
                set((state) => ({
                    carts: state.carts.map((cart) =>
                        cart.id === state.activeCartId
                            ? {
                                ...cart,

                                cart: cart.cart.map((product) =>
                                    product._id === id &&
                                    product.size === size
                                        ? {
                                            ...product,
                                            discount: Math.min(
                                                100,
                                                Math.max(
                                                    0,
                                                    Number(discount) || 0
                                                )
                                            )
                                        }
                                        : product
                                )
                            }
                            : cart
                    )
                })),


                // ======================================================
                // REMISE SUR LE PANIER (montant)
                // ======================================================

                setCartDiscount: (discount) =>
                    set((state) => ({
                        carts: state.carts.map((cart) => {

                            if (cart.id !== state.activeCartId) {
                                return cart;
                            }

                            const value = Math.max(0, Number(discount) || 0);

                            // Si c'est un pourcentage, on plafonne à 100
                            const finalValue =
                                cart.cartDiscountType === "percent"
                                    ? Math.min(100, value)
                                    : value;

                            return {
                                ...cart,
                                cartDiscount: finalValue
                            };
                        })
                    })),


        // ======================================================
        // TYPE DE REMISE PANIER (% ou €)
        // ======================================================

        setCartDiscountType: (type) =>
            set((state) => ({
                carts: state.carts.map((cart) => {

                    if (cart.id !== state.activeCartId) {
                        return cart;
                    }

                    // Si on repasse en %, on replafonne la valeur existante à 100
                    const clampedDiscount =
                        type === "percent"
                            ? Math.min(100, cart.cartDiscount)
                            : cart.cartDiscount;

                    return {
                        ...cart,
                        cartDiscountType: type,
                        cartDiscount: clampedDiscount
                    };
                })
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

                const productsTotal = get().getProductsTotal();

                const discountAmount =
                    activeCart.cartDiscountType === "percent"
                        ? productsTotal * (activeCart.cartDiscount || 0) / 100
                        : (activeCart.cartDiscount || 0);

                // On empêche un total négatif si la remise en € dépasse le total
                return Math.max(0, productsTotal - discountAmount);
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