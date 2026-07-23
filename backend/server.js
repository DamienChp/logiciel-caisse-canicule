import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";
import customerRoutes from "./routes/customer.route.js";
import brandRoutes from "./routes/brand.route.js";

dotenv.config(); // to use the .env file

const app = express();  // create express app
const PORT = process.env.PORT || 5001

app.use(express.json()); // allow to accept json data in the body

// routes
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/brands", brandRoutes);


app.listen(PORT, () => {
  connectDB(); // connect to the database
  console.log(`server started on http://localhost:${PORT}`);
});


