import {create} from 'zustand' ;

export const useCustomerStore = create((set) => ({
    customers: [],
    setCustomers: (customers) => set({ customers }),
    createCustomer: async (newCustomer) => {
        if (!newCustomer.first_name ||
            !newCustomer.last_name ||
            !newCustomer.email ||
            !newCustomer.phone_number) {
                return { success: false, message: 'All fields are required' };
            }

            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCustomer)
            });

            const data = await res.json();
            set((state) => ({
                customers: [...state.customers, data.data]
            }));

            return { success: true, message: 'Customer created successfully' };
    },
    getAllCustomers: async () => {
        try {
            const response = await fetch("/api/customers");

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des clients");
            }

            const data = await response.json();

            set({
                customers: data.data
            });

        } catch (error) {
            console.error("Erreur customers :", error);
        }
    },
    // addCustomer: (customer) => set((state) => ({
    //     customers: [...state.customers, customer]
    // })),
    deleteCustomer: async (id) => {
        const response = await fetch(`/api/customers/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression du client");
        }

        set((state) => ({
            customers: state.customers.filter(
                (customer) => customer._id !== id
            ),
        }));
    },
    updateCustomer: async (updatedCustomer) => {

        const response = await fetch(
            `/api/customers/${updatedCustomer._id}`,
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

        const customer = result.data;

        set((state) => ({
            customers: state.customers.map((current) =>
                current._id === customer._id
                    ? customer
                    : current
            )
        }));

        return customer;
    },
}));