import { create } from "zustand";

export const useProductStore = create((set) => ({

    products: [],

    setProducts: (products) =>
        set({ products }),


    createProduct: async (newProduct) => {

        if (
            !newProduct.name ||
            !newProduct.priceHT ||
            !newProduct.priceTTC
        ) {
            return {
                success: false,
                message: "All fields are required"
            };
        }

        const res = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        });

        const data = await res.json();

        set((state) => ({
            products: [
                ...state.products,
                data.data
            ]
        }));

        return {
            success: true,
            message: "Product created successfully"
        };
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

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

        const res = await fetch(
            "/api/products/import/analyze",
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
                    "Erreur lors de l'analyse du fichier"
            };
        }

        return {
            success: true,
            rayons: data.rayons || [],
            familles: data.familles || []
        };
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

        const formData = new FormData();

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
            "/api/products/import",
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
                    "Erreur lors de l'import"
            };

        }


        // Actualisation des produits
        const productsRes =
            await fetch("/api/products");


        const productsData =
            await productsRes.json();


        if (productsRes.ok) {

            set({
                products:
                    productsData.data
            });

        }


        return {

            success: true,

            message:
                data.message,

            data

        };

    },


    // ==========================================
    // RECUPERER TOUS LES PRODUITS
    // ==========================================

    getAllProducts: async () => {

        try {

            const res =
                await fetch("/api/products");

            const data =
                await res.json();


            if (!res.ok) {

                throw new Error(
                    data.message ||
                    "Erreur lors de la récupération des produits"
                );

            }


            set({
                products:
                    data.data
            });


        } catch (error) {

            console.error(
                "Erreur récupération produits :",
                error
            );

        }

    }

}));