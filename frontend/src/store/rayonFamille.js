import { create } from "zustand";

export const useRayonStore = create((set) => ({
    rayons: [],

    setRayons: (rayons) => set({ rayons }),

    getAllRayons: async () => {
        try {

            const res = await fetch('/api/rayons');

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Erreur lors de la récupération des marques"
                );
            }

            set({
                rayons: data.data
            });

        } catch (error) {

            console.error(
                "Erreur récupération marques :",
                error
            );

        }
    },
}))

export const useFamilleStore = create((set) => ({
    familles: [],

    setFamilles: (familles) => set({ familles }),

    getAllFamilles: async () => {
        try {

            const res = await fetch('/api/familles');

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Erreur lors de la récupération des marques"
                );
            }

            set({
                familles: data.data
            });

        } catch (error) {

            console.error(
                "Erreur récupération marques :",
                error
            );

        }
    },
}))