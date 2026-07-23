import { create } from "zustand";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        if (!newProduct.name ||
            !newProduct.brand ||
            !newProduct.category ||
            !newProduct.gender ||
            !newProduct.size ||
            !newProduct.priceHT ||
            !newProduct.priceTTC ||
            !newProduct.barcode) {
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
    getAllProducts: async () => {
        const res = await fetch('/api/products');
        const data = await res.json();
        set({ products: data.data });

    },
}));