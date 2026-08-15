import jwt from "jsonwebtoken";

// ======================================================
// GÉNÈRE UN JWT ET LE POSE DANS UN COOKIE HTTPONLY
// ======================================================

export const generateToken = (userId, res) => {

    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {

        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours

        httpOnly: true, // inaccessible en JS côté client (protection XSS)

        sameSite: "strict", // protection CSRF

        secure: process.env.NODE_ENV === "production" // HTTPS uniquement en prod

    });

    return token;

};