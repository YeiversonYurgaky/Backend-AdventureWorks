import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import customersRoutes from "./routes/customer.routes.js";
import productsRoutes from "./routes/products.routes.js";
import SalesOrderHeader from "./routes/SalesOrderHeader.routes.js";
import SalesOrderDetail from "./routes/SalesOrderDetail.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos una vez al inicio
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use("/api", productsRoutes);
app.use("/api", customersRoutes);
app.use("/api", SalesOrderHeader);
app.use("/api", SalesOrderDetail);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
