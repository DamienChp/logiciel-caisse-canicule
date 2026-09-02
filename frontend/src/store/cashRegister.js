import { create } from "zustand";

export const useCashRegisterStore = create((set) => ({
    cashRegister: null,
    loading: false,
    error: null,

    setCashRegister: (cashRegister) =>
        set({ cashRegister }),

    openCashRegister: async (openingCash) => {

        set({
            loading: true,
            error: null
        });

        try {

            const response = await fetch(
                "/api/cash-register/open",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        openingCash
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Erreur lors de l'ouverture"
                );
            }

            set({
                cashRegister: data,
                loading: false
            });

            return data;

        } catch (error) {

            set({
                error: error.message,
                loading: false
            });

            throw error;
        }
    }
}));