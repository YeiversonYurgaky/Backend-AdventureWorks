import express from "express";
import SalesOrderDetailControllers from "../controllers/SalesOrderDetail.controllers.js";

const api = express.Router();

api.get(
  "/salesOrderDetail/top-products",
  SalesOrderDetailControllers.getTopProducts
);

export default api;
