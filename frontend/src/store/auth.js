import { create } from "zustand";

// Adapte cette base URL à ton backend
const API_URL = "/api/auth";


export const useAuthStore = create((set) => ({

    authUser: null,

    isCheckingAuth: true,
    isLoggingIn: false,


    // ==================================================
    // VÉRIFIE LA SESSION AU CHARGEMENT DE L'APP
    // ==================================================

    checkAuth: async () => {

        try {

            const response = await fetch("/api/auth/check", {
                credentials: "include"
            });

            if (!response.ok) {

                set({ authUser: null, isCheckingAuth: false });
                return;

            }

            const data = await response.json();

            set({ authUser: data, isCheckingAuth: false });

        } catch (error) {

            console.error("Erreur checkAuth :", error);

            set({ authUser: null, isCheckingAuth: false });

        }

    },


    // ==================================================
    // CONNEXION
    // ==================================================

    login: async (credentials) => {

        set({ isLoggingIn: true });

        try {

            const response = await fetch("/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "include",

                body: JSON.stringify(credentials)

            });

            const data = await response.json();

            if (!response.ok) {

                throw new Error(data.message || "Échec de la connexion.");

            }

            set({ authUser: data, isLoggingIn: false });

            return { success: true };

        } catch (error) {

            set({ isLoggingIn: false });

            return { success: false, message: error.message };

        }

    },


    // ==================================================
    // DÉCONNEXION
    // ==================================================

    logout: async () => {

        try {

            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            set({ authUser: null });

        } catch (error) {

            console.error("Erreur logout :", error);

        }

    }

}));