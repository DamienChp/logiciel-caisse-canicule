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
            error: null,
        });

        try {
            const response = await fetch(
                "/api/cash-registers/open",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        opening_cash: openingCash,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Erreur lors de l'ouverture de la caisse."
                );
            }

            set({
                cashRegister: data,
                loading: false,
            });

            return data;

        } catch (error) {
            set({
                error: error.message,
                loading: false,
            });

            throw error;
        }
    },
}));
