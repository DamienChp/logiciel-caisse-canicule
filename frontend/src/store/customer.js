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
        const res = await fetch('/api/customers');
        const data = await res.json();
        set({ customers: data.data });

    },
    // addCustomer: (customer) => set((state) => ({
    //     customers: [...state.customers, customer]
    // })),
    // removeCustomer: (customerId) => set((state) => ({
    //     customers: state.customers.filter(customer => customer.id !== customerId)
    // })),
    // updateCustomer: (updatedCustomer) => set((state) => ({
    //     customers: state.customers.map(customer =>
    //         customer.id === updatedCustomer.id ? updatedCustomer : customer
    //     )
    // }))
}));