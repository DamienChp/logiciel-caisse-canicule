import { create } from "zustand";

export const useCustomerStore = create((set) => ({
    customers: [],

    setCustomers: (customers) => {
        set({
            customers: Array.isArray(customers) ? customers : []
        });
    },

    // ======================================================
    // CRÉER UN CLIENT
    // ======================================================

    createCustomer: async (newCustomer) => {
        if (
            !newCustomer.first_name ||
            !newCustomer.last_name ||
            !newCustomer.email ||
            !newCustomer.phone_number
        ) {
            return {
                success: false,
                message: "All fields are required"
            };
        }

        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newCustomer)
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message:
                        data.message ||
                        data.detail ||
                        "Erreur lors de la création du client"
                };
            }

            // DRF peut renvoyer directement le client
            // ou une structure { data: client }
            const customer = data.data ?? data;

            set((state) => ({
                customers: [
                    ...state.customers,
                    customer
                ]
            }));

            return {
                success: true,
                message: "Customer created successfully",
                data: customer
            };

        } catch (error) {
            console.error(
                "Erreur création customer :",
                error
            );

            return {
                success: false,
                message: "Erreur lors de la création du client"
            };
        }
    },

    // ======================================================
    // RÉCUPÉRER TOUS LES CLIENTS
    // ======================================================

    getAllCustomers: async () => {
        try {
            const response = await fetch(
                "/api/customers"
            );

            if (!response.ok) {
                throw new Error(
                    "Erreur lors de la récupération des clients"
                );
            }

            const data = await response.json();

            console.log(
                "Réponse API customers :",
                data
            );

            // DRF sans pagination :
            // [
            //   {...},
            //   {...}
            // ]

            // DRF avec pagination :
            // {
            //   count: ...,
            //   results: [...]
            // }

            // Ancienne API :
            // {
            //   data: [...]
            // }

            let customers = [];

            if (Array.isArray(data)) {
                customers = data;
            } else if (Array.isArray(data.results)) {
                customers = data.results;
            } else if (Array.isArray(data.data)) {
                customers = data.data;
            }

            set({
                customers
            });

        } catch (error) {
            console.error(
                "Erreur customers :",
                error
            );

            set({
                customers: []
            });
        }
    },

    // ======================================================
    // SUPPRIMER UN CLIENT
    // ======================================================

    deleteCustomer: async (id) => {
        try {
            const response = await fetch(
                `/api/customers/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Erreur lors de la suppression du client"
                );
            }

            set((state) => ({
                customers: state.customers.filter(
                    (customer) => customer.id !== id
                )
            }));

        } catch (error) {
            console.error(
                "Erreur suppression customer :",
                error
            );

            throw error;
        }
    },

    // ======================================================
    // MODIFIER UN CLIENT
    // ======================================================

    updateCustomer: async (updatedCustomer) => {
        try {
            const id = updatedCustomer.id;

            const response = await fetch(
                `/api/customers/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedCustomer)
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Erreur lors de la modification du client"
                );
            }

            const result = await response.json();

            const customer =
                result.data ?? result;

            set((state) => ({
                customers: state.customers.map(
                    (current) => {
                        const currentId = current.id;

                        return currentId === id
                            ? customer
                            : current;
                    }
                )
            }));

            return customer;

        } catch (error) {
            console.error(
                "Erreur modification customer :",
                error
            );

            throw error;
        }
    }
}));