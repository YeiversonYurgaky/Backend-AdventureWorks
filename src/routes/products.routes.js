import express from "express";
import productController from "../controllers/products.controllers.js";

const api = express.Router();

api.get("/products", productController.getAllProductsController);
api.get("/products/:id", productController.getProductByIdController);
api.post("/products", productController.createProductController);
api.put("/products/:id", productController.updateProductController);
api.delete("/products/:id", productController.deleteProductController);

export default api;
