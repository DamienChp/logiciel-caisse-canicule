import { create } from "zustand";

export const useProductStore = create((set) => ({

    products: [],

    // ==========================================
    // SET PRODUCTS
    // ==========================================

    setProducts: (products) =>
        set({
            products: Array.isArray(products)
                ? products
                : []
        }),


    // ==========================================
    // CREER UN PRODUIT
    // ==========================================

    createProduct: async (newProduct) => {

        if (
            !newProduct.name ||
            newProduct.priceHT === undefined ||
            newProduct.priceTTC === undefined
        ) {
            return {
                success: false,
                message: "All fields are required"
            };
        }

        try {

            const res = await fetch(
                "/api/products",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newProduct)
                }
            );

            const data = await res.json();

            if (!res.ok) {

                return {
                    success: false,
                    message:
                        data.message ||
                        data.detail ||
                        "Erreur lors de la création du produit"
                };

            }

            // DRF peut renvoyer directement le produit
            // ou { data: produit }
            const product =
                data.data ?? data;

            set((state) => ({
                products: [
                    ...state.products,
                    product
                ]
            }));

            return {
                success: true,
                message:
                    "Product created successfully",
                data: product
            };

        } catch (error) {

            console.error(
                "Erreur création produit :",
                error
            );

            return {
                success: false,
                message:
                    "Erreur lors de la création du produit"
            };
        }
    },


    // ==========================================
    // ETAPE 1 → ANALYSER LE FICHIER
    // ==========================================

    analyzeImport: async (file) => {

        if (!file) {
            return {
                success: false,
                message: "Aucun fichier envoyé"
            };
        }

        try {

            const formData = new FormData();

            formData.append(
                "file",
                file
            );

            const res = await fetch(
                "/api/products/import/analyze/",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await res.json();

            if (!res.ok) {

                return {
                    success: false,
                    message:
                        data.message ||
                        data.detail ||
                        "Erreur lors de l'analyse du fichier"
                };

            }

            return {
                success: true,
                rayons:
                    data.rayons ?? [],
                familles:
                    data.familles ?? []
            };

        } catch (error) {

            console.error(
                "Erreur analyse import :",
                error
            );

            return {
                success: false,
                message:
                    "Erreur lors de l'analyse du fichier"
            };
        }
    },


    // ==========================================
    // ETAPE 3 → IMPORTER LE STOCK
    // ==========================================

    importStock: async (
        file,
        rayons,
        familles
    ) => {

        if (!file) {

            return {
                success: false,
                message: "Aucun fichier envoyé"
            };

        }

        try {

            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            formData.append(
                "rayons",
                JSON.stringify(rayons)
            );

            formData.append(
                "familles",
                JSON.stringify(familles)
            );

            const res = await fetch(
                "/api/products/import/",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data =
                await res.json();

            if (!res.ok) {

                return {
                    success: false,
                    message:
                        data.message ||
                        data.detail ||
                        "Erreur lors de l'import"
                };

            }

            // ==========================================
            // ACTUALISER LES PRODUITS
            // ==========================================

            const productsRes =
                await fetch(
                    "/api/products"
                );

            const productsData =
                await productsRes.json();

            if (productsRes.ok) {

                let products = [];

                if (Array.isArray(productsData)) {

                    products =
                        productsData;

                } else if (
                    Array.isArray(
                        productsData.results
                    )
                ) {

                    products =
                        productsData.results;

                } else if (
                    Array.isArray(
                        productsData.data
                    )
                ) {

                    products =
                        productsData.data;

                }

                set({
                    products
                });
            }

            return {
                success: true,
                message:
                    data.message ||
                    "Import réussi",
                data
            };

        } catch (error) {

            console.error(
                "Erreur import produits :",
                error
            );

            return {
                success: false,
                message:
                    "Erreur lors de l'import"
            };
        }
    },


    // ==========================================
    // RECUPERER TOUS LES PRODUITS
    // ==========================================

    getAllProducts: async () => {

        try {

            const res =
                await fetch(
                    "/api/products"
                );

            const data =
                await res.json();

            if (!res.ok) {

                throw new Error(
                    data.message ||
                    data.detail ||
                    "Erreur lors de la récupération des produits"
                );

            }

            let products = [];

            // DRF retourne directement une liste
            if (Array.isArray(data)) {

                products = data;

            // DRF avec pagination
            } else if (
                Array.isArray(data.results)
            ) {

                products =
                    data.results;

            // Compatibilité ancienne API
            } else if (
                Array.isArray(data.data)
            ) {

                products =
                    data.data;
            }

            set({
                products
            });

        } catch (error) {

            console.error(
                "Erreur récupération produits :",
                error
            );

            set({
                products: []
            });
        }
    }

}));