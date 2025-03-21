import express from "express";
import SalesOrderHeaderController from "../controllers/SalesOrderHeader.Controller.js";

const api = express.Router();

api.get("/salesorderheader", SalesOrderHeaderController.getAllSalesOrderHeaderController);
api.delete("/salesorderheader/:id", SalesOrderHeaderController.deleteSalesOrderHeaderController);

export default api;