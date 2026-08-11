import PDFDocument from "pdfkit";

export const generateReceiptPDF = (sale) => {

    return new Promise((resolve, reject) => {

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        const buffers = [];

        doc.on("data", (buffer) => {
            buffers.push(buffer);
        });

        doc.on("end", () => {
            const pdfBuffer = Buffer.concat(buffers);

            resolve(pdfBuffer);
        });

        doc.on("error", reject);


        // =========================
        // EN-TÊTE
        // =========================

        doc
            .fontSize(20)
            .text("CANICULE", {
                align: "center"
            });

        doc.moveDown();

        doc
            .fontSize(12)
            .text(
                `Vente n° ${String(
                    sale.saleNumber
                ).padStart(6, "0")}`
            );

        doc.text(
            `Date : ${new Date(
                sale.createdAt
            ).toLocaleString("fr-FR")}`
        );

        doc.moveDown();


        // =========================
        // CLIENT
        // =========================

        if (sale.customer) {

            doc
                .fontSize(12)
                .text(
                    `Client : ${
                        sale.customer.first_name
                    } ${
                        sale.customer.last_name
                    }`
                );

            if (sale.customer.email) {
                doc.text(
                    `Email : ${
                        sale.customer.email
                    }`
                );
            }

            if (sale.customer.phone_number) {
                doc.text(
                    `Téléphone : ${
                        sale.customer.phone_number
                    }`
                );
            }

            doc.moveDown();
        }


        // =========================
        // PRODUITS
        // =========================

        doc
            .fontSize(14)
            .text("Produits");

        doc.moveDown(0.5);


        sale.products.forEach((item) => {

            const productName =
                item.product?.name ||
                "Produit";

            const quantity =
                item.quantity;

            const price =
                item.priceTTC;

            const discount =
                item.discount || 0;

            doc
                .fontSize(11)
                .text(
                    `${productName} x${quantity}`
                );

            doc.text(
                `${price.toFixed(2)} €`
            );

            if (discount > 0) {
                doc.text(
                    `Remise : -${discount}%`
                );
            }

            doc.moveDown(0.5);
        });


        // =========================
        // TOTAL
        // =========================

        doc.moveDown();

        doc
            .fontSize(14)
            .text(
                `Remise panier : ${
                    sale.cartDiscount || 0
                }%`
            );

        doc.moveDown(0.5);

        doc
            .fontSize(18)
            .text(
                `TOTAL : ${
                    sale.total.toFixed(2)
                } €`
            );


        // =========================
        // PAIEMENT
        // =========================

        doc.moveDown();

        const paymentLabels = {
            card: "CB",
            cash: "Espèces",
            cheque: "Chèque"
        };

        doc
            .fontSize(12)
            .text(
                `Paiement : ${
                    paymentLabels[
                        sale.paymentMethod
                    ] || sale.paymentMethod
                }`
            );


        // =========================
        // FOOTER
        // =========================

        doc.moveDown(3);

        doc
            .fontSize(10)
            .text(
                "Merci pour votre visite !",
                {
                    align: "center"
                }
            );


        doc.end();
    });
};