import { create } from "zustand";

export const useBrandStore = create((set) => ({
    brands: [],

    // ==========================================
    // SET BRANDS
    // ==========================================

    setBrands: (brands) =>
        set({
            brands: Array.isArray(brands)
                ? brands
                : []
        }),


    // ==========================================
    // CREER UNE MARQUE
    // ==========================================

    createBrand: async (newBrand) => {

        if (!newBrand.name) {
            return {
                success: false,
                message: "Brand name is required"
            };
        }

        try {

            const res = await fetch(
                "/api/brands",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newBrand)
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return {
                    success: false,
                    message:
                        data.message ||
                        data.detail ||
                        "Erreur lors de la création de la marque"
                };
            }

            // DRF peut retourner directement la marque
            // ou { data: marque }
            const brand =
                data.data ?? data;

            set((state) => ({
                brands: [
                    ...state.brands,
                    brand
                ]
            }));

            return {
                success: true,
                message: "Brand created successfully",
                data: brand
            };

        } catch (error) {

            console.error(
                "Erreur création marque :",
                error
            );

            return {
                success: false,
                message:
                    "Impossible de créer la marque"
            };
        }
    },


    // ==========================================
    // RECUPERER TOUTES LES MARQUES
    // ==========================================

    getAllBrands: async () => {

        try {

            const res =
                await fetch("/api/brands");

            const data =
                await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ||
                    data.detail ||
                    "Erreur lors de la récupération des marques"
                );
            }

            let brands = [];

            // DRF sans pagination
            if (Array.isArray(data)) {

                brands = data;

            // DRF avec pagination
            } else if (
                Array.isArray(data.results)
            ) {

                brands = data.results;

            // Compatibilité ancienne API
            } else if (
                Array.isArray(data.data)
            ) {

                brands = data.data;
            }

            set({
                brands
            });

        } catch (error) {

            console.error(
                "Erreur récupération marques :",
                error
            );

            set({
                brands: []
            });
        }
    },


    // ==========================================
    // MODIFIER UNE MARQUE
    // ==========================================

    updateBrand: async (
        id,
        updatedBrand
    ) => {

        try {

            const res = await fetch(
                `/api/brands/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify(
                            updatedBrand
                        )
                }
            );

            const data =
                await res.json();

            if (!res.ok) {

                return {
                    success: false,
                    message:
                        data.message ||
                        data.detail ||
                        "Erreur lors de la modification"
                };
            }

            const brand =
                data.data ?? data;

            set((state) => ({
                brands: state.brands.map(
                    (currentBrand) => {

                        const currentId =
                            currentBrand._id ??
                            currentBrand.id;

                        return currentId === id
                            ? brand
                            : currentBrand;
                    }
                )
            }));

            return {
                success: true,
                message:
                    "Marque modifiée avec succès",
                data: brand
            };

        } catch (error) {

            console.error(
                "Erreur modification marque :",
                error
            );

            return {
                success: false,
                message:
                    "Impossible de modifier la marque"
            };
        }
    },


    // ==========================================
    // SUPPRIMER UNE MARQUE
    // ==========================================

    deleteBrand: async (id) => {

        try {

            const res = await fetch(
                `/api/brands/${id}`,
                {
                    method: "DELETE"
                }
            );

            // DELETE DRF retourne souvent
            // 204 No Content.
            // Il ne faut donc PAS forcément faire
            // await res.json() ici.

            if (!res.ok) {

                let data = {};

                try {
                    data = await res.json();
                } catch {
                    // Pas de JSON dans la réponse
                }

                return {
                    success: false,
                    message:
                        data.message ||
                        data.detail ||
                        "Erreur lors de la suppression"
                };
            }

            set((state) => ({
                brands: state.brands.filter(
                    (brand) => {

                        const brandId =
                            brand._id ??
                            brand.id;

                        return brandId !== id;
                    }
                )
            }));

            return {
                success: true,
                message:
                    "Marque supprimée avec succès"
            };

        } catch (error) {

            console.error(
                "Erreur suppression marque :",
                error
            );

            return {
                success: false,
                message:
                    "Impossible de supprimer la marque"
            };
        }
    }
}));