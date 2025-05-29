import express from "express";
import SalesOrderHeaderController from "../controllers/SalesOrderHeader.Controller.js";

const api = express.Router();

api.get(
  "/salesorderheader",
  SalesOrderHeaderController.getAllSalesOrderHeaderController
);
api.delete(
  "/salesorderheader/:id",
  SalesOrderHeaderController.deleteSalesOrderHeaderController
);
api.get(
  "/salesorderheader/monthly",
  SalesOrderHeaderController.getMonthlySales
);
api.get(
  "/salesorderheader/by-category",
  SalesOrderHeaderController.getSalesByProductCategory
);
api.get(
  "/average-shipping-time",
  SalesOrderHeaderController.getAvgShippingTime
);
api.get("/top-sales-month", SalesOrderHeaderController.getTopSalesMonth);
api.post(
  "/salesorderheader/test/insert-orders",
  SalesOrderHeaderController.insertarOrdenesDePrueba
);

export default api;
