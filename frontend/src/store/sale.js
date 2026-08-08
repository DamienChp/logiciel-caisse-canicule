import { create } from "zustand";

export const useSaleStore = create((set) => ({
    loading: false,
    error: null,

    createSale: async (saleData) => {
        set({
            loading: true,
            error: null
        });

        try {
            const response = await fetch("/api/sales", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(saleData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Erreur lors de la création de la vente"
                );
            }

            set({
                loading: false
            });

            return {
                success: true,
                sale: data.sale
            };

        } catch (error) {
            console.error(
                "Erreur création vente :",
                error
            );

            set({
                loading: false,
                error: error.message
            });

            return {
                success: false,
                error: error.message
            };
        }
    }
}));