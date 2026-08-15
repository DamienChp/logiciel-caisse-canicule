import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";
import customerRoutes from "./routes/customer.route.js";
import brandRoutes from "./routes/brand.route.js";
import saleRoutes from "./routes/sale.route.js"
import authRoutes from "./routes/auth.route.js"

dotenv.config(); // to use the .env file

const app = express();  // create express app
const PORT = process.env.PORT || 5001

app.use(cookieParser());
app.use(express.json()); // allow to accept json data in the body

// routes
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/auth", authRoutes);



// app.listen(PORT, () => {
//   connectDB(); // connect to the database
//   console.log(`server started on http://localhost:${PORT}`);
// });

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT,() => {
            console.log(`Server started on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

startServer();

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: err.message
    });
});
