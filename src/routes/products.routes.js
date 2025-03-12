import express from "express";
import productController from "../controllers/products.controllers.js";

const api = express.Router();

api.get("/products", productController.getAllProductsController);
api.post("/products", productController.createProductController);
api.put("/products/:id", productController.updateProductController);
api.delete("/products/:id", productController.deleteProductController);
api.get("/products/categories", productController.getAllCategoriesController);

export default api;
