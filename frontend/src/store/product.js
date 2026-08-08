import { create } from "zustand";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        if (!newProduct.name ||
            !newProduct.priceHT ||
            !newProduct.priceTTC ) {
                return { success: false, message: 'All fields are required' };
            }

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            const data = await res.json();
            set((state) => ({
                products: [...state.products, data.data]
            }));

            return { success: true, message: 'Product created successfully' };
    },

    importStock: async(file) => {
        if (!file) {
            return {
                success: false,
                message: "Aucun fichier envoyé"
            }
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/products/import",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await res.json();
        
        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Erreur lors de l'import"
            };
        }

        const productsRes = await fetch("/api/products");

        const productsData = await productsRes.json();

        set({ products: productsData.data});

        return {
            success: true,
            message: data.message,
            data
        };
    },

    getAllProducts: async () => {
        try {

            const res = await fetch('/api/products');

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Erreur lors de la récupération des produits"
                );
            }

            set({
                products: data.data
            });

        } catch (error) {

            console.error(
                "Erreur récupération produits :",
                error
            );

        }
    },
}));