import { create } from "zustand";

export const useSaleStore = create((set) => ({
    sales: [],
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
    },

    getAllSales: async () => {

        set({
            loading: true,
            error: null
        });

        try {

            const response = await fetch("/api/sales");

            console.log("RESPONSE :", response);

            const data = await response.json();

            console.log("DATA API SALES :", data);
            console.log("DATA.DATA :", data.data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Erreur lors de la récupération des ventes"
                );
            }

            set({
                sales: data.data,
                loading: false
            });

            return {
                success: true,
                sales: data.data
            };

        } catch (error) {

            console.error(
                "Erreur récupération ventes :",
                error
            );

            set({
                loading: false,
                error: error.message
            });

            return {
                success: false,
                error: error.message,
                sales: []
            };
        }
    },

    sendSaleReceipt: async (saleId) => {

        set({
            loading: true,
            error: null
        });


        try {

            const response = await fetch(`/api/sales/${saleId}/send-receipt`,
                {
                    method: "POST"
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Erreur lors de l'envoi du reçu"
                );

            }

            set({
                loading: false
            });

            return {
                success: true,
                message: data.message
            };


        } catch (error) {

            console.error(
                "Erreur envoi reçu :",
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