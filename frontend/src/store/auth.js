import { create } from "zustand";

const API_URL = "/api/auth";

const getCsrfToken = async () => {
    const response = await fetch(
        `${API_URL}/csrf`,
        {
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error(
            "Impossible de récupérer le token CSRF."
        );
    }

    const data = await response.json();

    return data.csrfToken;
};

export const useAuthStore = create((set) => ({
    authUser: null,

    isCheckingAuth: true,
    isLoggingIn: false,

    // ==================================================
    // CHECK AUTH
    // ==================================================

    checkAuth: async () => {
        try {
            const response = await fetch(
                `${API_URL}/check`,
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {
                set({
                    authUser: null,
                    isCheckingAuth: false
                });
                return;
            }

            const data = await response.json();

            set({
                authUser: data,
                isCheckingAuth: false
            });

        } catch (error) {
            console.error(
                "Erreur checkAuth :",
                error
            );

            set({
                authUser: null,
                isCheckingAuth: false
            });
        }
    },

    // ==================================================
    // LOGIN
    // ==================================================

    login: async (credentials) => {
        set({
            isLoggingIn: true
        });

        try {
            const csrfToken = await getCsrfToken();

            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken
                    },

                    credentials: "include",

                    body: JSON.stringify(credentials)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.detail ||
                    "Échec de la connexion."
                );
            }

            const user =
                data.user ??
                data.data ??
                data;

            set({
                authUser: user,
                isLoggingIn: false
            });

            return {
                success: true,
                user
            };

        } catch (error) {
            set({
                isLoggingIn: false
            });

            return {
                success: false,
                message: error.message
            };
        }
    },

    // ==================================================
    // LOGOUT
    // ==================================================

    logout: async () => {
        try {
            const csrfToken = await getCsrfToken();

            const response = await fetch(
                `${API_URL}/logout`,
                {
                    method: "POST",

                    headers: {
                        "X-CSRFToken": csrfToken
                    },

                    credentials: "include"
                }
            );

            if (!response.ok) {
                const data = await response.json();

                return {
                    success: false,
                    message:
                        data.message ||
                        data.detail ||
                        "Erreur lors de la déconnexion"
                };
            }

            set({
                authUser: null
            });

            return {
                success: true
            };

        } catch (error) {
            console.error(
                "Erreur logout :",
                error
            );

            return {
                success: false,
                message:
                    "Impossible de se déconnecter."
            };
        }
    }
}));