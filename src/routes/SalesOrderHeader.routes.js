import express from "express";
import SalesOrderHeaderController from "../controllers/SalesOrderHeader.Controller.js";

const api = express.Router();

api.get("/SalesOrderHeader", SalesOrderHeaderController.getAllSalesOrderHeaderController);
api.get("/SalesOrderHeader/:id", SalesOrderHeaderController.getSalesOrderHeaderByIdController);
api.post("/SalesOrderHeader", SalesOrderHeaderController.createSalesOrderHeaderController);
api.put("/SalesOrderHeader/:id", SalesOrderHeaderController.updateSalesOrderHeaderController);
api.delete("/SalesOrderHeader/:id", SalesOrderHeaderController.deleteSalesOrderHeaderController);

export default api;