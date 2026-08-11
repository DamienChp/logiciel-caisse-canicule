// import nodemailer from "nodemailer";
// // import dotenv from "dotenv";

// // dotenv.config();


// const transporter = nodemailer.createTransport({
//     service: "gmail",

//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });


// export const sendReceiptByEmail = async ({email, pdfBuffer, saleNumber}) => {
//     console.log("EMAIL_USER", process.env.EMAIL_USER);
//     console.log("EMAIL_PASSWORD", process.env.EMAIL_PASSWORD);

//     await transporter.sendMail({

//         from: process.env.EMAIL_USER,

//         to: email,

//         subject: `Votre reçu - Vente n° ${String(
//             saleNumber
//         ).padStart(6, "0")}`,

//         text: `
//             Bonjour,

//             Veuillez trouver ci-joint votre reçu
//             pour votre achat.

//             Merci pour votre visite !
//         `,

//         attachments: [
//             {
//                 filename:
//                     `recu-${String(
//                         saleNumber
//                     ).padStart(6, "0")}.pdf`,

//                 content: pdfBuffer,

//                 contentType:
//                     "application/pdf"
//             }
//         ]
//     });
// };


import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});


const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }

});


export const sendReceiptByEmail = async ({
    email,
    pdfBuffer,
    saleNumber
}) => {

    // Test de connexion SMTP
    await transporter.verify();

    console.log(
        "Connexion Gmail OK"
    );


    await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: email,

        subject:
            `Votre reçu chez CANICULE - Vente n° ${String(
                saleNumber
            ).padStart(6, "0")}`,

        text: `
Bonjour,

Veuillez trouver ci-joint votre reçu
pour votre achat chez CANICULE Bandol.

Merci pour votre visite !
        `,

        attachments: [
            {
                filename:
                    `recu-${String(
                        saleNumber
                    ).padStart(6, "0")}.pdf`,

                content: pdfBuffer,

                contentType:
                    "application/pdf"
            }
        ]
    });
};