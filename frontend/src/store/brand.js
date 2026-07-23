import { create } from "zustand";

export const useBrandStore = create((set) => ({
    brands: [],
    setBrands: (brands) => set({ brands }),
    createBrand: async (newBrand) => {
        if (!newBrand.name) {
            return { success: false, message: 'Brand name is required' };
        }

        const res = await fetch('/api/brands', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBrand)
        });

        const data = await res.json();
        set((state) => ({
            brands: [...state.brands, data.data]
        }));

        return { success: true, message: 'Brand created successfully' };
    },
    getAllBrands: async () => {
        const res = await fetch('/api/brands');
        const data = await res.json();
        set({ brands: data.data});
    }
}));