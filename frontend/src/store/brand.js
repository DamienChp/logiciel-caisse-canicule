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
        try {

            const res = await fetch('/api/brands');

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Erreur lors de la récupération des marques"
                );
            }

            set({
                brands: data.data
            });

        } catch (error) {

            console.error(
                "Erreur récupération marques :",
                error
            );

        }
    },

    updateBrand: async (id, updatedBrand) => { 
        try { 
            const res = await fetch(`/api/brands/${id}`, { 
                method: "PUT", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(updatedBrand) 
            }); 
            
            const data = await res.json(); 
            
            if (!res.ok) { 
                return { 
                    success: false, 
                    message: data.message || "Erreur lors de la modification" 
                }; 
            } 
                    
            // Met à jour directement la marque dans Zustand 
            set((state) => ({ 
                brands: state.brands.map((brand) => brand._id === id ? data.data : brand ) 
            })); 
            
            return { 
                success: true, 
                message: "Marque modifiée avec succès" 
            }; 
        } catch (error) { 
            console.error("Erreur modification marque :", error); 
            
            return { 
                success: false, 
                message: "Impossible de modifier la marque" 
            }; 
        } 
    },

    deleteBrand: async (id) => {
        try {
            const res = await fetch(`/api/brands/${id}`, {
                method: "DELETE"
            });

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message: data.message || "Erreur lors de la suppression"
                };
            }

            set((state) => ({
                brands: state.brands.filter(
                    (brand) => brand._id !== id
                )
            }));

            return {
                success: true,
                message: "Marque supprimée avec succès"
            };

        } catch (error) {
            console.error("Erreur suppression marque :", error);

            return {
                success: false,
                message: "Impossible de supprimer la marque"
            };
        }
    },
}));